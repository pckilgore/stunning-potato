terraform {
  required_version = ">= 1.2.4"

  required_providers {
    aws = ">= 4.22.0"
  }

  backend "s3" {
    bucket  = "clouty-terraform-backends"
    key     = "us-east-1/production/web/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = "us-east-1"
}

module "web" {
  source = "../blocks"

  aws_region   = "us-east-1"
  environment  = "production"
  org_name     = "clouty"
  project_name = "web"

  domain    = "clouty.io"
  subdomain = "app"
}

