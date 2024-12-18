// Function to transform JSON data into Chart.js compatible data structure
function transformDataForChart(data) {
    // Extract years, avg prices, and counts from the data
    const combinedData = data.year.map((year, index) => ({
        year: year,
        avg: data.avg[index],
        count: data.count[index]
    }));

    // Sort the combined data by year in ascending order
    combinedData.sort((a, b) => a.year - b.year);

    // Separate the sorted data back into individual arrays
    const years = combinedData.map(item => item.year);
    const avgPrices = combinedData.map(item => item.avg);
    const counts = combinedData.map(item => item.count);

    return {
        labels: years, // x-axis labels
        datasets: [
            {
                label: "Average Price (EUR)",
                data: avgPrices, // avg prices data
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            },
            {
                label: "Vehicle Count",
                data: counts, // counts data
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }
        ]
    };
}

async function fetchChartDataAndRender(requestBody) {
    const endpointUrl = 'https://localhost:3000/charts-data';

    // Extract groupByColumns and statFunctions from the requestBody
    const groupByColumns = requestBody.group || [];
    const statFunctions = requestBody.aggregators || [];

    try {
        // Fetch data from the endpoint
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Check for successful response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log('Received data from backend:', rawData);

        // Transform the data into the format expected by the charting function
        if (groupByColumns.length === 1) {
            const transformedData = transformOneDimensionDataForChart(rawData, groupByColumns, requestBody.aggregators);
            const ctx = document.getElementById('vehiclesByMakeChart').getContext('2d');
            generateOneDimensionBarChart(ctx, transformedData);
            return;
        }
        const data = transformData(rawData, groupByColumns, statFunctions);

        // Render the dynamic chart using the transformed data
        generateDynamicChart(data, groupByColumns, statFunctions);
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Function to transform the received data into an array of objects
// Function to transform and sort the received data into an array of objects
function transformData(rawData, groupByColumns, statFunctions) {
    const itemsCount = rawData.itemsCount || Math.min(...groupByColumns.map(col => rawData[col]?.length || 0));

    const transformedData = [];
    for (let i = 0; i < itemsCount; i++) {
        const item = {};
        groupByColumns.forEach(col => {
            item[col] = rawData[col][i];
        });
        statFunctions.forEach(stat => {
            item[stat] = rawData[stat][i];
        });
        transformedData.push(item);
    }

    // Sort the transformed data based on the first groupBy column (X-axis values)
    const xAxisColumn = groupByColumns[0];
    transformedData.sort((a, b) => {
        if (typeof a[xAxisColumn] === 'string') {
            return a[xAxisColumn].localeCompare(b[xAxisColumn]); // Sort alphabetically for strings
        } else {
            return a[xAxisColumn] - b[xAxisColumn]; // Sort numerically for numbers
        }
    });
    console.log('Transformed data:', transformedData);
    return transformedData;
}
let currentChart = null;

// Function to destroy the existing chart if it exists
function destroyExistingChart() {
    if (currentChart !== null) {
        currentChart.destroy(); // Destroy the current chart to avoid reuse errors
        currentChart = null; // Reset the reference to avoid memory leaks
    }
}
// Generate the dynamic chart logic (same as before)
function generateDynamicChart(data, groupByColumns, statFunctions) {
    const ctx = document.getElementById('vehiclesByMakeChart').getContext('2d');

    // Destroy the existing chart before creating a new one
    destroyExistingChart();

    // Create the new chart instance
    if (groupByColumns.length === 1) {

        currentChart = generateBarChart(ctx, data, groupByColumns, statFunctions[0]);
    } else if (groupByColumns.length === 2) {
        currentChart = generateStackedBarChart(ctx, data, groupByColumns, statFunctions[0]);
    } else if (groupByColumns.length === 3) {
        currentChart = generateStackedGroupedBarChart(ctx, data, groupByColumns, statFunctions[0]);
    } else {
        console.error('Currently, we only support up to 3 grouping columns.');
    }
}

// Generate a regular bar chart for one grouping column
function generateBarChart(ctx, data, groupByColumns, statFunctions) {
    const labels = [...new Set(data.map(item => item[groupByColumns[0]]))];

    // Create datasets for each statistical measure (min, avg, median, q_66, max)
    const datasets = statFunctions.map((statFunction, index) => {
        return {
            label: statFunction,
            data: labels.map(label => {
                const entry = data.find(item => item[groupByColumns[0]] === label);
                return entry ? entry[statFunction] : 0;
            }),
            backgroundColor: `rgba(${index * 60}, ${index * 100}, ${index * 150}, 0.7)`, // Unique color for each stat function
        };
    });

    // Create the chart instance with horizontal stacked bars
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Categories on the Y-axis
            datasets: datasets, // Data for each statistical measure
        },
        options: {
            indexAxis: 'y', // Ensure the bars are horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Horizontal Stacked Bar Chart by ${groupByColumns[0]}` },
            },
            scales: {
                x: {
                    stacked: true, // Enable stacking on the X-axis for horizontal bars
                    beginAtZero: true,
                    title: { display: true, text: 'Values' },
                },
                y: {
                    stacked: true, // Ensure the Y-axis is stacked for grouped categories
                    title: { display: true, text: groupByColumns[0] },
                },
            },
        },
    });

    return chart; // Return the chart instance for later reference
}

// Generate a stacked bar chart for two grouping columns
// Generate a stacked bar chart for two grouping columns
function generateStackedBarChart(ctx, data, groupByColumns, statFunction) {
    const xAxisValues = [...new Set(data.map(item => item[groupByColumns[0]]))]; // Unique values from the first group-by column (e.g., year)
    const stackValues = [...new Set(data.map(item => item[groupByColumns[1]]))]; // Unique values from the second group-by column (e.g., make)

    const datasets = stackValues.map((stackValue, index) => ({
        label: stackValue,
        axis: 'y', // Ensure the bars are horizontal,
        fill: false,
        data: xAxisValues.map(xValue => {
            const entry = data.find(item => item[groupByColumns[0]] === xValue && item[groupByColumns[1]] === stackValue);
            return entry ? entry[statFunction] : 0;
        }),
        backgroundColor: `rgba(${index * 60}, ${index * 100}, ${index * 140}, 0.7)`,
    }));

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xAxisValues, // X-axis labels are from the first group-by column
            datasets: datasets,
        },
        options: {
            indexAxis: 'y', // Switch to horizontal bar chart
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Stacked Bar Chart grouped by ${groupByColumns.join(' and ')}` },
            },
            scales: {
                x: { stacked: true, title: { display: true, text: statFunction } },
                y: { stacked: true, title: { display: true, text: groupByColumns[0] } },
            },
        },
    });

    return chart;
}

// Generate a stacked grouped bar chart for three grouping columns
function generateStackedGroupedBarChart(ctx, data, groupByColumns, statFunction) {
    const group1Values = [...new Set(data.map(item => item[groupByColumns[0]]))]; // e.g., Make
    const group2Values = [...new Set(data.map(item => item[groupByColumns[1]]))]; // e.g., Year
    const group3Values = [...new Set(data.map(item => item[groupByColumns[2]]))]; // e.g., Model or Engine Type

    const datasets = group3Values.map((group3, index) => ({
        label: group3,
        axis: 'y', // Ensure the bars are horizontal
        data: group1Values.flatMap(group1 => group2Values.map(group2 => {
            const entry = data.find(item => item[groupByColumns[0]] === group1 && item[groupByColumns[1]] === group2 && item[groupByColumns[2]] === group3);
            return entry ? entry[statFunction] : 0;
        })),
        backgroundColor: `rgba(${index * 50}, ${index * 150}, ${index * 200}, 0.7)`,
    }));

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            аxis: 'y', // Ensure the bars are horizontal
            labels: group1Values.flatMap(group1 => group2Values.map(group2 => `${group1} - ${group2}`)),
            datasets: datasets,
        },
        options: {
            responsive: true,
            indexAxis: 'y', // Switch to horizontal bar chart
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Stacked Grouped Bar Chart grouped by ${groupByColumns.join(', ')}` },
            },
            scales: {
                x: { stacked: true },
                y: { stacked: true },
            },
        },
    });
    return chart;
}

// Function to transform JSON data into Chart.js compatible data structure
function transformOneDimensionDataForChart(rawData, groupByColumns, statFunctions) {
    // Check if the data is in the expected format
    console.log('Group by column', groupByColumns);
    console.log('Group by data', rawData[groupByColumns[0]]);
    console.log('Is array', Array.isArray(rawData[groupByColumns[0]]));
    if (typeof rawData !== 'object' || !Array.isArray(rawData[groupByColumns[0]])) {
        console.error('Data format error: Expected an object with arrays, but received:', rawData);
        return { labels: [], datasets: [] };
    }

    // Transform the data into an array of objects
    const itemsCount = rawData.itemsCount || Math.min(...groupByColumns.map(col => rawData[col]?.length || 0));

    const chartDataArray = [];
    for (let i = 0; i < itemsCount; i++) {
        const item = {};
        groupByColumns.forEach(col => {
            item[col] = rawData[col][i]; // Add grouping columns (e.g., year)
        });
        statFunctions.forEach(stat => {
            if (rawData[stat]) {
                item[stat] = rawData[stat][i]; // Add dynamic stat functions (e.g., min, max, quantile_25)
            }
        });
        chartDataArray.push(item);
    }

    // Sort the transformed data by the first groupBy column (e.g., year)
    const xAxisColumn = groupByColumns[0];
    chartDataArray.sort((a, b) => a[xAxisColumn] - b[xAxisColumn]);

    // Prepare the labels and datasets for Chart.js
    const labels = chartDataArray.map(item => item[xAxisColumn]);
    const datasets = statFunctions.map((stat, index) => ({
        label: stat.charAt(0).toUpperCase() + stat.slice(1), // Capitalize stat function names
        data: chartDataArray.map(item => item[stat]),
        backgroundColor: `rgba(${index * 50 + 100}, ${index * 70 + 80}, ${index * 90 + 60}, 0.7)`, // Dynamic color generation
    }));

    return {
        labels: labels, // X-axis labels
        datasets: datasets // Data for each statistical measure
    };
}

// Function to generate the horizontal stacked bar chart
function generateOneDimensionBarChart(ctx, transformedData) {
    destroyExistingChart(); // Destroy the existing chart before creating a new one
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: transformedData,
        options: {
            indexAxis: 'y', // Ensure the bars are horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Horizontal Stacked Bar Chart by Year' },
            },
            scales: {
                x: {
                    stacked: true, // Enable stacking on the X-axis for horizontal bars
                    beginAtZero: true,
                    title: { display: true, text: 'Price Values' },
                },
                y: {
                    stacked: true, // Ensure the Y-axis is stacked for grouped categories
                    title: { display: true, text: 'Year' },
                },
            },
        },
    });
}

// Listen for form submission to generate the chart from the JSON data
document.getElementById('chartForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const jsonData = document.getElementById('jsonInput').value; // Get JSON data from the textarea

    try {
        const requestBody = JSON.parse(jsonData); // Parse the JSON data

        // Destroy the existing chart before creating a new one
        destroyExistingChart();

        // Call the function to render the chart with the parsed data
        fetchChartDataAndRender(requestBody);
    } catch (error) {
        alert('Invalid JSON format. Please check your input and try again.');
        console.error('JSON parsing error:', error);
    }
});

