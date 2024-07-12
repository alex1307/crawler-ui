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
    'bg-light',
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
        // headerCell.style.backgroundColor = colors[index];
        // headerCell.style.border = "none";
        // headerCell.style.borderColor = colors[index]; // Set column color
        headerRow.appendChild(headerCell);
    });
    table_header.appendChild(headerRow);
    const table_body = table.createTBody();
    // Assuming each array in your data object has the same length
    const numRows = data.count;
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

function generateRainbowColors(numColors) {
    let colors = [];
    for (let i = 0; i < numColors; i++) {
        let hue = i / numColors;
        let rgb = hsvToRgb(hue, 1, 1);
        colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
    }
    return colors;
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return [
        Math.floor(r * 255),
        Math.floor(g * 255),
        Math.floor(b * 255)
    ];
}


function getContrastingColor(rgb) {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    const brightness = Math.round((parseInt(rgbArray[0]) * 299 + parseInt(rgbArray[1]) * 587 + parseInt(rgbArray[2]) * 114) / 1000);
    return brightness > 125 ? "black" : "white";
}
// Helper function to generate random colors
function randomColor() {
    return "rgb(" + [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ].join(",") + ")";
}