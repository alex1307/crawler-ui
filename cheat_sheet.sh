#!/usr/bin/env node
yarn build --no-cache --dist-dir ./dist
yarn install
yarn build
yarn global add serve
serve -s dist -l 3124

 yarn upgrade --registry https://registry.yarnpkg.com