import { mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join } from 'path';

// Source and destination directories
const srcDir = join('./', 'src', 'assets', 'templates');
const destDir = join('./', 'dist', 'assets', 'templates');

// Ensure the destination directory exists
mkdirSync(destDir, { recursive: true });

// Copy each file from source to destination
readdirSync(srcDir).forEach(file => {
    const srcFile = join(srcDir, file);
    const destFile = join(destDir, file);
    copyFileSync(srcFile, destFile);
    console.log(`Copied ${srcFile} to ${destFile}`);
});