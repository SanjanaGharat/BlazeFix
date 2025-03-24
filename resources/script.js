// Navbar functionality
document.getElementById('menu-btn').addEventListener('click', function () {
    const menu = document.getElementById('mobile-menu');
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
});

// Function to fetch weather data from WeatherAPI
async function fetchWeatherData(location) {
    const apiKey = 'a7ad55f38f474e1992d150328252203'; // Your WeatherAPI Key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather Data:', data); // Log the API response
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please check the location name and try again.');
        return null;
    }
}

// Function to calculate fire risk locally
function calculateFireRisk(weatherData) {
    const temperature = weatherData.current.temp_c;
    const humidity = weatherData.current.humidity;
    const windSpeed = weatherData.current.wind_kph;

    let riskLevel, riskPercentage;

    // Fire risk calculation logic
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

    return { riskLevel, riskPercentage };
}

// Function to display fire risk prediction
function displayFireRiskPrediction(riskLevel, riskPercentage) {
    const riskResult = document.getElementById('riskResult');
    const riskLevelElement = document.getElementById('riskLevel');
    const riskPercentageElement = document.getElementById('riskPercentage');

    if (riskResult && riskLevelElement && riskPercentageElement) {
        riskResult.classList.remove('hidden');
        riskLevelElement.textContent = riskLevel;
        riskPercentageElement.textContent = `Risk Percentage: ${riskPercentage}%`;

        // Update risk level color
        riskLevelElement.className = `text-4xl font-semibold mt-4 ${
            riskLevel === 'High' ? 'text-red-500' :
            riskLevel === 'Medium' ? 'text-orange-500' : 'text-green-500'
        }`;
    } else {
        console.error('Error: DOM elements not found.');
    }
}

// Function to fetch place name using OpenCage Geocoding API
async function fetchPlaceName(latitude, longitude) {
    const apiKey = '5332a17920ac4753be126570aee75e39'; // Your OpenCage API Key
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const placeName = data.results[0].formatted; 
        return placeName;
    } catch (error) {
        console.error('Error fetching place name:', error);
        return null;
    }
}

// Function to update the search bar with the place name
function updateSearchBar(placeName) {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.value = placeName;
    } else {
        console.error('Error: Search input not found.');
    }
}

// Automatically detect location, fetch weather data, and display fire risk
async function autoDetectLocationAndPredict() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Fetch weather data
            const weatherData = await fetchWeatherData(`${latitude},${longitude}`);
            if (weatherData) {
                // Calculate fire risk locally
                const { riskLevel, riskPercentage } = calculateFireRisk(weatherData);

                // Display the fire risk prediction
                displayFireRiskPrediction(riskLevel, riskPercentage);

                // Fetch place name
                const placeName = await fetchPlaceName(latitude, longitude);
                if (placeName) {
                    // Update the search bar
                    updateSearchBar(placeName);
                }
            }
        }, (error) => {
            console.error('Error getting location:', error);
            alert('Unable to fetch your location. Please enable location access.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Use My Location Button
document.getElementById('useLocationButton')?.addEventListener('click', function () {
    autoDetectLocationAndPredict();
});

// Check Risk Button
document.getElementById('checkRiskButton')?.addEventListener('click', async function () {
    const locationInput = document.getElementById('locationInput').value;
    if (locationInput) {
        // Fetch weather data for the entered location
        const weatherData = await fetchWeatherData(locationInput);
        if (weatherData) {
            // Calculate fire risk locally
            const { riskLevel, riskPercentage } = calculateFireRisk(weatherData);

            // Display the fire risk prediction
            displayFireRiskPrediction(riskLevel, riskPercentage);

            // Update the search bar with the entered location
            updateSearchBar(locationInput);
        }
    } else {
        alert('Please enter a location or use "Use my location".');
    }
});

// Automatically detect location and predict when the page loads
window.onload = autoDetectLocationAndPredict;
