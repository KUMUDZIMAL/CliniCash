


async function fetchData() {
    try {
        const response = await fetch('/monthly-sum'); // API endpoint to fetch data
        const data = await response.json();

        // Extract and convert values to numbers
        const MONTHLYTOTAL = [data.monthlyTotal];
        const MONTHLYALLOCATEDAMOUNT = [parseFloat(data.monthlyAllocatedAmount.$numberDecimal)];

        if (chart) {
            chart.destroy(); // Destroy existing chart instance before creating a new one
        }

        const ctx = document.getElementById('salesChart').getContext('2d');
        const salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['AUGUST'], // Only one week since the data is a single value
                datasets: [
                    {
                        label: 'Actual Expense',
                        data: MONTHLYTOTAL, // Single value wrapped in an array
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Budget',
                        data: MONTHLYALLOCATEDAMOUNT, // Single value wrapped in an array
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching or plotting data:', error);
    }
}
document.getElementById('timePeriodSelect').addEventListener('change', (event) => {
    const selectedPeriod = event.target.value? "monthly":""
    fetchData(selectedPeriod); // Fetch data based on the selected time period
});