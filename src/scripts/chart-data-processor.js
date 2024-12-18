/**
 * Prepares chart data for 1, 2, or 3 dimensions.
 * @param {Object} response - The API response containing dimensions and data.
 * @returns {Object} Chart.js data object containing labels and datasets.
 */
function prepareChartData(response) {
    const { dimensions, data } = response;

    if (!dimensions || dimensions.length === 0) {
        throw new Error("No dimensions provided in the response.");
    }

    // Handle 1 Dimension
    if (dimensions.length === 1) {
        const labels = dimensions[0].data; // Use first dimension data as labels
        const counts = data.map(d => d.count); // Extract count values

        return {
            labels,
            datasets: [
                {
                    label: dimensions[0].label || "Data",
                    data: counts,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }

    // Handle 2 Dimensions
    if (dimensions.length === 2) {
        const dim1 = dimensions[0].data; // First dimension (e.g., gearbox)
        const dim2 = dimensions[1].data; // Second dimension (e.g., engine)
        const counts = data.map(d => d.count); // Count values

        // Group data by dim1 (x-axis) and dim2 (stacked groups)
        const groupedData = {};
        dim1.forEach((dim1Value, index) => {
            const dim2Value = dim2[index];
            const count = counts[index];

            if (!groupedData[dim1Value]) {
                groupedData[dim1Value] = {};
            }
            groupedData[dim1Value][dim2Value] = (groupedData[dim1Value][dim2Value] || 0) + count;
        });

        // Extract unique labels for dim1 and dim2
        const uniqueDim1 = Object.keys(groupedData); // X-axis labels
        const uniqueDim2 = Array.from(new Set(dim2)); // Unique stack labels

        // Create datasets for stacked bars
        const datasets = uniqueDim2.map(dim2Value => ({
            label: dim2Value,
            data: uniqueDim1.map(dim1Value => groupedData[dim1Value][dim2Value] || 0),
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
            borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
            borderWidth: 1,
        }));

        return {
            labels: uniqueDim1,
            datasets,
        };
    }

    // Handle 3 Dimensions
    if (dimensions.length === 3) {
        const dim1 = dimensions[0].data; // First dimension (e.g., gearbox)
        const dim2 = dimensions[1].data; // Second dimension (e.g., engine)
        const dim3 = dimensions[2].data; // Third dimension (e.g., make)
        const counts = data.map(d => d.count); // Count values

        // Group data by dim1, dim2, and dim3
        const groupedData = {};
        dim1.forEach((dim1Value, index) => {
            const dim2Value = dim2[index];
            const dim3Value = dim3[index];
            const count = counts[index];

            if (!groupedData[dim1Value]) {
                groupedData[dim1Value] = {};
            }
            if (!groupedData[dim1Value][dim2Value]) {
                groupedData[dim1Value][dim2Value] = {};
            }
            groupedData[dim1Value][dim2Value][dim3Value] =
                (groupedData[dim1Value][dim2Value][dim3Value] || 0) + count;
        });

        // Extract unique labels for dim1, dim2, and dim3
        const uniqueDim1 = Object.keys(groupedData); // X-axis labels
        const uniqueDim2 = Array.from(
            new Set(dim2)
        ); // Group labels for stacks
        const uniqueDim3 = Array.from(
            new Set(dim3)
        ); // Nested group labels for nested stacks

        // Create datasets for nested stacked bars
        const datasets = [];
        uniqueDim3.forEach(dim3Value => {
            uniqueDim2.forEach(dim2Value => {
                datasets.push({
                    label: `${dim3Value} - ${dim2Value}`,
                    data: uniqueDim1.map(dim1Value =>
                        (groupedData[dim1Value][dim2Value] &&
                            groupedData[dim1Value][dim2Value][dim3Value]) || 0
                    ),
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    borderWidth: 1,
                });
            });
        });

        return {
            labels: uniqueDim1,
            datasets,
        };
    }

    throw new Error("Unsupported number of dimensions in response.");
}