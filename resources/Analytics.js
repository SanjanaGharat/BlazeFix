// API Keys
const WEATHER_API_KEY = 'a7ad55f38f474e1992d150328252203'; // WeatherAPI Key
const OPENCAGE_API_KEY = '5332a17920ac4753be126570aee75e39'; // OpenCage API Key

// API Endpoints
const WEATHER_API_URL = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=`;
const OPENCAGE_API_URL = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=`;

// Fetch Weather Data from WeatherAPI
async function fetchWeatherData(location) {
    try {
        const response = await fetch(`${WEATHER_API_URL}${location}`);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        console.log('Weather Data:', data); // Debugging
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Fetch Location Name from OpenCage Geocoding API
async function fetchLocationName(latitude, longitude) {
    try {
        const response = await fetch(`${OPENCAGE_API_URL}${latitude},${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch location name');
        const data = await response.json();
        console.log('Location Data:', data); // Debugging
        return data.results[0]?.formatted || 'Unknown Location';
    } catch (error) {
        console.error('Error fetching location name:', error);
        return 'Unknown Location';
    }
}

// Update Key Metrics with Weather Data
function updateKeyMetrics(weatherData) {
    if (!weatherData) return;

    const temperature = weatherData.current.temp_c; // Temperature in Celsius
    const humidity = weatherData.current.humidity; // Humidity in percentage
    const windSpeed = weatherData.current.wind_kph; // Wind speed in km/h
    const condition = weatherData.current.condition.text; // Weather condition

    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
    document.getElementById('weatherCondition').textContent = condition;
}

// Update Fire Trends Chart (Example Data)
function updateFireTrendsChart() {
    const fireTrendsCtx = document.getElementById('fireTrendsChart').getContext('2d');
    new Chart(fireTrendsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Number of Fires',
                data: [12, 19, 3, 5, 2, 3, 7],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Risk Forecast Chart (Example Data)
function updateRiskForecastChart() {
    const riskForecastCtx = document.getElementById('riskForecastChart').getContext('2d');
    new Chart(riskForecastCtx, {
        type: 'bar',
        data: {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
                label: 'Risk Level',
                data: [12, 19, 3],
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
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Temperature Trends Chart (Example Data)
function updateTemperatureChart() {
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    new Chart(temperatureCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [22, 24, 26, 28, 30, 32, 34],
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Rainfall Data Chart (Example Data)
function updateRainfallChart() {
    const rainfallCtx = document.getElementById('rainfallChart').getContext('2d');
    new Chart(rainfallCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Rainfall (mm)',
                data: [50, 60, 70, 80, 90, 100, 110],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize Analytics Page
async function initializeAnalytics() {
    // Fetch weather data for a default location (e.g., London)
    const weatherData = await fetchWeatherData('London');
    updateKeyMetrics(weatherData);

    // Update charts with example data
    updateFireTrendsChart();
    updateRiskForecastChart();
    updateTemperatureChart();
    updateRainfallChart();
}

// Run on Page Load
window.onload = initializeAnalytics;


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