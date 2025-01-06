// Function to transform JSON data into Chart.js compatible data structure
function transformDataForChart(rawData) {
    // Check if the data is in the expected format
    if (!Array.isArray(rawData)) {
        console.error('Data format error: Expected an array of objects, but received:', rawData);
        return { labels: [], datasets: [] };
    }

    // Extract the labels (years) and datasets (min, avg, median, max)
    const labels = rawData.map(item => item.year);

    // Create datasets for each statistic
    const datasets = [
        {
            label: 'Minimum Price',
            data: rawData.map(item => item.min),
            backgroundColor: 'rgba(255, 99, 132, 0.7)', // Color for min price
        },
        {
            label: 'Average Price',
            data: rawData.map(item => item.avg),
            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Color for avg price
        },
        {
            label: 'Median Price',
            data: rawData.map(item => item.median),
            backgroundColor: 'rgba(75, 192, 192, 0.7)', // Color for median price
        },
        {
            label: 'Maximum Price',
            data: rawData.map(item => item.max),
            backgroundColor: 'rgba(153, 102, 255, 0.7)', // Color for max price
        }
    ];

    return {
        labels: labels, // Years on the Y-axis
        datasets: datasets, // Data for each statistic
    };
}

// Function to generate the horizontal stacked bar chart
function generateBarChart(ctx, transformedData) {
    return new Chart(ctx, {
        type: 'bar',
        data: transformedData,
        options: {
            indexAxis: 'y', // Ensure the bars are horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Horizontal Stacked Bar Chart by Year' },
            },
            scales: {
                x: {
                    stacked: true, // Enable stacking on the X-axis for horizontal bars
                    beginAtZero: true,
                    title: { display: true, text: 'Price Values' },
                },
                y: {
                    stacked: true, // Ensure the Y-axis is stacked for grouped categories
                    title: { display: true, text: 'Year' },
                },
            },
        },
    });
}

// Event listener for the "Generate Chart" button
