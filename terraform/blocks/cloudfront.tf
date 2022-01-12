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
    cached_methods   = ["HEAD", "GET", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 20
    max_ttl                = 300
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }
  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.issued.arn
    ssl_support_method  = "vip"
  }


  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
