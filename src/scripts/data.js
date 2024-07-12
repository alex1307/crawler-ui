// Your other JavaScript code
import arrowRed from '../assets/images/arrow-red.png';
import arrowGreen from '../assets/images/arrow-green.png';
import arrowTale from '../assets/images/arrow-tale.png';

function showData(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment
    const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';
    fetch(`${baseUrl}/json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    }).then((response) => response.json()).then((data) => {
        console.log("Success:", data);
        // Assuming 'data' is the structure you've provided, or adjust the following functions as necessary
        // const transformedData = transformDataForChart(data);
        createCardsFromData(data, "results");
        //generateChart(data, "chart-container");
    }).catch((error) => {
        console.error("Error:", error);
    });
}

export function search(json) {
    showData(json);
}

export function redirect() {
    const json = generateRequestData();
    localStorage.setItem('requestData', JSON.stringify(json));
    localStorage.setItem('type', 'search');
    window.location.href = `results.html`;
}

function generateRequestData() {
    const requestData = {
        source: "estimated_price",
        group_by: [],
        aggregate: {},
        sort: [],//        sort: [{ "asc": ["year", true] }, { "asc": ["source", true] }],
        filter_string: [],
        filter_i32: [],
        filter_date: [],
        // Assuming gearbox and year might require special handling
        filter_f64: []
    };

    // Handling min/max inputs for price, mileage, and cc.
    let gte = {};
    let lte = {};
    ['price', 'mileage', 'cc', 'power', 'year', 'save_diff', 'discount'].forEach(field => {
        const minElement = document.getElementById(`${field}Min`);
        const maxElement = document.getElementById(`${field}Max`);

        if (minElement && minElement.value) {
            const value = parseInt(minElement.value, 10);
            if (value > 0) {
                gte[`${field}`] = value;
            }
        }
        if (maxElement && maxElement.value) {
            const value = parseInt(maxElement.value, 10);
            if (value > 0) {
                lte[`${field}`] = value;

            }

        }

    });

    if (gte && Object.keys(gte).length > 0) {
        requestData.filter_i32.push({ "Gte": [gte, true] });
    }

    if (lte && Object.keys(lte).length > 0) {
        requestData.filter_i32.push({ "Lte": [lte, true] });
    }

    // Handling 'make' separately as a string filter
    const makeSelect = document.getElementById('make');
    if (makeSelect && makeSelect.value) {
        requestData.filter_string.push({ Eq: [{ "make": makeSelect.value }, true] });
    }

    const model = document.getElementById('model');
    if (model && model.value) {
        requestData.filter_string.push({ Eq: [{ "model": model.value }, true] });
    }

    const search = document.getElementById('search');
    if (search && search.value) {
        requestData.search = search.value;
    }
    const created_on = document.getElementById('created_onMin');
    if (created_on && created_on.value && created_on.value !== '0') {
        console.log("Created on: ", created_on.value);
        requestData.filter_date.push({ Gte: [{ "created_on": created_on.value }, true] });
    }

    const groupByCheckboxes = document.querySelectorAll('input[name="group_by"]:checked');
    if (groupByCheckboxes.length > 0) {
        const values = Array.from(groupByCheckboxes).map(cb => cb.value);
        requestData.group_by = values;
        requestData.aggregate = { "price": ["max", "count", { "quantile": 0.25 }] };
    }



    // Example handling for checkboxes (e.g., gearbox, year)
    // Assuming gearbox options are checkboxes with a common name
    const gearboxCheckboxes = document.querySelectorAll('input[name="gearbox"]:checked');
    if (gearboxCheckboxes.length > 0) {
        const values = Array.from(gearboxCheckboxes).map(cb => cb.value);
        requestData.filter_string.push({ In: ['gearbox', values] });

    }

    // Assuming year is handled with checkboxes or a range and collecting all checked years
    const yearCheckboxes = document.querySelectorAll('input[name="year"]:checked');
    if (yearCheckboxes.length > 0) {
        console.log(yearCheckboxes);
        const values = Array.from(yearCheckboxes).map(cb => parseInt(cb.value, 10));
        requestData.filter_i32.push({ In: ['year', values] });
    }

    // Assuming engine type is handled with checkboxes
    const engineCheckboxes = document.querySelectorAll('input[name="engine"]:checked');
    if (engineCheckboxes.length > 0) {
        const values = Array.from(engineCheckboxes).map(cb => cb.value);
        requestData.filter_string.push({ In: ['engine', values] });
    }
    ['sort_by_primary', 'sort_by_secondary'].forEach(sortElement => {
        const sortSelect = document.getElementById(sortElement);
        if (sortSelect && sortSelect.value) {
            const ascSelect = (sortElement === 'sort_by_primary') ?
                document.getElementById('asc_primary') : document.getElementById('asc_secondary');
            const asc = ascSelect.value === 'asc';
            requestData.sort.push({ [asc ? 'asc' : 'desc']: [sortSelect.value, true] });
        }
    });

    // document.getElementById('results').textContent = JSON.stringify(requestData, null, 2);
    return requestData;
    // showData(requestData);
    // Place your fetch API call here as shown previously
}
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

// Helper function to convert HSV to RGB


function generateChart(data, containerId) {
    const ctx = document.getElementById(containerId).getContext("2d");
    // Extract unique years and sources
    const years = [
        ...new Set(data.year)
    ];
    const sources = [
        ...new Set(data.source)
    ];
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
        backgroundColor: randomColor()
    }));
    // Verify datasets and labels are populated
    console.log("Labels (Years):", years);
    console.log("Datasets:", datasets);
    // Generate the chart
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// function createCardsFromData(data, containerId) {
//     // Extract metadata and sort it by column_index to ensure correct column order
//     const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);

//     // Prepare a container for the cards
//     const container = document.getElementById(containerId);
//     container.innerHTML = ""; // Clear previous contents

//     // Assuming each array in your data object has the same length
//     const numRows = data.count;

//     // Create card elements
//     for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
//         const cardContainer = document.createElement("div");
//         cardContainer.className = "col-md-3 col-sm-4";

//         const card = document.createElement("div");
//         var img;
//         if (data['discount'][rowIndex] > 12) {
//             card.className = "pricingTable green";
//             img = `<img src="${arrowGreen}" alt="High Price" style="width:16px; height:16px; vertical-align:middle;">`;
//         } else if (data['discount'][rowIndex] > 0 && data['discount'][rowIndex] <= 12) {
//             card.className = "pricingTable blue";
//             img = `<img src="${arrowTale}" alt="Fair Price" style="width:16px; height:16px; vertical-align:middle;">`;
//         } else {
//             card.className = "pricingTable red";
//             img = `<img src="${arrowRed}" alt="Good Price" style="width:16px; height:16px; vertical-align:middle;">`;
//         }


//         const title = document.createElement("h3");
//         title.className = "title";
//         title.textContent = data['title'][rowIndex];
//         card.appendChild(title);

//         const priceValue = document.createElement("div");
//         priceValue.className = "price-value";
//         priceValue.innerHTML = `Save € ${data['save_diff'][rowIndex]} <span class="month">${data['discount'][rowIndex].toLocaleString()}% ${img}</span>`;
//         card.appendChild(priceValue);

//         const pricingContent = document.createElement("ul");
//         pricingContent.className = "pricing-content";
//         const items = [document.createElement("li"), document.createElement("li"), document.createElement("li"), document.createElement("li")];
//         metadata.forEach((meta, index) => {
//             if (meta.visible === false ||
//                 meta.column_name === 'title' ||
//                 meta.column_name === 'save_diff' ||
//                 meta.column_name === 'discount' ||
//                 meta.column_name === 'currency' ||
//                 meta.column_name === 'url' ||
//                 meta.column_name === 'changed_on') return; // Skip invisible columns and already used columns
//             const columnName = meta.column_name;
//             var cellValue;
//             if (columnName === 'year') {
//                 cellValue = data[columnName][rowIndex];
//             } else {
//                 cellValue = typeof data[columnName][rowIndex] === "number" ? data[columnName][rowIndex].toLocaleString() : data[columnName][rowIndex];
//             }
//             if (columnName === 'price') {
//                 items[0].innerHTML = `€ ${cellValue}`;
//             } else if (columnName === 'estimated_price') {
//                 items[1].innerHTML = `<p>Estimated: € ${cellValue}<p>`;
//             } else if (columnName === 'equipment') {
//                 const maxItemsToShow = 4;
//                 const values = cellValue.split(',').slice(0, maxItemsToShow);
//                 items[3].innerHTML = `<p>${values.join('<br>')}</p>`;
//             } else {
//                 if (cellValue != 'null' && cellValue != 'undefined' && cellValue != '0') {
//                     if (columnName === 'cc') {
//                         items[2].innerHTML += `${cellValue} &#13220<br>`;
//                     } else if (columnName === 'mileage') {
//                         items[2].innerHTML += `${cellValue} km<br>`;
//                     } else if (columnName === 'power_ps') {
//                         items[2].innerHTML += `${cellValue} hp<br>`;
//                     } else if (columnName === 'power_kw') {
//                         items[2].innerHTML += `${cellValue} kw<br>`;
//                     } else if (columnName === 'created_on') {
//                         items[2].innerHTML += `Published: ${cellValue}<br>`;
//                     } else if (columnName === 'source') {
//                         items[2].innerHTML += `${cellValue}<br>`;
//                     } else {
//                         items[2].innerHTML += `${cellValue}<br>`;
//                     }
//                 }
//             }


//         });
//         console.log(items);

//         items.forEach((item) => { pricingContent.appendChild(item); });
//         card.appendChild(pricingContent);



//         const viewLink = document.createElement("a");
//         viewLink.href = data['url'][rowIndex] === null ? "#" : data['url'][rowIndex];
//         viewLink.className = "pricingTable-signup";
//         viewLink.textContent = "View";
//         viewLink.target = "_blank";
//         card.appendChild(viewLink);

//         cardContainer.appendChild(card);
//         container.appendChild(cardContainer);
//     }
// }

function replacePlaceholders(template, data) {
    return template.replace(/\$\w+/g, (placeholder) => {
        const key = placeholder.substring(1); // Remove the '$' character
        return data[key] || '';
    });
}

async function loadTemplate(url) {
    console.log("Loading template");
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
    const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);

    // Prepare a container for the cards
    const container = document.getElementById(containerId);

    // Assuming each array in your data object has the same length
    const numRows = data.count;
    console.log("Rows:", numRows);
    // Create card elements
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        let cardTemplate;
        if (data['discount'][rowIndex] > 12) {
            cardTemplate = goodPriceTemplate;
        } else if (data['discount'][rowIndex] > 0 && data['discount'][rowIndex] <= 12) {
            cardTemplate = fairPriceTemplate;
        } else {
            cardTemplate = highPriceTemplate;
        }

        // Prepare data for placeholders
        const cardData = {
            title: data['title'][rowIndex],
            make: data['make'][rowIndex],
            model: data['model'][rowIndex],
            year: data['year'][rowIndex],
            engine: data['engine'][rowIndex],
            gearbox: data['gearbox'][rowIndex],
            //consumption: data['consumption'][rowIndex],
            price: `${data['price'][rowIndex].toLocaleString()}`,
            estimated_price: `${data['estimated_price'][rowIndex].toLocaleString()}`,
            save_diff: `${data['save_diff'][rowIndex].toLocaleString()}`,
            markup: `${data['discount'][rowIndex].toLocaleString() + '%'}`,
            discount: `${data['discount'][rowIndex].toLocaleString() + '%'}`, // Assuming 'markup' is in your data
            mileage: `${data['mileage'][rowIndex].toLocaleString()} km`,
            power: `${data['power'][rowIndex]} hp / ${data['power_kw'][rowIndex]} kw`,
            published: `Published: ${data['created_on'][rowIndex].toLocaleString()}`,
            equipment: data['equipment'][rowIndex].split(',').join('<br>'),
        };

        const cardHTML = replacePlaceholders(cardTemplate, cardData);
        container.innerHTML += cardHTML;
    }

}

window.showData = showData;

//# sourceMappingURL=search.75715696.js.map
