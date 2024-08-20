 // Ensure this is declared globally

function getWeekDays() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
    return days.slice(today).concat(days.slice(0, today)); // Rotate the days array to start with today
}

async function fetchData(period) {
    try {
        const endpoint = period === 'daily' ? '/daily-sum' : '/yearly-sum'; // Update as necessary
        const response = await fetch(endpoint); // API endpoint to fetch data
        const data = await response.json();

        // Assuming data is an array of values for each day of the week
        const DAILYTOTAL = data.dailyTotal; // e.g., [10, 20, 30, 40, 50, 60, 70]
        const DAILYALLOCATEDAMOUNT = data.dailyAllocatedAmount; // e.g., [15, 25, 35, 45, 55, 65, 75]

        // Rotate the data arrays to match the rotated labels
        const today = new Date().getDay();
        const rotatedDailyTotal = DAILYTOTAL.slice(today).concat(DAILYTOTAL.slice(0, today));
        const rotatedDailyAllocatedAmount = DAILYALLOCATEDAMOUNT.slice(today).concat(DAILYALLOCATEDAMOUNT.slice(0, today));

        // Destroy existing chart instance if it exists
        if (chart) {
            chart.destroy(); // Destroy existing chart instance before creating a new one
        }

        const ctx = document.getElementById('salesChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: getWeekDays(), // Dynamic labels based on the current day
                datasets: [
                    {
                        label: 'Actual Expense',
                        data: rotatedDailyTotal, // Rotated data for each day
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Budget',
                        data: rotatedDailyAllocatedAmount, // Rotated data for each day
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
    const selectedPeriod = event.target.value ? "daily" : "";
    fetchData(selectedPeriod); // Fetch data based on the selected time period
});
