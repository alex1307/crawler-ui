
const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on the environment
const baseUrl = isLocalhost ? 'https://localhost:3000' : 'https://ehomeho.com:3000';

export function captureData() {

    const data = {
        make: $('#make').val() || null,
        model: $('#model').val() || null,
        year: $('#year').val() ? parseInt($('#year').val(), 10) : null,
        engine: $('#engine').val() || null,
        gearbox: $('#gearbox').val() || null,

        yearFrom: $('#yearMin').val() ? parseInt($('#yearMin').val(), 10) : null,
        yearTo: $('#yearMax').val() ? parseInt($('#yearMax').val(), 10) : null,


        powerFrom: $('#powerMin').val() ? parseInt($('#powerMin').val(), 10) : null,
        powerTo: $('#powerMax').val() ? parseInt($('#powerMax').val(), 10) : null,
        power: $('#power').val() ? parseInt($('#power').val(), 10) : null,

        mileageFrom: $('#mileageMin').val() ? parseInt($('#mileageFrom').val(), 10) : null,
        mileageTo: $('#mileageMax').val() ? parseInt($('#mileageMax').val(), 10) : null,
        mileage: $('#mileage').val() ? parseInt($('#mileage').val(), 10) : null,

        ccFrom: $('#ccMin').val() ? parseInt($('#ccMin').val(), null) : null,
        ccTo: $('#ccMax').val() ? parseInt($('#ccMax').val(), 10) : null,
        cc: $('#cc').val() ? parseInt($('#cc').val(), 10) : null,
        group: [],
        aggregators: [],
        order: [],
        stat_column: $('#stat_column').val() || "price",
        estimated_price: $('#estimated_price').val() ? parseInt($('#estimated_price').val(), 10) : null,
    };

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


    if ($('#groupByMake').is(':checked')) data.group.push('make');
    if ($('#groupByModel').is(':checked')) data.group.push('model');
    if ($('#groupByYear').is(':checked')) data.group.push('year');
    if ($('#groupByEngine').is(':checked')) data.group.push('engine');
    if ($('#groupByGearbox').is(':checked')) data.group.push('gearbox');
    if ($('#groupByPower').is(':checked')) data.group.push('power');

    // Statistics checkboxes
    if ($('#statCount').is(':checked')) data.aggregators.push('count');
    if ($('#statAvg').is(':checked')) data.aggregators.push('avg');
    if ($('#statMedian').is(':checked')) data.aggregators.push('median');
    if ($('#statMean').is(':checked')) data.aggregators.push('mean');
    if ($('#statMin').is(':checked')) data.aggregators.push('min');
    if ($('#statMax').is(':checked')) data.aggregators.push('max');
    if ($('#statP60').is(':checked')) data.aggregators.push('quantile_60');
    if ($('#statP66').is(':checked')) data.aggregators.push('quantile_66');
    if ($('#statP70').is(':checked')) data.aggregators.push('quantile_70');
    if ($('#statP75').is(':checked')) data.aggregators.push('quantile_75');
    if ($('#statP80').is(':checked')) data.aggregators.push('quantile_80');
    if ($('#statP90').is(':checked')) data.aggregators.push('quantile_90');
    if ($('#std').is(':checked')) data.aggregators.push('std');
    if ($('#rsd').is(':checked')) data.aggregators.push('rsd');

    // Orders
    if ($('#orderColumn1').val()) {
        data.order.push({
            column: $('#orderColumn1').val(),
            asc: $('input[name="order1"]:checked').val() === 'asc'
        });
    }
    if ($('#orderColumn2').val()) {
        data.order.push({
            column: $('#orderColumn2').val(),
            asc: $('input[name="order2"]:checked').val() === 'asc'
        });
    }
    if ($('#orderColumn3').val()) {
        data.order.push({
            column: $('#orderColumn3').val(),
            asc: $('input[name="order3"]:checked').val() === 'asc'
        });
    }


    console.log(data);
    return JSON.stringify(data);
}
function showError(message) {
    $('#errors').html(`<p>${message}</p>`);
}


// Validate JSON
export function validateJSON(json) {
    try {
        const data = JSON.parse(json);
        const selected = [data.make, data.model, data.year, data.engine, data.gearbox, data.power].filter(field => data[field] !== null);
        if (selected.length < 2) {
            console.log("invalid data");
            showError('fill in all vehicle filter fields');
            return false;
        }
        // Check for empty fiel ds

        // Check for empty groupBy and statistics
        if (data.group.length === 0) {
            console.log("invalid data");
            showError('Please select at least one group by field.');
            return false;
        }
        if (data.aggregators.length === 0) {
            showError('Please select at least one statistic.');
            console.log("invalid data");
            return false;
        }

        console.log("Valid JSON. Proceeding to display results.");

        // Clear any previous errors
        $('#errors').text('');
        $('#vehiclePriceCalculator').show();
        return true;
    } catch (e) {
        $('#errors').html('Invalid data format.');
        return false;
    }
}

export function displayResults(data) {
    if (!Array.isArray(data.statistics)) {
        console.error('Expected data.statistics to be an array, but got:', data.statistics);
        alert('An error occurred while processing statistics. Please try again.');
        return;
    }

    const table = $('<table class="table table-striped"></table>');
    const thead = $('<thead><tr><th>Statistic</th><th>Value</th></tr></thead>');
    const tbody = $('<tbody></tbody>');

    data.statistics.forEach(stat => {
        const tr = $('<tr></tr>');
        tr.append(`<td>${stat.stat}</td>`);
        tr.append(`<td>${stat.value}</td>`);
        tbody.append(tr);
    });

    table.append(thead);
    table.append(tbody);
    $('#resultContainer').html(table);
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
            if (['engine', 'gearbox', 'year'].includes(name)) {
                //populateCheckboxes(data, name);
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
                populateDropdown(data, 'Min', name);
                populateDropdown(data, 'Max', name);
            }
        })
        .catch(error => console.error('Error:', error));
}

export function populateDropdown(data, type, elementId) {
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
                if (key === '0' && type === 'Min') {
                    option.value = key;
                    option.textContent = "From";
                } else if (key === '0' && type === 'Max') {
                    option.value = key;
                    option.textContent = "To";
                } else {
                    option.value = key;
                    option.textContent = value;
                }
                select.appendChild(option);
            });
    }

}

export function populateCheckboxes(data, containerId) {
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
    ['price', 'mileage', 'cc', 'power', 'year', 'save_diff', 'discount'].forEach(field => {
        const minElement = document.getElementById(`${field}Min`);
        const maxElement = document.getElementById(`${field}Max`);

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
    const created_on = document.getElementById('created_onMin');
    if (created_on && created_on.value && created_on.value !== '0') {
        console.log("Created on: ", created_on.value);
        requestData.filter_date.push({ Gte: [{ "created_on": created_on.value }, true] });
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
        console.log(yearCheckboxes);
        const values = Array.from(yearCheckboxes).map(cb => parseInt(cb.value, 10));
        requestData.filter_i32.push({ In: ['year', values] });
    }

    // Assuming engine type is handled with checkboxes
    const engineCheckboxes = document.querySelectorAll('input[name="engine"]:checked');
    if (engineCheckboxes.length > 0) {
        const values = Array.from(engineCheckboxes).map(cb => cb.value);
        requestData.filter_string.push({ In: ['engine', values] });
    }
    ['sort_by_primary', 'sort_by_secondary'].forEach(sortElement => {
        const sortSelect = document.getElementById(sortElement);
        if (sortSelect && sortSelect.value) {
            const ascSelect = (sortElement === 'sort_by_primary') ?
                document.getElementById('asc_primary') : document.getElementById('asc_secondary');
            const asc = ascSelect.value === 'asc';
            requestData.sort.push({ [asc ? 'asc' : 'desc']: [sortSelect.value, true] });
        }
    });

    document.getElementById('results').textContent = JSON.stringify(requestData, null, 2);
    console.log('Request data:', requestData);
    showData(requestData);
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