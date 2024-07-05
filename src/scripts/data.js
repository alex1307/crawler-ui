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

function createCardsFromData(data, containerId) {
    // Extract metadata and sort it by column_index to ensure correct column order
    const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);

    // Prepare a container for the cards
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous contents

    // Assuming each array in your data object has the same length
    const numRows = data.count;

    // Create card elements
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const cardContainer = document.createElement("div");
        cardContainer.className = "col-md-3 col-sm-4";

        const card = document.createElement("div");
        var img;
        if (data['discount'][rowIndex] > 12) {
            card.className = "pricingTable green";
            img = `<img src="${arrowGreen}" alt="High Price" style="width:16px; height:16px; vertical-align:middle;">`;
        } else if (data['discount'][rowIndex] > 0 && data['discount'][rowIndex] <= 12) {
            card.className = "pricingTable blue";
            img = `<img src="${arrowTale}" alt="Fair Price" style="width:16px; height:16px; vertical-align:middle;">`;
        } else {
            card.className = "pricingTable red";
            img = `<img src="${arrowRed}" alt="Good Price" style="width:16px; height:16px; vertical-align:middle;">`;
        }


        const title = document.createElement("h3");
        title.className = "title";
        title.textContent = data['title'][rowIndex];
        card.appendChild(title);

        const priceValue = document.createElement("div");
        priceValue.className = "price-value";
        priceValue.innerHTML = `Save € ${data['save_diff'][rowIndex]} <span class="month">${data['discount'][rowIndex].toLocaleString()}% ${img}</span>`;
        card.appendChild(priceValue);

        const pricingContent = document.createElement("ul");
        pricingContent.className = "pricing-content";
        const items = [document.createElement("li"), document.createElement("li"), document.createElement("li"), document.createElement("li")];
        metadata.forEach((meta, index) => {
            if (meta.visible === false ||
                meta.column_name === 'title' ||
                meta.column_name === 'save_diff' ||
                meta.column_name === 'discount' ||
                meta.column_name === 'currency' ||
                meta.column_name === 'url' ||
                meta.column_name === 'changed_on') return; // Skip invisible columns and already used columns
            const columnName = meta.column_name;
            var cellValue;
            if (columnName === 'year') {
                cellValue = data[columnName][rowIndex];
            } else {
                cellValue = typeof data[columnName][rowIndex] === "number" ? data[columnName][rowIndex].toLocaleString() : data[columnName][rowIndex];
            }
            if (columnName === 'price') {
                items[0].innerHTML = `€ ${cellValue}`;
            } else if (columnName === 'estimated_price') {
                items[1].innerHTML = `<p>Estimated: € ${cellValue}<p>`;
            } else if (columnName === 'equipment') {
                const maxItemsToShow = 4;
                const values = cellValue.split(',').slice(0, maxItemsToShow);
                items[3].innerHTML = `<p>${values.join('<br>')}</p>`;
            } else {
                if (cellValue != 'null' && cellValue != 'undefined' && cellValue != '0') {
                    if (columnName === 'cc') {
                        items[2].innerHTML += `${cellValue} &#13220<br>`;
                    } else if (columnName === 'mileage') {
                        items[2].innerHTML += `${cellValue} km<br>`;
                    } else if (columnName === 'power_ps') {
                        items[2].innerHTML += `${cellValue} hp<br>`;
                    } else if (columnName === 'power_kw') {
                        items[2].innerHTML += `${cellValue} kw<br>`;
                    } else if (columnName === 'created_on') {
                        items[2].innerHTML += `Published: ${cellValue}<br>`;
                    } else if (columnName === 'source') {
                        items[2].innerHTML += `${cellValue}<br>`;
                    } else {
                        items[2].innerHTML += `${cellValue}<br>`;
                    }
                }
            }


        });
        console.log(items);

        items.forEach((item) => { pricingContent.appendChild(item); });
        card.appendChild(pricingContent);



        const viewLink = document.createElement("a");
        viewLink.href = data['url'][rowIndex] === null ? "#" : data['url'][rowIndex];
        viewLink.className = "pricingTable-signup";
        viewLink.textContent = "View";
        viewLink.target = "_blank";
        card.appendChild(viewLink);

        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    }
}

window.showData = showData;

//# sourceMappingURL=search.75715696.js.map
