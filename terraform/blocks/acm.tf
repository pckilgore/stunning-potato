data "aws_acm_certificate" "issued" {
  domain   = "app.clouty.io"
  statuses = ["ISSUED"]
}
