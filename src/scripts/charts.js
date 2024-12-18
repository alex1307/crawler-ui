// Gaussian random function
// Retrieve the canvas element
// var myChartCanvas = document.getElementById("myChart").getContext('2d');
// var vehiclesByMakeCanvas = document.getElementById("vehiclesByMakeChart").getContext('2d');
// var vehiclesByMakeEngineCanvas = document.getElementById("vehiclesByMakeEngineChart").getContext('2d');
// var priceStatsByMakeCanvas = document.getElementById("priceStatsByMakeChart").getContext('2d');

// Chart data
var data = {
    labels: [
        "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"
    ],
    datasets: [
        {
            label: "Scores Distribution",
            data: [4, 8, 15, 30, 40, 30, 15, 8, 4],
            backgroundColor: [
                "rgba(255, 0, 0, 0.6)", "rgba(255, 48, 0, 0.6)", "rgba(255, 102, 0, 0.6)",
                "rgba(255, 154, 0, 0.6)", "rgba(255, 205, 0, 0.6)", "rgba(255, 255, 0, 0.6)",
                "rgba(203, 255, 0, 0.6)", "rgba(150, 255, 0, 0.6)", "rgba(94, 255, 0, 0.6)",
                "rgba(0, 255, 0, 0.6)"
            ]
        }
    ]
};

// Chart options with Data Labels
var options = {
    plugins: {
        tooltip: {
            enabled: false
        },
        legend: {
            display: false
        },
        annotation: {
            annotations: {
                line1: {
                    type: 'line',
                    xMin: 5, // The index of the "70%" label in the labels array
                    xMax: 5, // The index of the "70%" label in the labels array
                    borderColor: 'black',
                    borderWidth: 2,
                    label: {
                        content: 'Your Score: 73%',
                        enabled: true,
                        position: 'top',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        yAdjust: -10 // Adjust the vertical position of the label
                    }
                }
            }
        },
        datalabels: {
            anchor: 'end',    // Position the label at the end of the bar
            align: 'top',     // Align the label to the top of the bar
            formatter: (value) => value, // Display the value as is
            color: 'black',   // Color of the label
            font: {
                weight: 'bold',
                size: 12       // Font size of the label
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true, // Start y-axis at zero for proper display
            display: true,     // Ensure the y-axis is displayed for a better look
            title: {
                display: true,
                text: "Score Values"
            }
        },
        x: {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            grid: {
                display: false
            },
            title: {
                display: true,
                text: "Percentiles"
            }
        }
    }
};

// Register the Data Labels plugin
Chart.register(ChartDataLabels);

// Create the bar chart with the plugin
var myBarChart = new Chart(myChartCanvas, {
    type: 'bar',
    data: data,
    options: options,
    plugins: [ChartDataLabels] // Include the Data Labels plugin
});

var vehiclesByMakeData = {
    labels: ["Toyota", "Honda", "Ford", "BMW", "Tesla"], // Replace with actual makes
    datasets: [
        {
            label: "Vehicle Count",
            data: [150, 120, 180, 90, 60], // Replace with actual counts
            backgroundColor: "rgba(54, 162, 235, 0.6)"
        }
    ]
};

var vehiclesByMakeOptions = {
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Number of Vehicles'
            }
        },
        x: {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            grid: {
                display: false
            },
            title: {
                display: true,
                text: 'Vehicle Make'
            }
        }
    }
};

// var vehiclesByMakeChart = new Chart(vehiclesByMakeCanvas, {
//     type: 'bar',
//     data: vehiclesByMakeData,
//     options: vehiclesByMakeOptions
// });



// Example data for vehicle counts by make and engine type
var vehiclesByMakeEngineData = {
    labels: ["Toyota", "Honda", "Ford", "BMW", "Tesla"], // Replace with actual makes
    datasets: [
        {
            label: "Gasoline",
            data: [50, 40, 60, 30, 0], // Replace with actual counts
            backgroundColor: "rgba(255, 99, 132, 0.6)"
        },
        {
            label: "Diesel",
            data: [20, 30, 40, 20, 0], // Replace with actual counts
            backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
            label: "Electric",
            data: [10, 10, 20, 10, 60], // Replace with actual counts
            backgroundColor: "rgba(75, 192, 192, 0.6)"
        }
    ]
};

var vehiclesByMakeEngineOptions = {
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Number of Vehicles'
            },
            stacked: true  // Stack the bars
        },
        x: {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            grid: {
                display: false
            },
            title: {
                display: true,
                text: 'Vehicle Make'
            },
            stacked: true  // Stack the bars
        }
    }
};

var vehiclesByMakeEngineChart = new Chart(vehiclesByMakeEngineCanvas, {
    type: 'bar',
    data: vehiclesByMakeEngineData,
    options: vehiclesByMakeEngineOptions
});


var priceStatsByMakeData = {
    labels: ["Toyota", "Honda", "Ford", "BMW", "Tesla"], // Replace with actual makes
    datasets: [
        {
            label: "Min Price",
            data: [15000, 13000, 20000, 30000, 50000], // Replace with actual min prices
            backgroundColor: "rgba(75, 192, 192, 0.6)"
        },
        {
            label: "Mean Price",
            data: [25000, 20000, 30000, 50000, 80000], // Replace with actual mean prices
            backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
            label: "Median Price",
            data: [24000, 19000, 29000, 48000, 75000], // Replace with actual median prices
            backgroundColor: "rgba(255, 159, 64, 0.6)"
        },
        {
            label: "66th Percentile Price",
            data: [26000, 21000, 31000, 52000, 82000], // Replace with actual 66th percentile prices
            backgroundColor: "rgba(153, 102, 255, 0.6)"
        },
        {
            label: "Max Price",
            data: [40000, 35000, 50000, 70000, 100000], // Replace with actual max prices
            backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
    ]
};

var priceStatsByMakeOptions = {
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Price (in USD)'
            },
            stacked: true  // Stack the bars
        },
        x: {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            grid: {
                display: false
            },
            title: {
                display: true,
                text: 'Vehicle Make'
            },
            stacked: true  // Stack the bars
        }
    }
};
var priceStatsByMakeChart = new Chart(priceStatsByMakeCanvas, {
    type: 'bar',
    data: priceStatsByMakeData,
    options: priceStatsByMakeOptions
});


var boxPlotCanvas = document.getElementById("priceBoxPlot").getContext('2d');

const maxPrice = 100000; // Assume the max price in your dataset is 100,000

const boxPlotData = {
    labels: ["Min Price", "Mean Price", "Median Price", "66th Percentile", "Max Price"],
    datasets: [
        {
            label: "Toyota",
            data: [15000, 25000, 24000, 26000, 40000], // Use actual prices
            backgroundColor: "rgba(255, 99, 132, 0.6)"
        },
        {
            label: "Honda",
            data: [13000, 20000, 19000, 21000, 35000], // Use actual prices
            backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
            label: "Ford",
            data: [20000, 30000, 29000, 31000, 50000], // Use actual prices
            backgroundColor: "rgba(255, 206, 86, 0.6)"
        },
        {
            label: "BMW",
            data: [30000, 50000, 48000, 52000, 70000], // Use actual prices
            backgroundColor: "rgba(75, 192, 192, 0.6)"
        },
        {
            label: "Tesla",
            data: [50000, 75000, 74000, 77000, 100000], // Use actual prices
            backgroundColor: "rgba(153, 102, 255, 0.6)"
        }
    ]
};


const boxPlotOptions = {
    scale: {
        ticks: {
            beginAtZero: true, // Start the scale at zero
            max: 100000, // Maximum value on the scale (set to your highest price)
            stepSize: 5000, // Set a reasonable step size for readability
            callback: function (value) { // Display the price as is
                return '$' + value;
            }
        }
    },
    plugins: {
        legend: {
            display: true
        }
    }
};
// Create the radar chart
const myChart = new Chart(boxPlotCanvas, {
    type: 'radar',
    data: boxPlotData,
    options: boxPlotOptions
});





// Function to fetch data from backend endpoint and transform it into chart-compatible format


// Function to transform JSON data into Chart.js compatible data structure
function transformDataForChart(data) {
    // Extract years, avg prices, and counts from the data
    const combinedData = data.year.map((year, index) => ({
        year: year,
        avg: data.avg[index],
        count: data.count[index]
    }));

    // Sort the combined data by year in ascending order
    combinedData.sort((a, b) => a.year - b.year);

    // Separate the sorted data back into individual arrays
    const years = combinedData.map(item => item.year);
    const avgPrices = combinedData.map(item => item.avg);
    const counts = combinedData.map(item => item.count);

    return {
        labels: years, // x-axis labels
        datasets: [
            {
                label: "Average Price (EUR)",
                data: avgPrices, // avg prices data
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            },
            {
                label: "Vehicle Count",
                data: counts, // counts data
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }
        ]
    };
}

// Function to render the chart using Chart.js


// Call the function to fetch data and render the chart


async function fetchChartDataAndRender(requestBody) {
    const endpointUrl = 'https://localhost:3000/charts-data';

    // Extract groupByColumns and statFunctions from the requestBody
    const groupByColumns = requestBody.group || [];
    const statFunctions = requestBody.aggregators || [];

    try {
        // Fetch data from the endpoint
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Check for successful response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log('Received data from backend:', rawData);

        // Transform the data into the format expected by the charting function
        const data = transformData(rawData, groupByColumns, statFunctions);

        // Render the dynamic chart using the transformed data
        generateDynamicChart(data, groupByColumns, statFunctions);
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Function to transform the received data into an array of objects
// Function to transform and sort the received data into an array of objects
function transformData(rawData, groupByColumns, statFunctions) {
    const itemsCount = rawData.itemsCount || Math.min(...groupByColumns.map(col => rawData[col]?.length || 0));

    const transformedData = [];
    for (let i = 0; i < itemsCount; i++) {
        const item = {};
        groupByColumns.forEach(col => {
            item[col] = rawData[col][i];
        });
        statFunctions.forEach(stat => {
            item[stat] = rawData[stat][i];
        });
        transformedData.push(item);
    }

    // Sort the transformed data based on the first groupBy column (X-axis values)
    const xAxisColumn = groupByColumns[0];
    transformedData.sort((a, b) => {
        if (typeof a[xAxisColumn] === 'string') {
            return a[xAxisColumn].localeCompare(b[xAxisColumn]); // Sort alphabetically for strings
        } else {
            return a[xAxisColumn] - b[xAxisColumn]; // Sort numerically for numbers
        }
    });
    console.log('Transformed data:', transformedData);
    return transformedData;
}

// Generate the dynamic chart logic (same as before)
function generateDynamicChart(data, groupByColumns, statFunctions) {
    const ctx = document.getElementById('vehiclesByMakeChart').getContext('2d');
    if (groupByColumns.length === 1) {
        generateHorizontalBarChart(ctx, data, groupByColumns, statFunctions[0]);
    } else if (groupByColumns.length === 2) {
        generateStackedBarChart(ctx, data, groupByColumns, statFunctions[0]);
    } else if (groupByColumns.length === 3) {
        generateStackedGroupedBarChart(ctx, data, groupByColumns, statFunctions[0]);
    } else {
        console.error('Currently, we only support up to 3 grouping columns.');
    }
    // Determine the number of grouping columns and choose chart type accordingly
    // if (groupByColumns.length === 1) {
    //     generateBarChart(ctx, data, groupByColumns, statFunctions[0]);
    // } else if (groupByColumns.length === 2) {
    //     generateStackedBarChart(ctx, data, groupByColumns, statFunctions[0]);
    // } else if (groupByColumns.length === 3) {
    //     generateStackedGroupedBarChart(ctx, data, groupByColumns, statFunctions[0]);
    // } else {
    //     console.error('Currently, we only support up to 3 grouping columns.');
    // }
}

// Generate a regular bar chart for one grouping column
function generateBarChart(ctx, data, groupByColumns, statFunction) {
    const labels = [...new Set(data.map(item => item[groupByColumns[0]]))];
    const values = labels.map(label => {
        const entry = data.find(item => item[groupByColumns[0]] === label);
        return entry ? entry[statFunction] : 0;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                axis: 'y', // Ensure the bars are horizontal
                label: statFunction,
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Bar Chart grouped by ${groupByColumns[0]}` },
            },
        },
    });
}

// Generate a stacked bar chart for two grouping columns
// Generate a stacked bar chart for two grouping columns
function generateStackedBarChart(ctx, data, groupByColumns, statFunction) {
    const xAxisValues = [...new Set(data.map(item => item[groupByColumns[0]]))]; // Unique values from the first group-by column (e.g., year)
    const stackValues = [...new Set(data.map(item => item[groupByColumns[1]]))]; // Unique values from the second group-by column (e.g., make)

    const datasets = stackValues.map((stackValue, index) => ({
        label: stackValue,
        axis: 'y', // Ensure the bars are horizontal,
        fill: false,
        data: xAxisValues.map(xValue => {
            const entry = data.find(item => item[groupByColumns[0]] === xValue && item[groupByColumns[1]] === stackValue);
            return entry ? entry[statFunction] : 0;
        }),
        backgroundColor: `rgba(${index * 60}, ${index * 100}, ${index * 140}, 0.7)`,
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xAxisValues, // X-axis labels are from the first group-by column
            datasets: datasets,
        },
        options: {
            indexAxis: 'y', // Switch to horizontal bar chart
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Stacked Bar Chart grouped by ${groupByColumns.join(' and ')}` },
            },
            scales: {
                x: { stacked: true, title: { display: true, text: statFunction } },
                y: { stacked: true, title: { display: true, text: groupByColumns[0] } },
            },
        },
    });
}

// Generate a stacked grouped bar chart for three grouping columns
function generateStackedGroupedBarChart(ctx, data, groupByColumns, statFunction) {
    const group1Values = [...new Set(data.map(item => item[groupByColumns[0]]))]; // e.g., Make
    const group2Values = [...new Set(data.map(item => item[groupByColumns[1]]))]; // e.g., Year
    const group3Values = [...new Set(data.map(item => item[groupByColumns[2]]))]; // e.g., Model or Engine Type

    const datasets = group3Values.map((group3, index) => ({
        label: group3,
        axis: 'y', // Ensure the bars are horizontal
        data: group1Values.flatMap(group1 => group2Values.map(group2 => {
            const entry = data.find(item => item[groupByColumns[0]] === group1 && item[groupByColumns[1]] === group2 && item[groupByColumns[2]] === group3);
            return entry ? entry[statFunction] : 0;
        })),
        backgroundColor: `rgba(${index * 50}, ${index * 150}, ${index * 200}, 0.7)`,
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: group1Values.flatMap(group1 => group2Values.map(group2 => `${group1} - ${group2}`)),
            datasets: datasets,
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Stacked Grouped Bar Chart grouped by ${groupByColumns.join(', ')}` },
            },
            scales: {
                x: { stacked: true },
                y: { stacked: true },
            },
        },
    });
}

// Generate a horizontal bar chart for mobile-friendly display
function generateHorizontalBarChart(ctx, data, groupByColumns, statFunction) {
    const labels = [...new Set(data.map(item => item[groupByColumns[0]]))];
    const values = labels.map(label => {
        const entry = data.find(item => item[groupByColumns[0]] === label);
        return entry ? entry[statFunction] : 0;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: statFunction,
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
            }],
        },
        options: {
            indexAxis: 'y', // Switch to horizontal bar chart
            responsive: true,
            maintainAspectRatio: false, // Allows for better control on small screens
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Horizontal Bar Chart grouped by ${groupByColumns[0]}` },
            },
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    title: { display: true, text: groupByColumns[0] },
                },
            },
        },
    });
}

function generateHorizontalStackedBarChart(ctx, data, groupByColumns, statFunction) {
    const labels = [...new Set(data.map(item => item[groupByColumns[0]]))];
    const values = labels.map(label => {
        const entry = data.find(item => item[groupByColumns[0]] === label);
        return entry ? entry[statFunction] : 0;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            axis: 'y', // Ensure the bars are horizontal
            datasets: [{
                label: statFunction,
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
            }],
        },
        options: {
            indexAxis: 'y', // Switch to horizontal bar chart for better readability on mobile
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to resize properly on small screens
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: `Horizontal Bar Chart grouped by ${groupByColumns[0]}` },
                tooltip: { mode: 'index', intersect: false },
            },
            scales: {
                x: { beginAtZero: true },
                y: { title: { display: true, text: groupByColumns[0] } },
            },
        },
    });
}




// Generate a transposed (horizontal) stacked grouped bar chart for three grouping columns
// Generate a transposed (horizontal) stacked grouped bar chart for three grouping columns
// Generate a properly transposed (horizontal) stacked grouped bar chart for three grouping columns
// Generate a horizontal stacked grouped bar chart using Chart.js
function generateHorizontalStackedGroupedBarChart(ctx, data, groupByColumns, statFunction) {
    const group1Values = [...new Set(data.map(item => item[groupByColumns[0]]))]; // e.g., Year or other categories
    const group2Values = [...new Set(data.map(item => item[groupByColumns[1]]))]; // e.g., Different data segments
    const group3Values = [...new Set(data.map(item => item[groupByColumns[2]]))]; // e.g., Sub-segments

    // Create datasets for each subgroup within the grouped bar chart
    const datasets = group3Values.map((group3, index) => ({
        axis: 'y', // Ensure the bars are horizontal
        label: group3,
        data: group1Values.map(group1 => {
            return group2Values.reduce((sum, group2) => {
                const entry = data.find(item =>
                    item[groupByColumns[0]] === group1 &&
                    item[groupByColumns[1]] === group2 &&
                    item[groupByColumns[2]] === group3
                );
                return sum + (entry ? entry[statFunction] : 0);
            }, 0);
        }),
        backgroundColor: `rgba(${index * 50}, ${index * 150}, ${index * 200}, 0.7)`, // Unique color for each dataset
        borderWidth: 1,
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: group1Values, // Y-axis labels for years or categories
            datasets: datasets,   // Data for each stack
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right', // Legend position to the right, similar to ApexCharts style
                    align: 'start',
                },
                title: {
                    display: true,
                    text: 'Horizontal Stacked Grouped Bar Chart',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
            },
            scales: {
                x: {
                    stacked: true, // Enable stacking on the X-axis for horizontal bars
                    title: {
                        display: true,
                        text: statFunction,
                    },
                    beginAtZero: true, // Ensure the bars start at zero
                },
                y: {
                    stacked: true, // Enable stacking on the Y-axis
                    title: {
                        display: true,
                        text: groupByColumns[0],
                    },
                },
            },
        },
    });
}

// Generate a horizontal stacked bar chart for two grouping columns
function generateTranspondedStackedBarChart(ctx, data, groupByColumns, statFunction) {
    const xAxisValues = [...new Set(data.map(item => item[groupByColumns[0]]))]; // e.g., Year
    const stackValues = [...new Set(data.map(item => item[groupByColumns[1]]))]; // e.g., Mileage Range

    const datasets = stackValues.map((stackValue, index) => ({
        label: stackValue,
        data: xAxisValues.map(xValue => {
            const entry = data.find(item => item[groupByColumns[0]] === xValue && item[groupByColumns[1]] === stackValue);
            return entry ? entry[statFunction] : 0;
        }),
        backgroundColor: `rgba(${index * 60}, ${index * 100}, ${index * 140}, 0.7)`,
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xAxisValues, // Labels for the Y-axis (horizontal chart)
            datasets: datasets,  // Data for each stack segment
        },
        options: {
            axis: 'y', // Set to 'y' to make it horizontal
            responsive: true,
            maintainAspectRatio: false, // Allows better scaling on mobile devices
            plugins: {
                legend: { position: 'bottom' }, // Legend placement for better visibility
                title: { display: true, text: `Horizontal Stacked Bar Chart grouped by ${groupByColumns.join(' and ')}` },
                tooltip: { mode: 'index', intersect: false },
            },
            scales: {
                x: { stacked: true, title: { display: true, text: statFunction } }, // Stack the X-axis (values)
                y: { stacked: true, title: { display: true, text: groupByColumns[0] } }, // Group labels on the Y-axis
            },
        },
    });
}

// Update the chart generation logic to use the new function


// Use the new horizontal chart for one grouping column


const requestBody = {
    "make": "Audi",
    "model": null,
    "year": null,
    "engine": ["Petrol"],
    "gearbox": null,
    "yearFrom": 2014,
    "yearTo": 2022,
    "powerFrom": null,
    "powerTo": null,
    "mileageFrom": null,
    "mileageTo": null,
    "ccFrom": null,
    "ccTo": null,
    "priceFrom": 0,
    "priceTo": 100000,
    "group": ["year", "make"],
    "aggregators": ["count", "avg"],
    "order": [],
    "stat_column": "price_in_eur",
    "estimated_price": null
};

// Listen for form submission to generate the chart from the JSON data
document.getElementById('vehiclesByMakeChart').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const jsonData = document.getElementById('jsonInput').value; // Get JSON data from the textarea

    try {
        const requestBody = JSON.parse(jsonData); // Parse the JSON data

        // Call the function to render the chart with the parsed data
        fetchChartDataAndRender(requestBody);
    } catch (error) {
        alert('Invalid JSON format. Please check your input and try again.');
        console.error('JSON parsing error:', error);
    }
});

// Example Usage
