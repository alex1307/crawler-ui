import { summaryChart } from "../charts/chart-handler";
import { cleanObject } from '../common/common-functions.js';
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvasId = 'chartCanvas'; // The canvas ID where the chart will be rendered
    const apiUrl = `${window.location.hostname === 'localhost' ? 'https://localhost:3000' : 'https://ehomeho.com:3000'}/data-stat`;

    // Retrieve filters from local storage
    const filter = JSON.parse(localStorage.getItem('requestData')) || {};
    const cleandedFilter = cleanObject(filter);

    // Show the chart using the distributionChart function
    renderChart(apiUrl, cleandedFilter, chartCanvasId);
});


/**
 * Renders the chart by calling the API and displaying the data.
 * @param {string} apiUrl - The API endpoint for fetching the chart data.
 * @param {Object} payload - The JSON payload for the API call.
 * @param {string} canvasId - The ID of the canvas element where the chart will be rendered.
 */
async function renderChart(apiUrl, payload, canvasId) {
    try {
        const json = JSON.stringify(payload, null, 2);
        const jsonDisplay = document.getElementById("jsonDisplay");
        jsonDisplay.textContent = json;
        // Call the distributionChart function to render the chart
        await summaryChart(apiUrl, payload, canvasId);
    } catch (error) {
        console.error('Error rendering the chart:', error);
        alert('Failed to render chart. Please try again later.');
    }
}


