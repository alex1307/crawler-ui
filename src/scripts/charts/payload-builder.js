import { setupToggle, generateAndRenderChart } from './chart-handler.js';
import i18next from "i18next";

const isLocalhost = window.location.hostname === 'localhost';
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

function parseNumber(value) {
    return value ? parseInt(value, 10) : null;
}

// Handle form submission
document.getElementById('chartForm').addEventListener('submit', event => {
    event.preventDefault();

    // Detect selected chart type
    const selectedChartType = document.querySelector('input[name="chartType"]:checked')?.value;
    if (!selectedChartType) {
        console.error('No chart type selected!');
        alert('Please select a chart type.');
        return;
    }

    console.log('Selected Chart Type:', selectedChartType);

    // Validate required inputs for summary chart
    if (selectedChartType === 'summary') {
        const selectedGroups = Array.from(
            document.querySelectorAll('.group-by-column-checkbox-grid input[type="checkbox"]:checked')
        );
        const selectedAggregators = Array.from(
            document.querySelectorAll('.functions-checkbox-grid input[type="checkbox"]:checked')
        );

        console.log('Selected Groups:', selectedGroups);
        console.log('Selected Aggregators:', selectedAggregators);

        if (selectedGroups.length === 0) {
            alert('Please select at least one group-by field for the summary chart.');
            return;
        }

        if (selectedAggregators.length === 0) {
            alert('Please select at least one statistical function for the summary chart.');
            return;
        }
    }

    // Generate and render the chart
    generateAndRenderChart(selectedChartType);
});

// Run initialization code when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const more = i18next.t('labels.btn.more');
    const less = i18next.t('labels.btn.less');

    setupToggle(
        'toggleMoreColumns',
        'hidden-checkbox',
        more,
        less
    );

    setupToggle(
        'toggleFnMore',
        'hidden-function',
        more,
        less
    );

    const chartTypeRadios = document.querySelectorAll('input[name="chartType"]');

    // Function to toggle visibility based on selected chart type
    const toggleSections = () => {
        const selectedChartType = document.querySelector('input[name="chartType"]:checked').value;
        const distributions = document.getElementById('distributions');
        const stats = document.getElementById('compactAccordion');
        if (selectedChartType === 'distribution') {
            distributions.style.display = 'block'; // Show distributions section
            stats.style.display = 'none'; // Hide statistics section
        } else if (selectedChartType === 'summary') {
            distributions.style.display = 'none'; // Hide distributions section
            stats.style.display = 'block'; // Show statistics section
        }
    };

    // Attach event listeners to chart type radio buttons
    chartTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleSections);
    });

    // Initialize sections visibility
    toggleSections();
});

// Function to get filter values
function getFilterValues() {
    return {
        make: document.getElementById('make').value || null,
        model: document.getElementById('model').value || null,
        engine: Array.from(document.querySelectorAll('#engine input[type="checkbox"]:checked'))
            .map(e => e.value) || null,
        gearbox: document.getElementById('gearbox').value || null,
        yearFrom: parseNumber(document.getElementById('yearFrom').value),
        yearTo: parseNumber(document.getElementById('yearTo').value),
        powerFrom: parseNumber(document.getElementById('powerFrom').value),
        powerTo: parseNumber(document.getElementById('powerTo').value),
        mileageFrom: parseNumber(document.getElementById('mileageFrom').value),
        mileageTo: parseNumber(document.getElementById('mileageTo').value),
        order: []
    };
}

// Function to build payload for distribution chart
function getDistributionPayload(column, filter) {
    const distributionType = document.querySelector('input[name="distributionType"]:checked').value;
    const numberOfBins = parseNumber(document.querySelector('input[name="numberOfBins"]').value) || 5;
    const all = document.getElementById('filterData').checked;

    return {
        column,
        filter,
        all,
        distribution_type: distributionType,
        number_of_bins: numberOfBins
    };
}


