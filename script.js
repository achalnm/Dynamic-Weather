document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        getCoordinates(city);
    }
});

async function getCoordinates(city) {
    try {
        const apiKey = '3d94d653fc754e72bf868f7531136541';
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const coords = data.results[0].geometry;
            getWeather(coords.lat, coords.lng);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching coordinates. Please try again later.');
    }
}

async function getWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();

        if (data && data.current_weather) {
            displayWeather(data);
        } else {
            alert('Weather data not found. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching weather data. Please try again later.');
    }
}

function displayWeather(data) {
    const current = data.current_weather;

    document.getElementById('weather-display').style.display = 'block';
    document.getElementById('city-name').textContent = `Weather in ${document.getElementById('city-input').value}`;
    document.getElementById('temperature').textContent = `${Math.round(current.temperature)}°C`;
    document.getElementById('condition').textContent = `Condition: ${getWeatherCondition(current.weathercode)}`;
    document.getElementById('humidity').textContent = `Humidity: ${current.relative_humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${current.windspeed} km/h`;
}

function getWeatherCondition(code) {
    const conditions = {
        '0': 'Clear sky',
        '1': 'Mainly clear',
        '2': 'Partly cloudy',
        '3': 'Overcast',
    };
    return conditions[code] || 'Unknown condition';
}
