//home page chart

document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('fireTrendChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Fires',
                data: [50, 40, 70, 120, 160, 200],
                borderColor: 'orange',
                backgroundColor: 'rgba(255, 165, 0, 0.3)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'orange',
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: 'white',
                borderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(tooltipItem) {
                            return ` Fires: ${tooltipItem.raw}`;
                        }
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: 'white' }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: 'white' }
                }
            }
        }
    });
});
