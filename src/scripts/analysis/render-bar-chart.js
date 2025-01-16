import { cleanObject } from '../common/common-functions.js';
const apiUrl = `${window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api'}/pivot-chart`;
document.addEventListener('DOMContentLoaded', async () => {
    const chartCanvasId = 'chartCanvas'; // The canvas ID where the chart will be rendered
    const pivotData = JSON.parse(localStorage.getItem('pivotData')) || {};
    const cleandedFilter = cleanObject(pivotData);
    const requestData = JSON.parse(localStorage.getItem('requestData'));
    populateDropdowns(requestData);
    populateStatFunctions();
    renderChart(apiUrl, cleandedFilter, chartCanvasId);
});

document.addEventListener('DOMContentLoaded', function () {
    registerEventListeners();
});

document.querySelectorAll('input[name="chartType"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        const pivotData = JSON.parse(localStorage.getItem('pivotData')) || {};
        const cleandedFilter = cleanObject(pivotData);
        summaryChart(apiUrl, cleandedFilter, 'chartCanvas');
    });
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
        const selectedChartType = document.querySelector('input[name="chartType"]:checked').value;
        const isStacked = selectedChartType === "stacked";
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
                        stacked: isStacked,
                        beginAtZero: true,
                    },
                    y: {
                        stacked: isStacked,
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

function populateDropdowns(data) {
    const group = data.group;

    // Populate the X column dropdown (Primary Group)
    const xColumn = document.getElementById("xColumn");
    xColumn.innerHTML = group.map((value) => `<option value="${value}">${value}</option>`).join("");

    // Update dependent dropdowns when the X column changes
    xColumn.addEventListener("change", () => updateDependentDropdowns(group));

    // Initial population of dependent dropdowns
    updateDependentDropdowns(group);
}

function updateDependentDropdowns(group) {
    const xColumnValue = document.getElementById("xColumn").value;
    const restGroup = group.filter((value) => value !== xColumnValue);
    const pivotColumn = document.getElementById("pivotColumn");
    pivotColumn.innerHTML = `<option value="">Please select...</option>` +
        restGroup.map((value) => `<option value="${value}">${value}</option>`).join("");
}

const statFunctions = [
    { value: "count", label: "Count" },
    { value: "min", label: "Minimum" },
    { value: "max", label: "Maximum" },
    { value: "mean", label: "Mean" },
    { value: "median", label: "Median" },
    { value: "sum", label: "Sum" },
    { value: "avg", label: "Average" },
    { value: "std", label: "Standard Deviation" },
    { value: "rsd", label: "Relative Standard Deviation" },
    { value: "quantile_60", label: "60th Percentile" },
    { value: "quantile_66", label: "66th Percentile" },
    { value: "quantile_70", label: "70th Percentile" },
    { value: "quantile_75", label: "75th Percentile" },
    { value: "quantile_80", label: "80th Percentile" },
    { value: "quantile_90", label: "90th Percentile" },
];

// Populate the Y function dropdown with user-friendly labels
function populateStatFunctions() {
    const yFunctionDropdown = document.getElementById("yFunction");

    if (yFunctionDropdown) {
        yFunctionDropdown.innerHTML = statFunctions
            .map((func) => `<option value="${func.value}">${func.label}</option>`)
            .join("");

        // Set a default value (optional)
        yFunctionDropdown.value = "count";
    } else {
        console.error("Element with id 'yFunction' not found.");
    }
}

function registerEventListeners() {

    const drawChartButton = document.getElementById("chartButton");
    drawChartButton.addEventListener("click", function () {
        // Retrieve the StatisticSearchPayload from localStorage
        const requestData = JSON.parse(localStorage.getItem("requestData"));
        if (document.getElementById('xColumn').value) {
            requestData.order.push({
                column: document.getElementById('xColumn').value,
                asc: document.querySelector('input[name="axisOrder"]:checked').value === 'asc'
            });
        }


        // Get the values from the dropdowns
        const xColumn = document.getElementById("xColumn").value;
        const pivotColumn = document.getElementById("pivotColumn").value || null; // Optional
        const yFunction = document.getElementById("yFunction").value;

        // Construct the PivotData object
        const pivotData = {
            x_column: xColumn,
            y_column: requestData.stat_column || "default_column", // Replace "default_column" with a fallback value if needed
            y_function: yFunction,
            pivot_column: pivotColumn,
            filter: requestData, // Use the StatisticSearchPayload from localStorage
        };

        // Store the PivotData in localStorage for use in the next page
        localStorage.setItem("pivotData", JSON.stringify(pivotData));

        // Navigate to the analysis_chart.html page
        window.location.href = "analysis_chart.html";
    });

}