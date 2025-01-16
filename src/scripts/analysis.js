import i18next from "i18next";
import { fetchModels, clearModels, generateRequestData, captureData, validateJSON, populateMakesDropdown, populateDropdown, populateCheckboxes } from './statistic.js';
const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'http://localhost:3000' : 'http://ehomeho.com:3000';

let map = new Map();
map.set('make', 'make');
map.set('engine', 'engine');

map.set('yearFrom', 'year');
map.set('mileageTo', 'mileage');
map.set('powerFrom', 'power');
map.set('priceTo', 'price');

map.set('priceFrom', 'price');
map.set('ccFrom', 'cc');
map.set('ccTo', 'cc');
map.set('gearbox', 'gearbox');
map.set('yearTo', 'year');
map.set('mileageFrom', 'mileage');


map.set('advancedSearchYearFrom', 'year');
map.set('advancedSearchPowerFrom', 'power');

map.set('advancedSearchMileageTo', 'mileage');
map.set('advancedSearchPriceTo', 'price');


map.forEach((enumName, elementId) => {
    populateFilters(enumName, elementId);
});

localStorage.removeItem('requestData');
localStorage.removeItem('type');
function redirectToResultsPage(requestData) {
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
    window.location.href = `analysis_results.html`;
}


// Ensure this script is loaded after the DOM elements are available
document.addEventListener('DOMContentLoaded', function () {
    const toggleAdvancedButton = document.getElementById('toggleAdvancedSearch');

    // Add a click event listener to toggle advanced search
    toggleAdvancedButton.addEventListener('click', function (event) {
        //event.preventDefault(); // Prevent default button behavior

        const advancedFields = document.getElementById('advancedSearch');
        const basicFields = document.getElementById('basicSearch');
        advancedFields.style.display = advancedFields.style.display === 'none' ? 'block' : 'none';
        basicFields.style.display = basicFields.style.display === 'none' ? 'block' : 'none';

        if (advancedFields.style.display === 'block') {
            // Populate advanced search fields
            document.getElementById('advancedSearchYearFrom').value = document.getElementById('yearFrom').value;
            document.getElementById('advancedSearchMileageTo').value = document.getElementById('mileageTo').value;
            document.getElementById('advancedSearchPowerFrom').value = document.getElementById('powerFrom').value;
            document.getElementById('advancedSearchPriceTo').value = document.getElementById('priceTo').value;
        } else {
            // Clear advanced search fields
            document.getElementById('yearFrom').value = document.getElementById('advancedSearchYearFrom').value;
            document.getElementById('mileageTo').value = document.getElementById('advancedSearchMileageTo').value;
            document.getElementById('powerFrom').value = document.getElementById('advancedSearchPowerFrom').value;
            document.getElementById('priceTo').value = document.getElementById('advancedSearchPriceTo').value;

        }

        this.textContent = advancedFields.style.display === 'none' ? i18next.t('labels.btn.advanced') : i18next.t('labels.btn.basic');

    });
    document.getElementById('make').addEventListener('change', function () {
        const selectedMake = this.value;
        if (selectedMake) {
            fetchModels(selectedMake);
        } else {
            clearModels();
        }
    });


    document.getElementById('searchButton').addEventListener('click', function () {
        const json = captureData();
        const data = JSON.parse(json);
        populateModalSections(data);
        const modalElement = document.getElementById('summaryModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    });
    document.querySelector('#summaryModal .btn-primary').addEventListener('click', function () {
        const json = captureData();
        const data = JSON.parse(json);
        redirectToResultsPage(data); // Execute the redirection to the results page
    });

});

document.addEventListener('DOMContentLoaded', function () {
    const groupHelpModal = new bootstrap.Modal(document.getElementById('groupHelpModal'));
    const columnsHelpModal = new bootstrap.Modal(document.getElementById('columnsHelpModal'));
    const functionsHelpModal = new bootstrap.Modal(document.getElementById('functionsHelpModal'));

    document.querySelectorAll('[data-toggle="modal"]').forEach(item => {
        item.addEventListener('click', function (event) {
            const target = event.target.getAttribute('data-target');
            if (target === '#groupHelpModal') groupHelpModal.show();
            if (target === '#columnsHelpModal') columnsHelpModal.show();
            if (target === '#functionsHelpModal') functionsHelpModal.show();
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
// Show help text on hover or click


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
    if (data.yearFrom) filters.push(`Year From: ${data.yearFrom}`);
    if (data.yearTo) filters.push(`Year To: ${data.yearTo}`);

    if (data.mileage) filters.push(`Mileage: ${data.mileage} km`);
    if (data.mileageFrom) filters.push(`Mileage From: ${data.mileageFrom} km`);
    if (data.mileageTo) filters.push(`Mileage To: ${data.mileageTo} km`);

    if (data.power) filters.push(`Power: ${data.power} hp`);
    if (data.powerFrom) filters.push(`Power From: ${data.powerFrom} hp`);
    if (data.powerTo) filters.push(`Power To: ${data.powerTo} hp`);

    if (data.priceTo) filters.push(`Price To: ${data.priceTo} €`);
    if (data.price) filters.push(`Price: ${data.price} €`);
    if (data.priceFrom) filters.push(`Price From: ${data.priceFrom} €`);

    if (data.cc) filters.push(`CC: ${data.cc}`);
    if (data.ccFrom) filters.push(`CC From: ${data.ccFrom} cm³`);
    if (data.ccTo) filters.push(`CC To: ${data.ccTo} cm³`);

    if (data.gearbox) filters.push(`Gearbox: ${data.gearbox}`);


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