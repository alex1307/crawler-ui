import { distributionCurve } from '../charts/chart-handler.js';
import { cleanObject } from '../common/common-functions.js';

/**
 * Initializes the chart logic.
 * Fetches the filter and distribution payload, and renders the chart.
 */
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvasId = 'chartCanvas'; // The canvas ID where the chart will be rendered
    const apiUrl = `${window.location.hostname === 'localhost' ? 'https://localhost:3000' : 'https://ehomeho.com:3000'}/data-distribution`;

    // Retrieve filters from local storage
    const filter = JSON.parse(localStorage.getItem('requestData')) || {};
    const payload = getDistributionPayload("price_in_eur", filter);

    // Show the chart using the distributionChart function
    renderChart(apiUrl, payload, chartCanvasId);
});

/**
 * Constructs the payload for the API call.
 * @param {string} column - The column for which the distribution is calculated.
 * @param {Object} filter - The filter object containing search criteria.
 * @returns {Object} The payload for the API call.
 */
function getDistributionPayload(column, filter) {
    const numberOfBins = parseInt(localStorage.getItem("numberOfBins"), 10) || 5;
    const all = localStorage.getItem("clearData") === "true";

    // Create the payload
    const payload = {
        column,
        filter,
        all,
        distribution_type: 'ByInterval',
        number_of_bins: numberOfBins
    };

    return cleanObject(payload);
}



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
        await distributionCurve(apiUrl, payload, canvasId);
    } catch (error) {
        console.error('Error rendering the chart:', error);
        alert('Failed to render chart. Please try again later.');
    }
}