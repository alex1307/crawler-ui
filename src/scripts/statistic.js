
const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

export function captureData() {

    const data = {
        make: document.getElementById('make').value || null,
        model: document.getElementById('model').value || null,
        engine: [],
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

        group: [],
        aggregators: [],
        order: [],
        // Vanilla JavaScript equivalent
        stat_column: document.querySelector('input[name="statColumn"]:checked')?.value || "price_in_eur",
        estimated_price: document.getElementById('estimated_price') && document.getElementById('estimated_price').value
            ? parseInt(document.getElementById('estimated_price').value, 10) : null,
    };

    const engineCheckboxes = document.querySelectorAll('input[name="engine"]:checked');
    if (engineCheckboxes.length > 0) {
        data.engine = Array.from(engineCheckboxes).map(cb => cb.value);
    }

    if (data.ccFrom == 0) {
        data.ccFrom = null;
    }
    if (data.ccTo == 0) {
        data.ccTo = null;
    }
    if (data.mileageFrom == 0) {
        data.mileageFrom = null;
    }

    if (data.mileageTo == 0) {
        data.mileageTo = null;
    }
    if (data.yearFrom == 0) {
        data.yearFrom = null;
    }
    if (data.yearTo == 0) {
        data.yearTo = null;
    }
    if (data.powerFrom == 0) {
        data.powerFrom = null;
    }
    if (data.powerTo == 0) {
        data.powerTo = null;
    }


    if (document.getElementById('groupByMake').checked) data.group.push('make');
    if (document.getElementById('groupByModel').checked) data.group.push('model');
    if (document.getElementById('groupByYear').checked) data.group.push('year');
    if (document.getElementById('groupByEngine').checked) data.group.push('engine');
    if (document.getElementById('groupByGearbox').checked) data.group.push('gearbox');
    if (document.getElementById('groupByPower').checked) data.group.push('power_breakdown');
    if (document.getElementById('groupByMileage').checked) data.group.push('mileage_breakdown');

    // Statistics checkboxes
    if (document.getElementById('statCount').checked) data.aggregators.push('count');
    if (document.getElementById('statSum').checked) data.aggregators.push('sum');
    if (document.getElementById('statMedian').checked) data.aggregators.push('median');
    if (document.getElementById('statAvg').checked) data.aggregators.push('mean');
    if (document.getElementById('statMin').checked) data.aggregators.push('min');
    if (document.getElementById('statMax').checked) data.aggregators.push('max');
    if (document.getElementById('quantile_60').checked) data.aggregators.push('quantile_60');
    if (document.getElementById('quantile_66').checked) data.aggregators.push('quantile_66');
    if (document.getElementById('quantile_70').checked) data.aggregators.push('quantile_70');
    if (document.getElementById('quantile_75').checked) data.aggregators.push('quantile_75');
    if (document.getElementById('quantile_80').checked) data.aggregators.push('quantile_80');
    if (document.getElementById('quantile_90').checked) data.aggregators.push('quantile_90');
    if (document.getElementById('std').checked) data.aggregators.push('std');
    if (document.getElementById('rsd').checked) data.aggregators.push('rsd');





    // Orders
    if (document.getElementById('orderColumn1') && document.getElementById('orderColumn1').value) {
        data.order.push({
            column: document.getElementById('orderColumn1').value,
            // Vanilla JavaScript equivalent
            asc: document.querySelector('input[name="order1"]:checked')?.value === 'asc',
        });
    }
    if (document.getElementById('orderColumn2') && document.getElementById('orderColumn2').value) {
        data.order.push({
            column: document.getElementById('orderColumn2').value,
            // Vanilla JavaScript equivalent
            asc: document.querySelector('input[name="order2"]:checked')?.value === 'asc',
        });
    }

    return JSON.stringify(data);
}
function showError(message) {
    document.getElementById('errors').html(`<p>${message}</p>`);
}


// Validate JSON
export function validateJSON(json) {
    try {
        const data = JSON.parse(json);
        const selected = [data.make, data.model, data.year, data.engine, data.gearbox, data.power].filter(field => field !== null);
        if (selected.length < 2) {
            showError('fill in all vehicle filter fields');
            return false;
        }
        // Check for empty fiel ds

        // Check for empty groupBy and statistics
        if (data.group.length === 0) {
            showError('Please select at least one group by field.');
            return false;
        }
        if (data.aggregators.length === 0) {
            showError('Please select at least one statistic.');
            return false;
        }
        // Clear any previous errors
        document.getElementById('errors').text('');
        document.getElementById('vehiclePriceCalculator').show();
        return true;
    } catch (e) {
        document.getElementById('errors').html('Invalid data format.');
        return false;
    }
}





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

export function populateModelsDropdown(models) {
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

export function populateFilter(name) {
    fetch(`${baseUrl}/enums/${name}?source=estimated_price`, {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (name === 'gearbox') {
                //populateCheckboxes(data, name);
                populateDropdown(data, '', name);
            }

            if (name === 'mileage_status') {
                populateDropdown(data, '', name);
            }

            if (name === 'make') {
                populateMakesDropdown();
            }

            if (name === 'sort_by' || name === 'asc') {
                populateDropdown(data, '_primary', name);
                populateDropdown(data, '_secondary', name);
            }

            if (['year', 'power', 'cc', 'mileage'].includes(name)) {
                populateDropdown(data, 'From', name);
                populateDropdown(data, 'To', name);
            }
            if (name === 'engine') {
                populateCheckboxes(data, name);
            }
        })
        .catch(error => console.error('Error:', error));
}

export function populateDropdown(data, type, elementId) {
    if (document.getElementById(`${elementId}${type}`)) {
        const select = document.getElementById(`${elementId}${type}`);
        // /let sorted = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])); // Sort by make names
        if (elementId === 'group_by' || elementId === 'make' || elementId === 'asc') {
            return;
        }
        if (elementId === 'sort_by') {
            Object
                .entries(data)
                .sort((a, b) => a[0].localeCompare(b[0])).forEach(([key, value]) => {
                    const option = document.createElement('option');
                    option.name = elementId;
                    option.value = key;
                    option.textContent = value;
                    select.appendChild(option);
                }); // Sort by make names

        } else {
            Object
                .entries(data)
                .forEach(([key, value]) => {
                    const option = document.createElement('option');
                    option.name = elementId;
                    if (key === '0' && elementId.includes('From')) {
                        option.value = key;
                        option.textContent = 'From';
                    } else if (key === '0' && elementId.includes('To')) {
                        option.value = key;
                        option.textContent = 'To';
                    } else {
                        option.value = key;
                        option.textContent = value;
                    }
                    select.appendChild(option);
                });
        }
    }
}

export function populateCheckboxes(data, containerId) {
    const container = document.getElementById(containerId);
    const wrapper = document.createElement('div');
    const sortedEntries = Object.entries(data).sort(([keyA], [keyB]) => {
        return keyA.localeCompare(keyB); // Sorts the keys alphabetically
    });

    // 
    sortedEntries.forEach(([key, value]) => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = containerId + key;
        checkbox.name = containerId;
        checkbox.value = key;

        const label = document.createElement('label');
        label.htmlFor = containerId + key;
        label.textContent = value;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}

export function generateRequestData() {
    const requestData = {
        source: "estimated_price",
        group_by: [],
        aggregate: {},
        sort: [],//        sort: [{ "asc": ["year", true] }, { "asc": ["source", true] }],
        filter_string: [],
        filter_i32: [],
        filter_date: [],
        // Assuming gearbox and year might require special handling
        filter_f64: []
    };

    // Handling min/max inputs for price, mileage, and cc.
    let gte = {};
    let lte = {};
    ['price', 'mileage', 'cc', 'power', 'year', 'saveDiff', 'discount', 'mileage_status'].forEach(field => {
        const minElement = document.getElementById(`${field}From`);
        const maxElement = document.getElementById(`${field}To`);

        if (minElement && minElement.value) {
            const value = parseInt(minElement.value, 10);
            if (value > 0) {
                gte[`${field}`] = value;
            }
        }
        if (maxElement && maxElement.value) {
            const value = parseInt(maxElement.value, 10);
            if (value > 0) {
                lte[`${field}`] = value;

            }

        }

    });

    if (gte && Object.keys(gte).length > 0) {
        requestData.filter_i32.push({ "Gte": [gte, true] });
    }

    if (lte && Object.keys(lte).length > 0) {
        requestData.filter_i32.push({ "Lte": [lte, true] });
    }

    // Handling 'make' separately as a string filter
    const makeSelect = document.getElementById('make');
    if (makeSelect && makeSelect.value) {
        requestData.filter_string.push({ Eq: [{ "make": makeSelect.value }, true] });
    }

    const model = document.getElementById('model');
    if (model && model.value) {
        requestData.filter_string.push({ Eq: [{ "model": model.value }, true] });
    }

    const search = document.getElementById('search');
    if (search && search.value) {
        requestData.search = search.value;
    }
    const created_on = document.getElementById('createdOnMin');
    if (created_on && created_on.value && created_on.value !== '0') {
        requestData.filter_date.push({ Gte: [{ "createdOn": created_on.value }, true] });
    }

    const groupByCheckboxes = document.querySelectorAll('input[name="group_by"]:checked');
    if (groupByCheckboxes.length > 0) {
        const values = Array.from(groupByCheckboxes).map(cb => cb.value);
        requestData.group_by = values;
        requestData.aggregate = { "price": ["max", "count", { "quantile": 0.25 }] };
    }



    // Example handling for checkboxes (e.g., gearbox, year)
    // Assuming gearbox options are checkboxes with a common name
    const gearboxCheckboxes = document.querySelectorAll('input[name="gearbox"]:checked');
    if (gearboxCheckboxes.length > 0) {
        const values = Array.from(gearboxCheckboxes).map(cb => cb.value);
        requestData.filter_string.push({ In: ['gearbox', values] });

    }

    // Assuming year is handled with checkboxes or a range and collecting all checked years
    const yearCheckboxes = document.querySelectorAll('input[name="year"]:checked');
    if (yearCheckboxes.length > 0) {
        const values = Array.from(yearCheckboxes).map(cb => parseInt(cb.value, 10));
        requestData.filter_i32.push({ In: ['year', values] });
    }

    // Assuming engine type is handled with checkboxes
    const engineCheckboxes = document.querySelectorAll('input[name="engine"]:checked');
    if (engineCheckboxes.length > 0) {
        const values = Array.from(engineCheckboxes).map(cb => cb.value);
        requestData.filter_string.push({ In: ['engine', values] });
    }

    document.getElementById('results').textContent = JSON.stringify(requestData, null, 2);

    // Place your fetch API call here as shown previously
}

export function populateMakesDropdown() {
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
                    select.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error fetching makes:', error));
}