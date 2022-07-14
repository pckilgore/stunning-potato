resource "aws_s3_bucket" "root" {
  bucket = "${var.subdomain}.${var.domain}"
}

resource "aws_s3_bucket_acl" "root" {
  bucket = aws_s3_bucket.root.id
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "root" {
  bucket = aws_s3_bucket.root.bucket

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://*.${var.domain}"]
    max_age_seconds = 3000
    expose_headers  = ["ETag"]
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.root.id

  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  ignore_public_acls      = true
}

resource "aws_s3_bucket_versioning" "root" {
  bucket = aws_s3_bucket.root.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_policy" "root" {
  bucket = aws_s3_bucket.root.id
  policy = data.aws_iam_policy_document.root.json
}
