document.addEventListener('DOMContentLoaded', () => {
    const filters = ['price', 'power', 'mileage', 'cc', 'make', 'engine', 'gearbox', 'year', 'saveDiff', 'discount', 'increase', 'overcharge'];
    filters.forEach(filter => populateFilter(filter));

});

// Determine the environment
const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

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
            if (key === '0' && type === 'From') {
                option.value = "";
                option.textContent = "From";
            } else if (key === '0' && type === 'To') {
                option.value = "";
                option.textContent = "To";
            } else {
                option.value = key;
                option.textContent = value;
            }
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
            select.innerHTML = '<option value="">Select a make</option>';
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

// export function updateSecondarySortVisibility() {
//     const primarySort = document.getElementById('sort_by_primary').value;
//     const secondarySortRow = document.getElementById('secondary_sort_row');
//     const secondarySortSelect = document.getElementById('sort_by_secondary');

//     if (primarySort) {
//         secondarySortRow.style.display = ''; // Show the secondary sort options
//         populateSecondaryOptions(primarySort); // Populate secondary options excluding the primary selected
//     } else {
//         secondarySortRow.style.display = 'none'; // Hide if no primary sort is selected
//     }
// }

// function populateSecondaryOptions(excludeOption) {

//     const ps = document.getElementById('sort_by_primary');
//     const selected = ps.options[ps.selectedIndex].value;
//     const secondarySortSelect = document.getElementById('sort_by_secondary');
//     secondarySortSelect.innerHTML = '';
//     Array.from(ps.options).filter(option => option.value !== selected).forEach(option => {
//         const opt = document.createElement('option');
//         opt.value = option.value;
//         opt.textContent = option.textContent;
//         secondarySortSelect.appendChild(opt);
//     });
// }

// function updateSortOptions() {
//     const groupBySelect = document.getElementById('group_by');
//     const sortPrimarySelect = document.getElementById('sort_by_primary');

//     // Get the currently selected value in group_by
//     let selectedGroupBy = groupBySelect.value;
//     const groupByCheckboxes = document.querySelectorAll('input[name="group_by"]:checked');
//     if (groupByCheckboxes.length > 0) {
//         selectedGroupBy = Array.from(groupByCheckboxes).map(cb => cb.value);
//     }

//     // Clear current options in sort dropdown
//     sortPrimarySelect.innerHTML = '';

//     // Add a new option based on the selected group_by


//     selectedGroupBy.forEach(option => {
//         const opt = document.createElement('option');
//         opt.value = option;
//         opt.textContent = option.charAt(0).toUpperCase() + option.slice(1); // Capitalize the first letter
//         sortPrimarySelect.appendChild(opt);
//     });

//     // Optionally add more options or handle multiple group_by selections
//     // This part can be expanded based on specific requirements
// }