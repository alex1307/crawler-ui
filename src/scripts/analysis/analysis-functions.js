import { populateDropdown } from '../common/common-functions.js';
const apiUrl = window.location.hostname === 'localhost'
    ? 'https://localhost:3000/statistic'
    : 'https://ehomeho.com:3000/statistic';

const dark_mode_colors = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info',
    'bg-dark'
];
document.addEventListener('DOMContentLoaded', loadPage);

function loadPage() {


    const requestData = JSON.parse(localStorage.getItem('requestData'));
    const columns = JSON.parse(localStorage.getItem('columns'));
    const drawChartButton = document.getElementById("chartButton");
    drawChartButton.addEventListener("click", function () {
        window.location.href = "analysis_chart.html";
    });

    if (columns && columns.length > 0) {
        populateDropdown('orderColumn1', columns);
        populateDropdown('orderColumn2', columns);

        document.getElementById('sortButton').addEventListener('click', function () {
            const requestData = JSON.parse(localStorage.getItem('requestData'));
            requestData.order = [];

            if (document.getElementById('orderColumn1').value) {
                requestData.order.push({
                    column: document.getElementById('orderColumn1').value,
                    asc: document.querySelector('input[name="order1"]:checked').value === 'asc'
                });
            }
            if (document.getElementById('orderColumn2').value) {
                requestData.order.push({
                    column: document.getElementById('orderColumn2').value,
                    asc: document.querySelector('input[name="order2"]:checked').value === 'asc'
                });
            }

            // Trigger the correct function based on the type
            if (type === 'statistic') {
                showStatisticData(requestData);
            } else if (type === 'search') {
                showData(requestData);
            }
        });
    } else if (document.getElementById('sorting-section')) {
        document.getElementById('sorting-section').style.display = 'none';
    }

    requestAndDisplayData(requestData);

}

function requestAndDisplayData(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    }).then((response) => response.json()).then((data) => {
        document.getElementById('results').innerHTML = "";
        createTableFromData(data, "results", dark_mode_colors);
    }).catch((error) => {
        console.error("Error:", error);
    });
}

function createTableFromData(data, containerId, colors = dark_mode_colors) {

    // Extract metadata and sort it by column_index to ensure correct column order
    const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);
    // Generate rainbow colors for the number of columns
    // Prepare a container for the table
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous contents
    const table = document.createElement("table");
    // table.className = "table table-sm table-borderless table-striped table-hover table-responsive-md";
    table.className = "table table-striped table-hover table-responsive-md";
    const table_header = table.createTHead();


    // Create the header row based on sorted metadata
    const headerRow = document.createElement("tr");
    metadata.forEach((meta, index) => {
        if (meta.visible === false) return; // Skip invisible columns
        const headerCell = document.createElement("th");
        headerCell.textContent = meta.column_name;
        headerRow.appendChild(headerCell);
    });
    table_header.appendChild(headerRow);
    const table_body = table.createTBody();
    // Assuming each array in your data object has the same length
    const numRows = data.itemsCount;
    const length = colors.length;
    // Create table rows
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const row = document.createElement("tr");
        row.className = colors[rowIndex % length];

        // Populate row cells based on metadata ordering
        metadata.forEach((meta, index) => {
            if (meta.visible === false) return; // Skip invisible columns
            const cell = document.createElement("td");
            const columnName = meta.column_name;
            const cellValue = data[columnName][rowIndex];
            if (columnName === "year") cell.textContent = cellValue;
            else cell.textContent = typeof cellValue === "number" ? cellValue.toLocaleString() : cellValue; // Format numbers nicely, except for 'year'
            row.appendChild(cell);
        });
        table_body.appendChild(row);
    }
    // Append the constructed table to its container
    container.appendChild(table);
}