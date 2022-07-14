# Web

Clouty core trading web application.

## Quickstart 

Scripting is automated via `taskfile.yml`. A successful `task init` command should be
enough to get you up and running. Use `task --list` for additional helpful
commands.

# Longstart 

## Environment

Requires:
 - `terraform`
 - `yarn` classic (v1)
 - [`task`](https://taskfile.dev/installation/)
 - `aws` cli v2
 - `node`

Suggest:
 - [`fnm`](https://github.com/Schniz/fnm) to automatically use correct node version
 - [`tfswitch`](https://tfswitch.warrensbox.com/) to automatically use correct
     terraform versin
 - [`direnv`](https://direnv.net/) to automate the above tools as well as
     override environment etc.

Secrets:
 - IAM credentials sufficient to access correct S3 bucket

## Tooling / Techs

 - React / Typescript
 - [tailwindcss](https://tailwindcss.com) 
 - [vitejs](https://vitejs.dev/) Bundler/dev server
 - [vitest](https://vitest.dev/) Test runner
