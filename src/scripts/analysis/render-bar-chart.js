import { cleanObject } from '../common/common-functions.js';
document.addEventListener('DOMContentLoaded', async () => {
    const chartCanvasId = 'chartCanvas'; // The canvas ID where the chart will be rendered
    const apiUrl = `${window.location.hostname === 'localhost' ? 'https://localhost:3000' : 'https://ehomeho.com:3000'}/analysis-chart`;

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


async function summaryChart(apiUrl, requestData, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response JSON
        const data = await response.json();

        // Adjust canvas height based on the number of labels
        const labelsCount = data.labels.length; // Number of labels (categories)
        const baseHeight = 50; // Base height per label
        const maxHeight = window.innerHeight * 0.8; // Limit height to 80% of the screen height
        canvas.height = Math.min(labelsCount * baseHeight, maxHeight);

        // Prepare the chart data
        const chartData = prepareChartData(data);

        // Destroy any existing chart instance
        if (window.chartInstance) {
            window.chartInstance.destroy();
        }

        // Create the new Chart.js instance
        window.chartInstance = new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y", // Horizontal orientation
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                    },
                },
            },
        });
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Transforms API response into Chart.js-compatible data format.
 * @param {Object} apiResponse - The response from the API, containing `labels` and `datasets`.
 * @returns {Object} - The data object for Chart.js.
 */
function prepareChartData(apiResponse) {
    // Extract `labels` and `datasets` directly from the API response
    const { labels, datasets } = apiResponse;


    return {
        labels, // X-axis labels
        datasets, // Data for stacked bars
    };
}

/**
 * Helper function to generate random colors for chart datasets.
 * @param {number} count - The number of colors to generate.
 * @returns {Array<string>} - Array of RGBA color strings.
 */
function generateRandomColors(count) {
    return Array.from({ length: count }, () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
    );
}