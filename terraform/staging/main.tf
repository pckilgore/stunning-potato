provider "aws" {
  region = "us-east-1"
}

terraform {
  # Passed in via CLI as `-backend-config=./default_backend.conf` or `-backend-config="key=value"`
  # See https://www.terraform.io/docs/language/settings/backends/configuration.html#partial-configuration
  backend "s3" {}
}

variable "environment" {
  default = "staging"
}

variable "subdomain" {
  default = "staging.app"
}

module "web" {
  source = "../blocks"

  domain       = var.domain
  subdomain    = var.subdomain
  environment  = var.environment
  project_name = var.project_name
  org_name     = var.org_name
  aws_region   = var.aws_region
}

