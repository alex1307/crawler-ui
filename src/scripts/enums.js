document.addEventListener('DOMContentLoaded', () => {
    const filters = ['price', 'power', 'mileage', 'cc', 'make', 'engine', 'gearbox', 'year', 'saveDiff', 'discount', 'increase', 'overcharge'];
    filters.forEach(filter => populateFilter(filter));

});

// Determine the environment
const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'http://localhost:3000' : '';

export function fetchModels(make) {
    const url = `${baseUrl}/enums/${make}/models?source=estimated_price`;
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => response.json())
        .then(data => {
            populateModelsDropdown(data);
        })
        .catch(error => console.error('Error fetching models:', error));
}

function populateModelsDropdown(models) {
    const modelSelect = document.getElementById('model');
    if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Select a model</option>';
        for (const [key, value] of Object.entries(models)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            modelSelect.appendChild(option);
        }
    } else {
        console.error('Model select element not found');
    }
}

export function clearModels() {
    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '<option value="">Select a model</option>';
}

function populateFilter(name) {
    fetch(`${baseUrl}/enums/${name}?source=estimated_price`, {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => response.json())
        .then(data => {
            if ('engine' === name) {
                populateCheckboxes(data, name);
            } else if ('gearbox' === name) {
                populateDropdown(data, '', name);
            } else if (name === 'make') {
                populateMakesDropdown();
            } else {
                populateDropdown(data, 'From', name);
                populateDropdown(data, 'To', name);
            }
        })
        .catch(error => console.error('Error:', error));
}

function populateDropdown(data, type, elementId) {
    const select = document.getElementById(`${elementId}${type}`);
    // /let sorted = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])); // Sort by make names
    if (elementId === 'group_by' || elementId === 'make' || elementId === 'engine' || elementId === 'asc') {
        return;
    }

    Object
        .entries(data)
        .forEach(([key, value]) => {
            const option = document.createElement('option');
            option.name = elementId;
            option.value = key;
            option.textContent = value;
            if (select) {
                select.appendChild(option);
            }

        });


}

function populateCheckboxes(data, containerId) {
    const container = document.getElementById(containerId);
    const wrapper = document.createElement('div');
    Object.entries(data).forEach(([key, value]) => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = containerId + key;
        checkbox.name = containerId;
        checkbox.value = key;

        const label = document.createElement('label');
        label.htmlFor = containerId + key;
        label.textContent = value;
        if (wrapper) {
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            container.appendChild(wrapper);
        }

    });
}



function populateMakesDropdown() {
    fetch(`${baseUrl}/enums/make?source=estimated_price`)
        .then(response => response.json())
        .then(data => {
            const sortedMakes = Object.entries(data).sort((a, b) => a[1].localeCompare(b[1])); // Sort by make names
            const select = document.getElementById('make');
            sortedMakes.forEach(([key, value]) => {
                if (value) { // Exclude empty values
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = value;
                    if (select) {
                        select.appendChild(option);
                    }

                }
            });
        })
        .catch(error => console.error('Error fetching makes:', error));
}
