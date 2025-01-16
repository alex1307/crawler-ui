// Module: function.js
import arrowRed from '../../assets/images/arrow-red.png';
import arrowGreen from '../../assets/images/arrow-green.png';
import arrowTale from '../../assets/images/arrow-tale.png';
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
const isLocalhost = window.location.hostname === 'localhost';

function populateDropdown(selectElementId, columns) {
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = ''; // Clear existing options

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Please select';
    selectElement.appendChild(defaultOption);

    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column.value;
        option.text = column.text;
        selectElement.appendChild(option);
    });
}

function initialize() {
    const type = localStorage.getItem('type');
    const requestData = JSON.parse(localStorage.getItem('requestData'));
    const columns = JSON.parse(localStorage.getItem('columns'));

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



    if (requestData) {
        if (type === 'statistic') {
            showStatisticData(requestData);
        } else if (type === 'search') {
            showData(requestData);
        } else if (type === 'price_calculator') {
            price_statistic(requestData);
        } else {
            document.getElementById('results-content').innerHTML = '<p>Invalid search type. Please try again later.</p>';
        }
    } else {
        document.getElementById('results-content').innerHTML = '<p>No search data found. Please return to the search page.</p>';
    }

}

function price_statistic(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';
    const baseUrl = isLocalhost ? 'http://localhost:3000' : 'http://ehomeho.com:3000';

    fetch(`${baseUrl}/calculator`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            const chartOptionsCard = document.getElementById('chartOptionsCard');

            // Ensure chart options card remains at the top
            if (!resultsContainer.contains(chartOptionsCard)) {
                resultsContainer.insertBefore(chartOptionsCard, resultsContainer.firstChild);
            }
            chartOptionsCard.style.display = 'block';

            // Append the price estimation results below the chart options
            showPriceCalculatorResults(data);


        })
        .catch(error => {
            console.error("Error:", error);
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = "<p>There was an error processing your request. Please try again later.</p>";
        });
}

function showPriceCalculatorResults(responseData) {
    // Simulating the response (replace with actual response from your API)

    // Clear the results container
    const resultsContainer = document.getElementById('results');

    // Create a card to showPriceCalculatorResults the data
    const card = document.createElement('div');
    card.className = 'card mb-4';
    card.style.maxWidth = '500px';
    card.style.margin = 'auto';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Title
    const title = document.createElement('h5');
    title.className = 'card-title text-center';
    title.innerText = 'Price Estimation Results';
    cardBody.appendChild(title);

    // Create list group to display key-value pairs
    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group list-group-flush';

    // Helper function to add list items with descriptions
    function addListItem(label, value, description) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `<strong>${label}:</strong> ${value} <br><small>${description}</small>`;
        listGroup.appendChild(listItem);
    }

    // Adding data to the list with descriptions
    addListItem('Estimated Price', `${responseData.estimation} EUR`, 'The estimated price based on the statistical analysis of the data.');
    addListItem('Mean Price', `${responseData.mean} EUR`, 'The average price calculated from the available data.');
    addListItem('Median Price', `${responseData.median} EUR`, 'The middle value in the list of prices, meaning half of the prices are below this value and half are above.');
    addListItem('Quantile 66', `${responseData.quantile_66} EUR`, 'The price below which 66% of the data points fall.');
    addListItem('Quantile 75', `${responseData.quantile_75} EUR`, 'The price below which 75% of the data points fall.');
    addListItem('Quantile 80', `${responseData.quantile_80} EUR`, 'The price below which 80% of the data points fall.');
    addListItem('Quantile 85', `${responseData.quantile_85} EUR`, 'The price below which 85% of the data points fall.');
    addListItem('Max Price', `${responseData.max} EUR`, 'The highest price found in the data.');
    addListItem('Count', responseData.count, 'The number of data points used in the analysis.');
    addListItem('RSD (Relative Standard Deviation)', `${responseData.rsd}%`, 'This value shows the variability of the data. A lower RSD indicates more consistency in the price data.');
    // Append the list group to the card body
    cardBody.appendChild(listGroup);
    const chartOptionsCard = document.getElementById('chartOptionsCard');

    // Ensure chart options card remains at the top
    if (!resultsContainer.contains(chartOptionsCard)) {
        resultsContainer.insertBefore(chartOptionsCard, resultsContainer.firstChild);
    }
    chartOptionsCard.style.display = 'block';
    cardBody.appendChild(chartOptionsCard);

    // Append the card body to the card
    card.appendChild(cardBody);

    // Append the card to the results container
    resultsContainer.appendChild(card);
}

function showData(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment
    const baseUrl = isLocalhost ? 'http://localhost:3000' : 'http://ehomeho.com:3000';
    fetch(`${baseUrl}/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    }).then((response) => response.json()).then((data) => {
        // Assuming 'data' is the structure you've provided, or adjust the following functions as necessary
        // const transformedData = transformDataForChart(data);
        document.getElementById('results').textContent = '';
        createCardsFromData(data, "results");
    }).catch((error) => {
        console.error("Error:", error);
    });
}





function replacePlaceholders(template, data) {
    return template.replace(/\$\w+/g, (placeholder) => {
        const key = placeholder.substring(1); // Remove the '$' character
        return data[key] || '';
    });
}

async function loadTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load template: ${url}`);
    }
    return response.text();

}

async function createCardsFromData(data, containerId) {
    // Load templates
    const highPriceTemplate = await loadTemplate('../assets/templates/high_price.html');
    const fairPriceTemplate = await loadTemplate('../assets/templates/fair_price.html'); // Assuming this template exists
    const goodPriceTemplate = await loadTemplate('../assets/templates/good_price.html'); // Assuming this template exists

    // Extract metadata and sort it by column_index to ensure correct column order
    // const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);

    // Prepare a container for the cards
    const container = document.getElementById(containerId);

    // Assuming each array in your data object has the same length
    const numRows = data.itemsCount;
    // Create card elements
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        let cardTemplate;
        let color;
        let mode_emoji;
        if (data['discount'][rowIndex] > 12) {
            cardTemplate = goodPriceTemplate;
            color = 'green';
            mode_emoji = '👌🙌🔥📢🏷️🛒🔝🛍️😱🤑';
        } else if (data['discount'][rowIndex] > 0 && data['discount'][rowIndex] <= 12) {
            cardTemplate = fairPriceTemplate;
            color = 'tale';
            mode_emoji = '🚗🛍️💶💶💶😎'
        } else {
            cardTemplate = highPriceTemplate;
            color = 'red';
            mode_emoji = '🚗🫰🏻💶💰💸💳🚀💵🤔';
        }

        // Prepare data for placeholders
        const currency = data['currency'][rowIndex];
        let price = data['price'][rowIndex];
        let estimated_price = data['estimated_price'][rowIndex];
        const price_in_eur = data['price_in_eur'][rowIndex];
        const estimated_price_in_eur = data['estimated_price_in_eur'][rowIndex];
        let save_diff = data['save_diff'][rowIndex];
        const save_diff_in_eur = data['save_diff_in_eur'][rowIndex];
        let price_txt = '';
        if (currency === 'BGN') {
            price_txt = `
                ${mode_emoji}
                <br>
                <i style="color:${color};">Price :</i><b>🇧🇬 ${price} BGN</b>
                <br>
                <i style="color:${color};">Estimation :</i><b>🇧🇬 ${estimated_price}</b>
                <br>
                <i style="color:${color};">Price: </i> <b>€ ${price_in_eur} </b>
                <br>
                <i style="color:${color};">Estimation :</i><b>€ ${estimated_price_in_eur}</b>
                <br>`;

            save_diff = `${save_diff_in_eur}/🇧🇬 ${save_diff} BGN`;
        } else if (currency === 'PLN') {
            price_txt = `
                ${mode_emoji}
                <br>
                <i style="color:${color};">Price :</i><b>🇵🇱 ${price} PLN</b>
                <br>
                <i style="color:${color};">Estimation :</i><b>🇵🇱 ${estimated_price}</b>
                <br>
                <i style="color:${color};">Price: </i> <b>€ ${price_in_eur} </b>
                <br>
                <i style="color:${color};">Estimation :</i><b>€ ${estimated_price_in_eur}</b>
                <br>`;
            save_diff = `${save_diff_in_eur}/🇵🇱 ${save_diff} PLN`;
        } else if (currency === 'CHF') {

            price_txt = `
                ${mode_emoji}
                <br>
                <i style="color:${color};">Price :</i><b>🇨🇭 ${price} CHF</b>
                <br>
                <i style="color:${color};">Estimation :</i><b>🇨🇭 ${estimated_price}</b>
                <br>
                <i style="color:${color};">Price: </i> <b>€ ${price_in_eur} </b>
                <br>
                <i style="color:${color};">Estimation :</i><b>€ ${estimated_price_in_eur}</b>
                <br>`;
            save_diff = `${save_diff_in_eur}/🇨🇭 ${save_diff} CHF`;
        } else {
            price_txt = `
                ${mode_emoji}
                <br>
                <i style="color:${color};">Price: </i> <b>€ ${price_in_eur} </b>
                <br>
                <i style="color:${color};">Estimation :</i><b>€ ${estimated_price_in_eur}</b>
                <br>`;
            save_diff = `${save_diff}`;
        }
        const equipmentArray = data['equipment'][rowIndex].split(',');
        const firstFourEquipment = equipmentArray.slice(0, 4).join('<br>');
        const fullEquipment = equipmentArray.join('<br>');
        const cardData = {
            title: data['title'][rowIndex],
            make: data['make'][rowIndex],
            model: data['model'][rowIndex],
            year: data['year'][rowIndex],
            engine: data['engine'][rowIndex],
            gearbox: data['gearbox'][rowIndex],
            //consumption: data['consumption'][rowIndex],
            price_txt: price_txt,
            price: data['price'][rowIndex],
            estimated_price: data['estimated_price'][rowIndex],
            save_diff: save_diff,
            markup: `${data['discount'][rowIndex].toLocaleString() + '%'}`,
            discount: `${data['discount'][rowIndex].toLocaleString() + '%'}`, // Assuming 'markup' is in your data
            mileage: `${data['mileage'][rowIndex].toLocaleString()} km`,
            power: `${data['power'][rowIndex]} hp / ${data['power_kw'][rowIndex]} kw`,
            published: `Published: ${data['created_on'][rowIndex].toLocaleString()}`,
            equipment: data['equipment'][rowIndex].split(',').join('<br>'),
            firstFourEquipment: firstFourEquipment,
            fullEquipment: fullEquipment,
            url: data['url'][rowIndex],
        };

        const cardHTML = replacePlaceholders(cardTemplate, cardData);
        container.innerHTML += cardHTML;
    }

}

function showStatisticData(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment
    const baseUrl = isLocalhost ? 'http://localhost:3000' : 'http://ehomeho.com:3000';
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
    // table.className = "table table-sm table-borderless table-striped table-hover table-responsive-md";
    table.className = "table table-striped table-hover table-responsive-md";
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


document.addEventListener('DOMContentLoaded', initialize);