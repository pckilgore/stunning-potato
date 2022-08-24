data "aws_acm_certificate" "issued" {
  domain   = "app.app.io"
  statuses = ["ISSUED"]
}
