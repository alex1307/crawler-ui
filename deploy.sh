 rm -rf dist/
 yarn upgrade --registry https://registry.yarnpkg.com
 yarn copyfiles -u 1 src/assets/images/* dist 
 yarn copyfiles -u 1 static/**/* dist         
 yarn build --no-cache   
 yarn serve