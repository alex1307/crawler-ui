#!/bin/bash
#yarn cache clean
yarn install
yarn upgrade
echo "Building project"
yarn build --emptyOutDir
echo "Copying img folder to dist"
cp -R img/ dist/img 
cp -R locales/ dist/locales 
echo "Copying assets folder to dist"
yarn copy-assets
echo "Copying views folder to dist"
pm2 restart server
echo "Deployed successfully"