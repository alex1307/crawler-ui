#!/bin/bash

echo "Building project"
yarn build --emptyOutDir
echo "Copying img folder to dist"
cp -R img/ dist/img 
echo "Copying assets folder to dist"
yarn copy-assets
echo "Copying views folder to dist"
pm2 restart server
echo "Deployed successfully"