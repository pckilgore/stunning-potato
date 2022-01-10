include .env
.PHONY := default init info install env env-push
.DEFAULT_GOAL := default

AWS ?= AWS_PROFILE=clouty AWS_REGION=us-east-1 aws
AWS_ENV_BUCKET = clouty-environments
SHELL := /bin/bash
PROJECT_NAME ?= ${TF_VAR_project_name}
TERRAFORM ?= AWS_PROFILE=clouty terraform

default:
	@ mmake help

# display runtime info
info:
	@ echo "node $(shell node --version)"
	@ echo "npm $(shell npm --version)"
	@ echo "yarn $(shell yarn --version)"
	@ echo "$(shell aws --version)"

# initialize project
init: | env install

# install dependencies
install:
	@ yarn --prefer-offline

# build project
build:
	@ yarn build

# test project
test:
	@ CI=true yarn test

env:
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env .env
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.development.local .env.development.local
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.staging.local .env.staging.local
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.test.local .env.test.local
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.production.local .env.production.local
	
# push environment files
env-push:
	@ ${AWS} s3 cp .env s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env --sse
	@ ${AWS} s3 cp .env.development.local s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.development.local --sse
	@ ${AWS} s3 cp .env.staging.local s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.staging.local --sse
	@ ${AWS} s3 cp .env.test.local s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.test.local --sse
	@ ${AWS} s3 cp .env.production.local s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.production.local --sse

# fetch graphql schema
schema:
	@ ${AWS} appsync get-introspection-schema --api-id ${APPSYNC_API_ID} --format JSON schema.json

# generate types from graphql schema
gen-types: schema |
	yarn gql:typegen

# terraform init TARGET_ENV
tf-init:
	$(eval TARGET_ENV=$(filter-out $@, $(MAKECMDGOALS)))
	$(if ${TARGET_ENV},@true,$(error "TARGET_ENV is required"))
	cd terraform/${TARGET_ENV} && terraform init

# terraform plan TARGET_ENV
tf-plan:
	$(eval TARGET_ENV=$(filter-out $@, $(MAKECMDGOALS)))
	$(if ${TARGET_ENV},@true,$(error "TARGET_ENV is required"))
	cd terraform/${TARGET_ENV} && terraform plan

# terraform apply TARGET_ENV
tf-apply:
	$(eval TARGET_ENV=$(filter-out $@, $(MAKECMDGOALS)))
	$(if ${TARGET_ENV},@true,$(error "TARGET_ENV is required"))
	cd terraform/${TARGET_ENV} && terraform apply

%:
	@ true