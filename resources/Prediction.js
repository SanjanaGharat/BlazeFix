// API Keys
const WEATHER_API_KEY = 'a7ad55f38f474e1992d150328252203'; // WeatherAPI Key
const OPENCAGE_API_KEY = '5332a17920ac4753be126570aee75e39'; // OpenCage API Key

// Risk Level Chart (Bar Chart)
const riskLevelCtx = document.getElementById('riskLevelChart').getContext('2d');
const riskLevelChart = new Chart(riskLevelCtx, {
    type: 'bar',
    data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
            label: 'Risk Level',
            data: [0, 0, 0], 
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        }
    }
});

// Fetch Data from Location
document.getElementById('fetchLocationData').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                // Fetch weather data using WeatherAPI
                const weatherData = await fetchWeatherData(latitude, longitude);

                // Update form fields with integer values
                document.getElementById('temperature').value = Math.round(weatherData.current.temp_c); // Temperature in °C
                document.getElementById('humidity').value = Math.round(weatherData.current.humidity); // Humidity in %
                document.getElementById('windSpeed').value = Math.round(weatherData.current.wind_kph); // Wind speed in km/h

                // Generate a random Vegetation Index (NDVI) between 0 and 100
                const randomVegetation = Math.floor(Math.random() * 101); 
                document.getElementById('vegetation').value = randomVegetation;

                // Fetch location name using OpenCage Geocoding API
                const locationName = await fetchLocationName(latitude, longitude);
                console.log('Location Name:', locationName); // Debugging
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch weather data. Please try again.');
            }
        }, (error) => {
            console.error('Error getting location:', error);
            alert('Unable to fetch your location. Please enable location access.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Fetch Weather Data from WeatherAPI
async function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        console.log('Weather Data:', data); // Debugging
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Fetch Location Name from OpenCage Geocoding API
async function fetchLocationName(lat, lon) {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=${lat},${lon}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch location name');
        const data = await response.json();
        return data.results[0]?.formatted || 'Unknown Location';
    } catch (error) {
        console.error('Error fetching location name:', error);
        throw error;
    }
}

// Prediction Form Submission
document.getElementById('predictionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values and parse them as integers
    const temperature = parseInt(document.getElementById('temperature').value, 10);
    const humidity = parseInt(document.getElementById('humidity').value, 10);
    const windSpeed = parseInt(document.getElementById('windSpeed').value, 10);
    const vegetation = parseInt(document.getElementById('vegetation').value, 10);

    // Mock prediction logic
    let riskLevel, riskPercentage;
    if (temperature > 30 && humidity < 30 && windSpeed > 20) {
        riskLevel = 'High';
        riskPercentage = 90;
    } else if (temperature > 25 && humidity < 50 && windSpeed > 10) {
        riskLevel = 'Medium';
        riskPercentage = 60;
    } else {
        riskLevel = 'Low';
        riskPercentage = 20;
    }

    // Update Prediction Result
    const predictionResult = document.getElementById('predictionResult');
    predictionResult.innerHTML = `
        <p class="text-2xl font-semibold text-${
            riskLevel === 'High' ? 'red' : riskLevel === 'Medium' ? 'orange' : 'green'
        }-500">
            Fire Risk: ${riskLevel}
        </p>
        <p class="text-xl text-gray-300 mt-2">Risk Percentage: ${riskPercentage}%</p>
    `;

    // Update Risk Level Chart
    riskLevelChart.data.datasets[0].data = [
        riskLevel === 'Low' ? 100 : 0,
        riskLevel === 'Medium' ? 100 : 0,
        riskLevel === 'High' ? 100 : 0
    ];
    riskLevelChart.update();
});



function updateMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            // Update Google Map with the user's location
            let mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${lon}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus`;
            document.getElementById("fireRiskMap").src = mapSrc;
        }, function(error) {
            console.error("Error getting location:", error);
            document.getElementById("fireRiskMap").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.95373531531615!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus";
        });
    } else {
        console.error("Geolocation is not supported.");
    }
}

updateMap();
