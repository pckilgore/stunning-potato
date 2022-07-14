resource "aws_cloudfront_origin_access_identity" "default" {
  comment = "AWS managed/owned, allow cloudfront to use a bucket as an origin"
}

locals {
  s3_origin_id = "S3-${var.subdomain}-${var.domain}"
}

resource "aws_cloudfront_distribution" "root_cdn" {
  aliases             = ["${var.subdomain}.${var.domain}"]
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name = aws_s3_bucket.root.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id
    compress         = true

    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.header_policy.id

    // Overrides no-cache, no-store, private.  We better have a very good reason
    // to want to do that, so zero is a good value (and the default value,
    // actually if we don't set it, but let's be explicit).
    min_ttl = 0

    // Only check for new origin files once every day (if no specificied by
    // origin). Since we don't currently specify any cache headers at the origin,
    // this is going to apply to every file.
    default_ttl = 86400

    // This technically caps the TTL implied by the origin, so we set it to one 
    // year so as to let the origin request a TTL up to that long.
    max_ttl = 31536000

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type = "viewer-response"
      function_arn = aws_cloudfront_function.response_fn.arn
    }
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.issued.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "header_policy" {
  name = replace("default_headers_${var.subdomain}_${var.domain}", "/[\\*\\.]/", "_")

  security_headers_config {
    // Only allow internal IFRAMEing of site
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }

    // Forbid non-ssl connections and instruct browsers to automatically use
    // https in all future connections.
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      override                   = true
      preload                    = true
    }
  }
}

resource "aws_cloudfront_function" "response_fn" {
  name = replace("${var.subdomain}_${var.domain}-response", "/[\\*\\.]/", "_")
  runtime = "cloudfront-js-1.0"
  comment = "Strips CodeBuild headers"
  publish = true
  code    = file("${path.module}/response.js")
}
