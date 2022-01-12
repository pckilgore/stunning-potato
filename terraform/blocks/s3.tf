resource "aws_s3_bucket" "root" {
  bucket = "${var.subdomain}.${var.domain}"
  acl    = "private"

  versioning {
    enabled = true
  }

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://*.${var.domain}"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "root" {
  bucket = aws_s3_bucket.root.id
  policy = data.aws_iam_policy_document.root.json
}
