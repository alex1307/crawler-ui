import { populateDropdown } from '../common/common-functions.js';
const apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/statistic'
    : 'http://ehomeho.com:3000/statistic';

const pivotUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/pivot-data'
    : 'http://ehomeho.com:3000/pivot-data';

const dark_mode_colors = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info',
    'bg-dark'
];
document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

document.addEventListener('DOMContentLoaded', function () {
    registerEventListeners();
});


function registerEventListeners() {

    const drawChartButton = document.getElementById("chartButton");
    drawChartButton.addEventListener("click", function () {
        // Retrieve the StatisticSearchPayload from localStorage
        const requestData = JSON.parse(localStorage.getItem("requestData"));
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
    const sortButton = document.getElementById("dataButton");
    sortButton.addEventListener("click", async function () {
        // Retrieve the StatisticSearchPayload from localStorage
        const requestData = JSON.parse(localStorage.getItem('requestData'));

        // Update sorting options from the UI
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

        // Collect other values for PivotData
        const xColumn = document.getElementById("xColumn").value;
        const pivotColumn = document.getElementById("pivotColumn").value || null; // Optional
        const yFunction = document.getElementById("yFunction").value;

        // Construct the PivotData object
        const pivotData = {
            x_column: xColumn,
            y_column: requestData.stat_column || "default_column", // Replace with a fallback if needed
            y_function: yFunction,
            pivot_column: pivotColumn,
            filter: requestData // Include the StatisticSearchPayload as part of the filter
        };

        console.log("PivotData Payload:", pivotData);

        try {
            // Send a POST request to the /pivot-data endpoint
            const response = await fetch(`${pivotUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pivotData)
            });

            // Parse and display the response
            const data = await response.json();
            document.getElementById('results').innerHTML = ""; // Clear previous results
            createTableFromData(data, "results", dark_mode_colors); // Display the new results
        } catch (error) {
            console.error("Error:", error);
        }
    });
}


function loadPage() {
    const columns = JSON.parse(localStorage.getItem('columns'));
    if (columns && columns.length > 0) {
        populateDropdown('orderColumn1', columns);
        populateDropdown('orderColumn2', columns);

    }
    const requestData = JSON.parse(localStorage.getItem('requestData'));
    requestAndDisplayData(requestData);
    populateDropdowns(requestData);
    populateStatFunctions();
}
function requestAndDisplayData(requestData) {

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

    // Populate the Pivot column dropdown
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