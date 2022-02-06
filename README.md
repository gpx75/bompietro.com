# bompietro.com: ***"U situ di Bompitrara"***

# Nuxt 3 Minimal Starter + Deploy to Cloudflare Worker

We recommend to look at the [documentation](https://v3.nuxtjs.org).

## Setup

Make sure to install the dependencies

```bash
yarn install
```

## Development

Start the development server on http://localhost:3000

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

## Deployment to Cloudflare workers

Login to your Cloudflare Workers account and obtain your account_id from the sidebar.

***Nuxt3 deployment to Cloudflare Workers using Github Actions fails https://github.com/nuxt/framework/issues/1239 solution #1239 https://github.com/nuxt/nitro-demo/blob/main/wrangler.toml***

Create a wrangler.toml in your root directory:


```bash
name = "playground"
type = "javascript"
account_id = "<the account_id you obtained>"
workers_dev = true
route = "bompietro.com/*"
zone_id = ""


[site]
bucket = ".output/public"
entry-point = ".output"

[build]
command = "NITRO_PRESET=cloudflare yarn nuxt build"
upload.format = "service-worker"
```


### Install wrangler and login to your Cloudflare account:

```bash 
npm i @cloudflare/wrangler -g
```

or

```bash 
yarn global add @cloudflare/wrangler
```

Login to cloudflare:

```bash 
wrangler login
```

Generate website with cloudflare preset:

```bash 
NITRO_PRESET=cloudflare yarn build
```

Publish:

```bash 
wrangler publish
```

### Create proxied dns records on cloudflare

```bash 
;; A Records
bompietro.com.	1	IN	A	1.1.1.1

;; CNAME Records
www.bompietro.com.	1	IN	CNAME	bompietro.com.
```

### Edit Page Rule for bompietro.com in Cloudflare 

go to website => workers => Page Rules

* https://www.bompietro.com/ Then the settings are:
* Forwarding URL 
* 301 - Permanent Redirect
* https://bompietro.com


### Deploy within CI/CD using Github Actions

go to your repo => settings => secrets
Create a token according to the wrangler action docs and set CF_API_TOKEN in your repository config on GitHub.

Create .github/workflows/cloudflare.yml:


```javasript
name: cloudflare
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  ci:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ ubuntu-latest ]
        node: [ 14 ]

    steps:
      - uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node }}

      - name: Checkout
        uses: actions/checkout@master

      - name: Cache node_modules
        uses: actions/cache@v2
        with:
          path: node_modules
          key: ${{ matrix.os }}-node-v${{ matrix.node }}-deps-${{ hashFiles(format('{0}{1}', github.workspace, '/yarn.lock')) }}

      - name: Install Dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: yarn

      - name: Build
        run: yarn build
        env:
          NITRO_PRESET: cloudflare

      - name: Publish to Cloudflare
        uses: cloudflare/wrangler-action@1.3.0
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}         
```




