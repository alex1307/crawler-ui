import ChartDataLabels from 'chartjs-plugin-datalabels';

const isLocalhost = window.location.hostname === 'localhost';
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

let chartInstance = null;
/**
 * Transforms the API response into a Chart.js-compatible format.
 * Supports 1D, 2D (stacked bars), and 3D (grouped stacks) data.
 * @param {Object} source - The API response containing dimensions and data.
 * @returns {Object} Chart.js data object.
 */
function prepareChartData(source) {
    const { dimensions, data } = source;

    const uniqueValues = dimensions.map(dim => Array.from(new Set(dim.data)));
    const [d1, d2 = [], d3 = []] = uniqueValues;

    const groupedData = {};
    d1.forEach(val1 => {
        groupedData[val1] = d2.length > 0 ? {} : 0;
        if (d2.length > 0) {
            d2.forEach(val2 => {
                groupedData[val1][val2] = d3.length > 0 ? {} : 0;
                if (d3.length > 0) {
                    d3.forEach(val3 => (groupedData[val1][val2][val3] = 0));
                }
            });
        }
    });

    dimensions[0].data.forEach((val1, index) => {
        const val2 = dimensions[1]?.data[index];
        const val3 = dimensions[2]?.data[index];
        const count = data[index]?.count || 0;

        if (d2.length > 0 && d3.length > 0) {
            groupedData[val1][val2][val3] += count;
        } else if (d2.length > 0) {
            groupedData[val1][val2] += count;
        } else {
            groupedData[val1] += count;
        }
    });

    if (d3.length > 0) {
        return {
            labels: d1,
            datasets: d2.flatMap(val2 =>
                d3.map(val3 => ({
                    label: `${val2} (${val3})`,
                    data: d1.map(val1 => groupedData[val1][val2][val3] || 0),
                    backgroundColor: randomColor(),
                    stack: val2,
                }))
            ),
        };
    } else if (d2.length > 0) {
        return {
            labels: d1,
            datasets: d2.map(val2 => ({
                label: val2,
                data: d1.map(val1 => groupedData[val1][val2] || 0),
                backgroundColor: randomColor(),
                stack: 'stack',
            })),
        };
    } else {
        return {
            labels: d1,
            datasets: [
                {
                    label: 'Count',
                    data: d1.map(val1 => groupedData[val1] || 0),
                    backgroundColor: randomColor(),
                },
            ],
        };
    }
}

/**
 * Generates a random RGBA color.
 * @returns {string} Random RGBA color string.
 */
function randomColor() {
    return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
}


/**
 * Fetches data from the API and draws a Chart.js chart on the provided canvas.
 * @param {string} apiUrl - The API endpoint to fetch data from.
 * @param {Object} requestData - The payload to send to the API.
 * @param {string} canvasId - The ID of the canvas where the chart will be drawn.
  */
export async function summaryChart(apiUrl, requestData, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Prepare the chart data
        const chartData = prepareChartData(data);

        // Destroy the previous chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        // Create the new Chart.js instance
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: chartData.datasets.length > 1 },
                },
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true },
                },
            },
        });
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}


/**
 * Updates the chart with the specified metric.
 * @param {Object} data - The data object containing bins and counts.
 * @param {number} total - The total count used for percentage calculations.
 * @param {string} metric - The metric to display (e.g., 'count', 'price').
 * @param {string} canvasId - The ID of the canvas where the chart will be drawn.
 */
export async function distributionChart(apiUrl, requestData, canvasId) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const total = data.count;
    let metric = 'count';
    const median = Math.floor(data.median || 0);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    const labels = data.data.map((bin) => {
        const min = Math.floor(bin.min / 1000);
        const max = Math.floor(bin.max / 1000);
        return `${min}K-${max}K`;
    });

    const metricData = metric === 'count'
        ? data.data.map(bin => bin.count)
        : data.data.map(bin => bin[metric]);

    const curveData = metric === 'count'
        ? metricData.map((value, index, arr) => {
            if (index === 0 || index === arr.length - 1) return value / 2;
            return value;
        })
        : [];

    const percentages = metric === 'count'
        ? data.data.reduce((cumulative, bin, index) => {
            cumulative.total += bin.count;
            cumulative.values.push(Math.round((cumulative.total / total) * 100));
            return cumulative;
        }, { total: 0, values: [] }).values
        : [];

    // Destroy the previous chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    // Create the new chart instance
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: metric.charAt(0).toUpperCase() + metric.slice(1),
                    data: metricData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                ...(metric === 'count' ? [{
                    label: 'Distribution Curve',
                    data: curveData,
                    type: 'line',
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.4,
                }] : []),
            ],
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    display: metric === 'count',
                    color: '#000',
                    anchor: 'center',
                    align: 'center',
                    font: {
                        weight: 'bold',
                        size: 14,
                    },
                    formatter: (value, context) => {
                        return metric === 'count' ? `${percentages[context.dataIndex]}%` : '';
                    },
                },
                annotation: {
                    annotations: {
                        medianLine: {
                            type: 'line',
                            borderColor: 'black',
                            borderWidth: 3,
                            xMin: 1,
                            xMax: 1,
                            label: {
                                content: `Median: ${median}`,
                                enabled: true,
                                position: 'end',
                                color: 'black',
                                font: {
                                    size: 12,
                                    style: 'bold',
                                },
                            },
                        },
                    }
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: metric.charAt(0).toUpperCase() + metric.slice(1),
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Price Ranges',
                    },
                },
            },
        },
        plugins: [ChartDataLabels],
    });
}


/**
 * Fetch data from API and render chart dynamically.
 * @param {string} apiUrl - The API endpoint URL.
 * @param {Object} payload - The JSON payload for the API request.
 * @param {string} canvasId - The ID of the canvas where the chart will be rendered.
 * @param {string} chartType - Type of chart to render ('distribution' or 'summary').
 */
export function fetchAndRenderChart(apiUrl, payload, canvasId, chartType) {
    console.log(`Request Payload for ${chartType} Chart:`, JSON.stringify(payload, null, 2));

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`API Response for ${chartType} Chart:`, data);

            // Render chart based on the chart type
            if (chartType === 'distribution') {
                distributionChart(apiUrl, payload, canvasId);
            } else if (chartType === 'summary') {
                summaryChart(apiUrl, payload, canvasId);
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${chartType} chart:`, error);
        });
}

/**
 * Generate JSON payload dynamically based on selected chart type
 * and render the appropriate chart.
 * @param {string} chartType - Type of chart ('distribution' or 'summary').
 */
export function generateAndRenderChart(chartType) {
    const column = "price_in_eur";
    const filter = getFilterValues();

    if (chartType === 'distribution') {
        const payload = getDistributionPayload(column, filter);
        fetchAndRenderChart(`${baseUrl}/data-distribution`, payload, 'chartCanvas', chartType);
    } else if (chartType === 'summary') {
        const payload = getSummaryPayload(column, filter);
        fetchAndRenderChart(`${baseUrl}/data-stat`, payload, 'chartCanvas', chartType);
    }
}

function getFilterValues() {
    return {
        make: document.getElementById('make').value || null,
        model: document.getElementById('model').value || null,
        engine: Array.from(document.querySelectorAll('#engine input[type="checkbox"]:checked'))
            .map(e => e.value) || null,
        gearbox: document.getElementById('gearbox').value || null,
        yearFrom: parseInt(document.getElementById('yearFrom').value, 10) || null,
        yearTo: parseInt(document.getElementById('yearTo').value, 10) || null,
        powerFrom: parseInt(document.getElementById('powerFrom').value, 10) || null,
        powerTo: parseInt(document.getElementById('powerTo').value, 10) || null,
        mileageFrom: parseInt(document.getElementById('mileageFrom').value, 10) || null,
        mileageTo: parseInt(document.getElementById('mileageTo').value, 10) || null,
        order: []
    };
}

function getDistributionPayload(column, filter) {
    const distributionType = document.querySelector('input[name="distributionType"]:checked').value;
    const numberOfBins = parseInt(document.querySelector('input[name="numberOfBins"]').value, 10) || 5;
    const all = document.getElementById('filterData').checked;

    return {
        column,
        filter,
        all,
        distribution_type: distributionType,
        number_of_bins: numberOfBins
    };
}

function getSummaryPayload(column, filter) {
    // Extract selected group-by fields
    const groupBy = Array.from(
        document.querySelectorAll('.group-by-column-checkbox-grid input[type="checkbox"]:checked')
    )
        .map(checkbox => checkbox.id.replace('groupBy', '').toLowerCase())
        .filter(value => value);

    // Extract selected statistical functions
    const aggregators = Array.from(
        document.querySelectorAll('.functions-checkbox-grid input[type="checkbox"]:checked')
    )
        .map(checkbox => checkbox.id.replace('stat', '').toLowerCase())
        .filter(value => value);

    // Build the payload
    const payload = {
        search: filter.search || null,
        make: filter.make || null,
        model: filter.model || null,

        engine: filter.engine && filter.engine.length > 0 ? filter.engine : null,
        gearbox: filter.gearbox || null,

        yearFrom: filter.yearFrom || null,
        yearTo: filter.yearTo || null,
        year: filter.year || null,

        powerFrom: filter.powerFrom || null,
        powerTo: filter.powerTo || null,
        power: filter.power || null,

        mileageFrom: filter.mileageFrom || null,
        mileageTo: filter.mileageTo || null,
        mileage: filter.mileage || null,

        ccFrom: filter.ccFrom || null,
        ccTo: filter.ccTo || null,
        cc: filter.cc || null,

        saveDiffFrom: filter.saveDiffFrom || null,
        saveDiffTo: filter.saveDiffTo || null,

        discountFrom: filter.discountFrom || null,
        discountTo: filter.discountTo || null,

        createdOnFrom: filter.createdOnFrom || null,
        createdOnTo: filter.createdOnTo || null,

        group: groupBy.length > 0 ? groupBy : null,
        aggregators: aggregators.length > 0 ? aggregators : null,

        order: [
            {
                column: "year",
                asc: true
            }
        ],

        stat_column: column || null,
        estimated_price: filter.estimatedPrice || null,
        price: filter.price || null,
        priceFrom: filter.priceFrom || null,
        priceTo: filter.priceTo || null,
    };

    // Remove keys with null or undefined values
    return Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== null && value !== undefined));
}


/**
 * Toggles the display of elements with a specific class and updates the button label.
 * @param {string} buttonId - The ID of the button that triggers the toggle.
 * @param {string} elementsClass - The class of the elements to toggle.
 * @param {string} showLabel - The label to display when elements are shown.
 * @param {string} hideLabel - The label to display when elements are hidden.
 */
export function setupToggle(buttonId, elementsClass, showLabel, hideLabel) {
    document.getElementById(buttonId).addEventListener('click', function () {
        const elements = document.querySelectorAll(`.${elementsClass}`);
        if (elements.length === 0) {
            return;
        }


        const isHidden = elements[0].style.display === 'none';
        elements.forEach(element => {
            element.style.display = isHidden ? 'inline-block' : 'none';
        });

        this.textContent = isHidden ? hideLabel : showLabel;
    });
}