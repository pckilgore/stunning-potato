include .env
.PHONY := default init info install env env-push
.DEFAULT_GOAL := default

AWS ?= AWS_REGION=us-east-1 aws
AWS_ENV_BUCKET = clouty-environments
SHELL := /bin/bash
PROJECT_NAME ?= web
TERRAFORM ?= terraform

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

# build project - production
build-production:
	@ REACT_APP_ENV=production yarn build

# build project - staging
build-staging:
	@ REACT_APP_ENV=staging yarn build

# lint project
lint:
	@ yarn lint

# test project
test:
	@ yarn test

# test project ci/cd
test-ci:
	@ yarn test:ci

# typescript compile project
compile:
	@ yarn compile

env:
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env .env
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.development .env.development
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.staging .env.staging
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.test .env.test
	@ ${AWS} s3 cp s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.production .env.production
	
# push environment files
env-push:
	@ ${AWS} s3 cp .env s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env --sse
	@ ${AWS} s3 cp .env.development s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.development --sse
	@ ${AWS} s3 cp .env.staging s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.staging --sse
	@ ${AWS} s3 cp .env.test s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.test --sse
	@ ${AWS} s3 cp .env.production s3://${AWS_ENV_BUCKET}/${PROJECT_NAME}/.env.production --sse

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
	cd terraform/${TARGET_ENV} && ${TERRAFORM} init -migrate-state -backend-config=./default_backend.conf -upgrade

# terraform plan TARGET_ENV
tf-plan:
	$(eval TARGET_ENV=$(filter-out $@, $(MAKECMDGOALS)))
	$(if ${TARGET_ENV},@true,$(error "TARGET_ENV is required"))
	cd terraform/${TARGET_ENV} && ${TERRAFORM} plan

# terraform apply TARGET_ENV
tf-apply:
	$(eval TARGET_ENV=$(filter-out $@, $(MAKECMDGOALS)))
	$(if ${TARGET_ENV},@true,$(error "TARGET_ENV is required"))
	cd terraform/${TARGET_ENV} && ${TERRAFORM} apply

%:
	@ true