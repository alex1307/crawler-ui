const isLocalhost = window.location.hostname === 'localhost';

const table_header_css = 'thead-dark';
const light_mode_colors = ['table-primary',
    'table-secondary',
    'table-success',
    'table-danger',
    'table-warning',
    'table-info',
    'table-light',
    'table-dark'
];
const dark_mode_colors = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info',
    'bg-dark'
];

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

export function showStatisticData(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment
    const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';
    fetch(`${baseUrl}/statistic`, {
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
    table.className = "table table-sm table-borderless table-striped table-hover table-responsive-md";
    table.style.margin = "auto";
    const table_header = table.createTHead();


    // Create the header row based on sorted metadata
    const headerRow = document.createElement("tr");
    headerRow.className = table_header_css;
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



