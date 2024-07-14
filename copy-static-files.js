const shell = require('shelljs');

// Copy static files
shell.cp('-R', 'static/*', 'dist/');
console.log('Static files copied to dist/');