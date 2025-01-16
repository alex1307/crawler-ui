const apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/calculator'
    : '/api/calculator';

document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderData(); // Fetch and render your data first

    // Initialize a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                // Check if the button is now in the DOM
                const drawChartButton = document.getElementById("chartButton");

                if (drawChartButton) {
                    drawChartButton.addEventListener("click", () => {
                        const numberOfBins = document.getElementById("numberOfBins").value;
                        const clearData = document.getElementById("clearDataCheckbox").checked;

                        console.log("Number of Bins:", numberOfBins);
                        console.log("Clear Data:", clearData);
                        localStorage.setItem("numberOfBins", numberOfBins);
                        localStorage.setItem("clearData", clearData);
                        window.location.href = "calculator_chart.html";

                        // Call your chart-rendering function here

                    });

                    // Stop observing once the button is found
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    // Start observing changes to the document body
    observer.observe(document.body, { childList: true, subtree: true });
});


function fetchAndRenderData() {
    const requestData = JSON.parse(localStorage.getItem('requestData') || '{}');

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
    })
        .then(response => response.json())
        .then(data => {
            showPriceCalculatorResults(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p class="text-danger text-center">Error loading results.</p>';
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
    cardBody.appendChild(renderChartPanel());
    // Ensure chart options card remains at the top

    // Append the card body to the card
    card.appendChild(cardBody);
    // Append the card to the results container
    resultsContainer.appendChild(card);
}

function renderChartPanel() {
    const chartPanel = document.createElement('div');
    chartPanel.id = 'chartPanel';
    chartPanel.innerHTML = `
    <div id="chartOptionsCard" style="width: 100%; background-color: lightgray;">
        <div class="card-header">
            <h5>Chart Options</h5>
        </div>
        <div class="card-body">
            <div class="mb-3">
                <label for="numberOfBins" class="form-label">Number of Intervals (Bins):</label>
                <input type="number" id="numberOfBins" class="form-control" value="5" min="1" />
            </div>
            <div class="custom-checkbox-grid" style="text-align: left;">
                <input class="form-check-input" type="checkbox" id="clearDataCheckbox">
                <label class="form-check-label" for="clearDataCheckbox">Clear Data</label>
            </div>
            <button id="chartButton" class="btn btn-primary mt-3 w-100">Draw Price Distribution
                Chart</button>
        </div>
    </div>
    `;
    return chartPanel;
}