// Your other JavaScript code

export function redirect() {
    const json = generateRequestData();
    const columns = [
        { value: "make", text: "Make" },
        { value: "model", text: "Model" },
        { value: "year", text: "Year" },
        { value: "engine", text: "Engine" },
        { value: "gearbox", text: "Gearbox" },
        { value: "power", text: "Power" },
        { value: "mileage", text: "Mileage" },
        { value: "price_in_eur", text: "Price" },
        { value: "discount", text: "Discount" },
        { value: "save_diff", text: "Saved Difference" },
        { value: "increase", text: "Increase" },
        { value: "extra_charge", text: "Extra Charge" }
    ];
    localStorage.setItem('columns', JSON.stringify(columns));
    localStorage.setItem('requestData', JSON.stringify(json));
    localStorage.setItem('type', 'search');
    window.location.href = `results.html`;
}

function generateRequestData() {
    const data = {
        make: getValue('make'),
        model: getValue('model'),
        search: getValue('search'),
        gearbox: getValue('gearbox'),

        yearFrom: getParsedValue('yearFrom'),
        yearTo: getParsedValue('yearTo'),
        powerFrom: getParsedValue('powerFrom'),
        powerTo: getParsedValue('powerTo'),
        mileageFrom: getParsedValue('mileageFrom'),
        mileageTo: getParsedValue('mileageTo'),
        ccFrom: getParsedValue('ccFrom'),
        ccTo: getParsedValue('ccTo'),

        priceFrom: getParsedValue('priceFrom'),
        priceTo: getParsedValue('priceTo'),

        saveDiffFrom: getParsedValue('saveDiffFrom'),
        saveDiffTo: getParsedValue('saveDiffTo'),

        discountFrom: getParsedValue('discountFrom'),
        discountTo: getParsedValue('discountTo'),

        createdOnFrom: getParsedValue('createdOnFrom'),
        createdOnTo: getParsedValue('createdOnTo'),

        order: [],
        engine: getCheckedValues('engine'),
        aggregators: [],
        group: []
    };

    return data;
}

function getValue(id) {
    return document.getElementById(id).value || null;
}

function getParsedValue(id) {
    const value = document.getElementById(id).value;
    return value ? parseInt(value, 10) : null;
}

function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return checkboxes.length > 0 ? Array.from(checkboxes).map(cb => cb.value) : [];
}
