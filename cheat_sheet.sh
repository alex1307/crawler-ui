#!/usr/bin/env node
yarn build --no-cache --dist-dir ./dist
yarn install
yarn build
yarn global add serve
serve -s dist -l 3124

 yarn upgrade --registry https://registry.yarnpkg.com
 yarn copyfiles -u 1 src/assets/images/* dist 
 yarn copyfiles -u 1 static/**/* dist         
 yarn build --no-cache                               
