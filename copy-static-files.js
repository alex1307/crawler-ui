const shell = require('shelljs');

// Copy static files
shell.cp('-R', 'static/**/*', 'dist/');
shell.cp('-R', 'src/assets/images/ ', 'dist/assets/images/');
console.log('Static files copied to dist/');