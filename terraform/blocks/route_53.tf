data "aws_route53_zone" "root_domain" {
  name = var.domain
}

resource "aws_route53_record" "alias" {
  name    = var.subdomain
  type    = "A"
  zone_id = data.aws_route53_zone.root_domain.zone_id
  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.root_cdn.domain_name
    zone_id                = aws_cloudfront_distribution.root_cdn.hosted_zone_id
  }
}
