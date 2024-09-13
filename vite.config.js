import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src', // Set the root directory for the Vite server
    build: {
        outDir: '../dist', // Output directory for the built files
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'src/index.html'),
                search: resolve(__dirname, 'src/search.html'),
                results: resolve(__dirname, 'src/results.html'),
                calculator: resolve(__dirname, 'src/calculator.html'),
                analysis: resolve(__dirname, 'src/analysis.html'),
            },
        },
    },
});