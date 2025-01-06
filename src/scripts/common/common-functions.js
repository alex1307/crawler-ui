export function populateDropdown(selectElementId, columns) {
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

export function cleanObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(cleanObject).filter(item => item !== null && item !== undefined);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, value]) => value !== null && value !== undefined)
                .map(([key, value]) => [key, cleanObject(value)])
        );
    }
    return obj;
}