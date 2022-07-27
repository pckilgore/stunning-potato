terraform {
  required_version = "~> 1.2.4"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.22.0"
    }
  }

  backend "s3" {
    bucket  = "clouty-terraform-backends"
    key     = "us-east-1/staging/web/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      management = "Terraform"
      repo       = "github.com/cloutyskies/pck-web-next"
    }
  }
}

module "web" {
  source = "../blocks"

  aws_region   = "us-east-1"
  environment  = "staging"
  org_name     = "clouty"
  project_name = "web"

  domain    = "clouty.io"
  subdomain = "staging.app"
  report_url = "https://o1211077.ingest.sentry.io/api/6600273/security/?sentry_key=19b6827eeb1d4f7d965da998276aceea"
}
