import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src', // Set the root directory for the Vite server
    build: {
        outDir: '../dist', // Output directory for the built files
        rollupOptions: {
            input: {
                search: resolve(__dirname, 'src/search.html'),
                results: resolve(__dirname, 'src/results.html'),
                price_calculator: resolve(__dirname, 'src/price_calculator.html'),
                analysis: resolve(__dirname, 'src/analysis.html'),
            },
        },
    },
});