import { fetchModels, clearModels, generateRequestData, captureData, validateJSON, populateMakesDropdown, populateDropdown, populateCheckboxes } from './statistic.js';
const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

let map = new Map();
map.set('make', 'make');

map.set('basicSearchYearFrom', 'year');
map.set('basicSearchPriceTo', 'price');
map.set('basicSearchMileageTo', 'mileage');
map.set('basicSearchPowerFrom', 'power');

map.set('engine', 'engine');
map.set('advancedSearchYearFrom', 'year');
map.set('advancedSearchYearTo', 'year');

map.set('advancedSearchMileageFrom', 'mileage');
map.set('advancedSearchMileageTo', 'mileage');

map.set('advancedSearchPowerFrom', 'power');
map.set('advancedSearchPowerTo', 'power');
map.set('advancedSearchCcFrom', 'cc');
map.set('advancedSearchCcTo', 'cc');
map.set('advancedSearchGearbox', 'gearbox');
map.set('advancedSearchPriceFrom', 'price');
map.set('advancedSearchPriceTo', 'price');


map.forEach((enumName, elementId) => {
    populateFilters(enumName, elementId);
});

localStorage.clear();
function redirectToResultsPage(requestData) {
    console.log("Local storage data:", requestData);
    localStorage.setItem('requestData', JSON.stringify(requestData));
    const columns = [];

    const groupByFields = requestData.group;
    groupByFields.forEach(groupByField => {
        columns.push({ value: groupByField, text: groupByField });
    });

    const stat_column = requestData.stat_column;
    const aggregators = requestData.aggregators;
    aggregators.forEach(aggregator => {
        columns.push({ value: `${stat_column}_${aggregator}`, text: `${aggregator}` });
    });


    localStorage.setItem('columns', JSON.stringify(columns));
    localStorage.setItem('type', 'statistic');
    window.location.href = `results.html`;
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('make').addEventListener('change', function () {
        const selectedMake = this.value;
        if (selectedMake) {
            fetchModels(selectedMake);
        } else {
            clearModels();
        }
    });
});
document.getElementById('toggleAdvancedSearch').addEventListener('click', function () {
    const advancedFields = document.getElementById('advancedSearch');
    const basicFields = document.getElementById('basicSearch');
    advancedFields.style.display = advancedFields.style.display === 'none' ? 'block' : 'none';
    basicFields.style.display = basicFields.style.display === 'none' ? 'block' : 'none';
    this.textContent = advancedFields.style.display === 'none' ? 'Advanced' : 'Basic';

});

// Initialize tooltips (if help icons are added later)
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
// Show help text on hover or click



document.getElementById('toggleMoreColumns').addEventListener('click', function () {
    const hiddenCheckboxes = document.querySelectorAll('.hidden-checkbox');
    if (hiddenCheckboxes.length === 0) {
        return;
    }
    const isHidden = hiddenCheckboxes[0].style.display === 'none';
    hiddenCheckboxes.forEach(checkbox => {
        checkbox.style.display = isHidden ? 'inline-block' : 'none';
    });
    this.textContent = isHidden ? 'Less...' : 'More...';
});

document.getElementById('toggleStatColumn').addEventListener('click', function () {
    const hiddenCheckboxes = document.querySelectorAll('.hidden-radio');
    if (hiddenCheckboxes.length === 0) {
        return;
    }
    const isHidden = hiddenCheckboxes[0].style.display === 'none';
    hiddenCheckboxes.forEach(checkbox => {
        checkbox.style.display = isHidden ? 'inline-block' : 'none';
    });
    this.textContent = isHidden ? 'Less...' : 'More...';
});
document.getElementById('toggleFnMore').addEventListener('click', function () {
    const hiddenCheckboxes = document.querySelectorAll('.hidden-function');
    if (hiddenCheckboxes.length === 0) {
        return;
    }
    const isHidden = hiddenCheckboxes[0].style.display === 'none';
    hiddenCheckboxes.forEach(checkbox => {
        checkbox.style.display = isHidden ? 'inline-block' : 'none';
    });
    this.textContent = isHidden ? 'Less...' : 'More...';
});


document.getElementById('floatingSearchButton').addEventListener('click', function () {
    const json = captureData();
    console.log("JSON:", json);
    if (validateJSON(json)) {
        // Parse and display the selected parameters in the summary modal
        const data = JSON.parse(json);
        populateModalSections(data);

        // Show the summary modal
        $('#summaryModal').modal('show');
    } else {
        return false; // Stop the process if JSON validation fails
    }
});

// Function to display the selected parameters in the summary modal
function populateModalSections(data) {
    // Clear existing content in each modal section
    document.getElementById('modalFiltersSection').innerHTML = '';
    document.getElementById('modalGroupedBySection').innerHTML = '';
    document.getElementById('modalStatFunctionsSection').innerHTML = '';
    document.getElementById('modalDataToAnalyzeSection').innerHTML = '';

    // Populate Filters Section
    const filters = [];
    if (data.make) filters.push(`Make: ${data.make}`);
    if (data.model) filters.push(`Model: ${data.model}`);
    if (data.year) filters.push(`Year: ${data.year}`);
    if (data.engine && data.engine.length > 0) filters.push(`Engine: ${data.engine.join(', ')}`);
    document.getElementById('modalFiltersSection').textContent = filters.join(' | ');

    // Populate Grouped By Section
    if (data.group && data.group.length > 0) {
        document.getElementById('modalGroupedBySection').textContent = `Data Field(Column): ${data.group.join(', ')}`;
    }

    // Populate Statistical Functions Section
    if (data.aggregators && data.aggregators.length > 0) {
        document.getElementById('modalStatFunctionsSection').textContent = `Functions: ${data.aggregators.join(', ')}`;
    }

    // Populate Data to Analyze Section
    if (data.stat_column) {
        document.getElementById('modalDataToAnalyzeSection').textContent = `Selected Column: ${data.stat_column}`;
    }
}

// Event listener to trigger modal display with populated data


// Handle the confirmation button click inside the modal
document.querySelector('#summaryModal .btn-primary').addEventListener('click', function () {
    const json = captureData();
    const data = JSON.parse(json);
    redirectToResultsPage(data); // Execute the redirection to the results page
});

function populateFilters(enumName, elementId) {
    fetch(`${baseUrl}/enums/${enumName}?source = estimated_price`, {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => response.json())
        .then(data => {
            if ('engine' === elementId) {
                populateCheckboxes(data, elementId);
            } else if ('gearbox' === elementId) {
                populateDropdown(data, '', elementId);
            } else if (elementId === 'make') {
                populateMakesDropdown();
            } else {
                populateDropdown(data, '', elementId);
            }
        })
        .catch(error => console.error('Error:', error));
}