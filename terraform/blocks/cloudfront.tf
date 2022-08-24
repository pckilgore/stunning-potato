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

    // Managed Policy: CachingOptimized
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
    // Recommended for S3
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    // Managed Policy: CORS-S3Origin
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"

    viewer_protocol_policy = "redirect-to-https"

    response_headers_policy_id = aws_cloudfront_response_headers_policy.header_policy.id

    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.response_fn.arn
    }
  }

  custom_error_response {
    error_caching_min_ttl = var.environment == "production" ? 300 : 5
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
    content_security_policy {
      content_security_policy = "default-src 'self';script-src 'self' ${var.environment != "production" ? "'unsafe-inline'" : ""} *.google-analytics.com *.googleapis.com;img-src 'self' data:;font-src 'self' data:;connect-src 'self' *.app.io *.sentry.io *.amazonaws.com https://api.pwnedpasswords.com;report-uri ${var.report_url}&sentry_environment=${var.environment}"
      override                = true
    }

    content_type_options {
      override = true
    }

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
  name    = replace("${var.subdomain}_${var.domain}-response", "/[\\*\\.]/", "_")
  runtime = "cloudfront-js-1.0"
  comment = "Strips CodeBuild headers"
  publish = true
  code    = file("${path.module}/response.js")
}
