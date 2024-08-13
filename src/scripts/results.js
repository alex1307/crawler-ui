// Module: results.js

import { showStatisticData } from './rainbow.js';
import { search } from './data.js';

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
    populateDropdown('orderColumn1', columns);
    populateDropdown('orderColumn2', columns);

    if (type === 'statistic') {
        if (requestData) {
            showStatisticData(requestData);
        } else {
            document.getElementById('results-content').innerHTML = '<p>No search data found. Please return to the search page.</p>';
        }
    } else if (type === 'search') {
        if (requestData) {
            search(requestData);
        } else {
            document.getElementById('results-content').innerHTML = '<p>No search data found. Please return to the search page.</p>';
        }
    } else {
        document.getElementById('results-content').innerHTML = '<p>Unsupported type. Please try again.</p>';
    }

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
            search(requestData);
        }
    });
}

document.addEventListener('DOMContentLoaded', initialize);