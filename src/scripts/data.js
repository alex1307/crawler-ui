// Your other JavaScript code
import arrowRed from '../assets/images/arrow-red.png';
import arrowGreen from '../assets/images/arrow-green.png';
import arrowTale from '../assets/images/arrow-tale.png';

function showData(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment
    const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';
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
    const columns = [
        { value: "make", text: "Make" },
        { value: "model", text: "Model" },
        { value: "year", text: "Year" },
        { value: "engine", text: "Engine" },
        { value: "gearbox", text: "Gearbox" },
        { value: "power", text: "Power" },
        { value: "mileage", text: "Mileage" },
        { value: "price_in_eur", text: "Price" },
        { value: "discount", text: "Discount" },
        { value: "save_diff", text: "Saved Difference" },
        { value: "increase", text: "Increase" },
        { value: "extra_charge", text: "Extra Charge" }
    ];
    localStorage.setItem('columns', JSON.stringify(columns));
    localStorage.setItem('requestData', JSON.stringify(json));
    localStorage.setItem('type', 'search');
    window.location.href = `results.html`;
}

function generateRequestData() {
    const data = {
        make: document.getElementById('make').value || null,
        model: document.getElementById('model').value || null,
        search: document.getElementById('search').value || null,
        gearbox: document.getElementById('gearbox').value || null,

        yearFrom: document.getElementById('yearFrom').value ? parseInt(document.getElementById('yearFrom').value, 10) : null,
        yearTo: document.getElementById('yearTo').value ? parseInt(document.getElementById('yearTo').value, 10) : null,
        powerFrom: document.getElementById('powerFrom').value ? parseInt(document.getElementById('powerFrom').value, 10) : null,
        powerTo: document.getElementById('powerTo').value ? parseInt(document.getElementById('powerTo').value, 10) : null,
        mileageFrom: document.getElementById('mileageFrom').value ? parseInt(document.getElementById('mileageFrom').value, 10) : null,
        mileageTo: document.getElementById('mileageTo').value ? parseInt(document.getElementById('mileageTo').value, 10) : null,
        ccFrom: document.getElementById('ccFrom').value ? parseInt(document.getElementById('ccFrom').value, null) : null,
        ccTo: document.getElementById('ccTo').value ? parseInt(document.getElementById('ccTo').value, 10) : null,

        priceFrom: document.getElementById('priceFrom').value ? parseInt(document.getElementById('priceFrom').value, 10) : null,
        priceTo: document.getElementById('priceTo').value ? parseInt(document.getElementById('priceTo').value, 10) : null,

        saveDiffFrom: document.getElementById('saveDiffFrom').value ? parseInt(document.getElementById('saveDiffFrom').value, 10) : null,
        saveDiffTo: document.getElementById('saveDiffTo').value ? parseInt(document.getElementById('saveDiffTo').value, 10) : null,

        discountFrom: document.getElementById('discountFrom').value ? parseInt(document.getElementById('discountFrom').value, 10) : null,
        discountTo: document.getElementById('discountTo').value ? parseInt(document.getElementById('discountTo').value, 10) : null,


        createdOnFrom: document.getElementById('createdOnFrom').value ? parseInt(document.getElementById('createdOnFrom').value, 10) : null,
        createdOnTo: document.getElementById('createdOnTo').value ? parseInt(document.getElementById('createdOnTo').value, 10) : null,

        order: [],
        engine: [],
        aggregators: [],
        group: []

    };

    const engineCheckboxes = document.querySelectorAll('input[name="engine"]:checked');
    if (engineCheckboxes.length > 0) {
        data.engine = Array.from(engineCheckboxes).map(cb => cb.value);
    }
    // document.getElementById('results').textContent = JSON.stringify(requestData, null, 2);
    return data;
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
    const metadata = data.metadata.sort((a, b) => a.column_index - b.column_index);

    // Prepare a container for the cards
    const container = document.getElementById(containerId);

    // Assuming each array in your data object has the same length
    const numRows = data.itemsCount;
    // Create card elements
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        let cardTemplate;
        var color = 'green';
        var mode_emoji = '🚗💰💸💳🚀💵💰💳😎';
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
        var price = data['price'][rowIndex];
        var estimated_price = data['estimated_price'][rowIndex];
        const price_in_eur = data['price_in_eur'][rowIndex];
        const estimated_price_in_eur = data['estimated_price_in_eur'][rowIndex];
        var save_diff = data['save_diff'][rowIndex];
        const save_diff_in_eur = data['save_diff_in_eur'][rowIndex];
        var price_txt = '';
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

window.showData = showData;

//# sourceMappingURL=search.75715696.js.map
