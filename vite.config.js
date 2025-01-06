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
                calculator_results: resolve(__dirname, 'src/calculator_results.html'),
                calculator_chart: resolve(__dirname, 'src/calculator_chart.html'),
                calculator: resolve(__dirname, 'src/calculator.html'),
                analysis: resolve(__dirname, 'src/analysis.html'),
                analysis_results: resolve(__dirname, 'src/analysis_results.html'),
                analysis_chart: resolve(__dirname, 'src/analysis_chart.html'),
                charts: resolve(__dirname, 'src/charts.html'),
                enhanced: resolve(__dirname, 'src/enhanced_charts.html'),
            },
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true
        },
    },
});