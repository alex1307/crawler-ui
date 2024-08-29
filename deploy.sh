 rm -rf dist/

#yarn upgrade --registry https://registry.yarnpkg.com
 yarn build --no-cache   
 sleep 1
 yarn copyfiles -u 1 src/assets/images/* dist 
 yarn copyfiles -u 1 src/assets/templates/* dist
#  sleep 1
#  yarn copyfiles -u 1 static/**/* dist       
 sleep 1
#  yarn serve


node copyTemplates.mjs
node copy-static-files.js
pm2 start ecosystem.config.js