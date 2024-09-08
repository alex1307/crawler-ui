

export function price_statistic(requestData) {
    const isLocalhost = window.location.hostname === 'localhost';

    // Set the base URL based on the environment
    const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

    fetch(`${baseUrl}/calculator`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then((response) => response.json()).then((data) => {
            document.getElementById('results').innerHTML = "";
            display(data);
        })
        .catch((error) => {
            console.error("Error:", error);
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = "<p>There was an error processing your request. Please try again later.</p>";
        });
}

function display(responseData) {
    // Simulating the response (replace with actual response from your API)

    // Clear the results container
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    // Create a card to display the data
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
    const data = responseData[0];
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

    // Append the card body to the card
    card.appendChild(cardBody);

    // Append the card to the results container
    resultsContainer.appendChild(card);
}