document.addEventListener('DOMContentLoaded', () => {
    // Define the data structure for the fetch request
    // This is based on the assumption of what your server might expect
    // Adjust according to your actual server expectations if needed
    const requestData = {
        group_by: ["source", "year"],
        aggregate: {
            price: ["max", "count", { "quantile": 0.25 }]
        },
        sort: [{ "asc": ["year", true] }, { "asc": ["source", true] }],
        filter_i32: [],
        filter_f64: [],
        filter_string: [],
    };

    fetch('http://127.0.0.1:3000/json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => response.json())
        .then(data => {
            // Assuming 'data' is the structure you've provided, or adjust the following functions as necessary
            const transformedData = transformDataForChart(data);
            createTableFromData(data, 'table-container');
            generateChart(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function transformDataForChart(data) {
    let chartData = {};

    for (let i = 0; i < data.year.length; i++) {
        const year = data.year[i];
        const source = data.source[i];
        const quantile = data["price_quantile_0.25"][i];

        if (!chartData[year]) chartData[year] = {};
        if (!chartData[year][source]) chartData[year][source] = [];
        chartData[year][source].push(quantile);
    }

    return chartData;
}

function createTableFromData(data, containerId) {
    // Extract metadata and sort it by column_index to ensure correct column order
    const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);

    // Prepare a container for the table
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous contents

    const table = document.createElement('table');
    table.style.width = '50%';
    table.setAttribute('border', '1');

    // Create the header row based on sorted metadata
    const headerRow = document.createElement('tr');
    metadata.forEach(meta => {
        const headerCell = document.createElement('th');
        headerCell.textContent = meta.column_name;
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    // Assuming each array in your data object has the same length
    const numRows = data.itemsCount;

    // Create table rows
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const row = document.createElement('tr');

        // Populate row cells based on metadata ordering
        metadata.forEach(meta => {
            const cell = document.createElement('td');
            const columnName = meta.column_name;
            const cellValue = data[columnName][rowIndex];
            if (columnName === 'year') {
                cell.textContent = cellValue;
            } else {
                cell.textContent = typeof cellValue === 'number' ? cellValue.toLocaleString() : cellValue; // Format numbers nicely, except for 'year'
            }
            row.appendChild(cell);
        });

        table.appendChild(row);
    }

    // Append the constructed table to its container
    container.appendChild(table);
}


function generateChart(data) {
    const ctx = document.getElementById('chart-container').getContext('2d');

    // Extract unique years and sources
    const years = [...new Set(data.year)];
    const sources = [...new Set(data.source)];

    // Initialize an object to hold the price_quantile_0.25 values for each source-year combination
    const sourceDataMapping = sources.reduce((acc, source) => {
        acc[source] = years.map(() => null); // Initialize with nulls for each year
        return acc;
    }, {});

    // Populate the sourceDataMapping with price_quantile_0.25 values
    data.year.forEach((year, index) => {
        const source = data.source[index];
        const yearIndex = years.indexOf(year);
        sourceDataMapping[source][yearIndex] = data["price_quantile_0.25"][index];
    });

    // Convert the sourceDataMapping to datasets suitable for Chart.js
    const datasets = Object.entries(sourceDataMapping).map(([source, data]) => ({
        label: source,
        data: data,
        backgroundColor: randomColor(), // Use the randomColor function for each source
    }));

    // Verify datasets and labels are populated


    // Generate the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years, // X-axis labels
            datasets: datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}





// Helper function to generate random colors
function randomColor() {
    return 'rgb(' + [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ].join(',') + ')';
}
