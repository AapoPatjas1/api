// API-avaimet
const OPENWEATHER_API_KEY = 'f4e2e4c51a394d6ef0cdba1b41517e61';
const PEXELS_API_KEY = 'LgW5KUHgYLGfMrMiWvHMJRWiHZ9TJki9mZLQ1CUbsMBX6027tyt92K53';

async function fetchWeatherData() {
  const cityName = document.getElementById('cityName').value.trim();
  if (!cityName) {
    alert('Syötä kaupungin nimi!');
    return;
  }

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (weatherResponse.ok) {
      displayCurrentWeather(weatherData);
      fetchForecastData(weatherData.coord);
      fetchAirQuality(weatherData.coord);
      fetchDynamicBackground(weatherData.weather[0].main);
      displayMap(weatherData.coord.lat, weatherData.coord.lon);
    } else {
      throw new Error(weatherData.message);
    }
  } catch (error) {
    alert(`Virhe: ${error.message}`);
  }
}

function displayCurrentWeather(data) {
  const container = document.getElementById('current-weather');
  container.innerHTML = `
    <h2>Nykyinen sää: ${data.name}</h2>
    <p><strong>Lämpötila:</strong> ${data.main.temp}°C</p>
    <p><strong>Kosteus:</strong> ${data.main.humidity}%</p>
    <p><strong>Säätila:</strong> ${data.weather[0].description}</p>
  `;
}

async function fetchForecastData(coord) {
  const { lat, lon } = coord;
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );
  const forecastData = await forecastResponse.json();

  const labels = [];
  const temps = [];
  const rain = [];

  forecastData.list.forEach(item => {
    labels.push(item.dt_txt);
    temps.push(item.main.temp);
    rain.push(item.rain ? item.rain['3h'] || 0 : 0);
  });

  renderForecastChart(labels, temps, rain);
}

function renderForecastChart(labels, temps, rain) {
  const ctx = document.getElementById('forecastCanvas').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Lämpötila (°C)',
          data: temps,
          borderColor: 'red',
          fill: false,
        },
        {
          label: 'Sade (mm)',
          data: rain,
          borderColor: 'blue',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

async function fetchAirQuality(coord) {
  const { lat, lon } = coord;
  const airQualityResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
  );
  const airQualityData = await airQualityResponse.json();

  displayAirQuality(airQualityData);
}

function displayAirQuality(data) {
  const container = document.getElementById('air-quality');
  const airQualityIndex = data.list[0].main.aqi;
  const qualityMap = {
    1: 'Erinomainen',
    2: 'Hyvä',
    3: 'Kohtalainen',
    4: 'Huono',
    5: 'Erittäin huono',
  };

  container.innerHTML = `
    <h2>Ilmansaasteet</h2>
    <p><strong>Ilmanlaatuindeksi:</strong> ${airQualityIndex} (${qualityMap[airQualityIndex]})</p>
  `;
}

async function fetchDynamicBackground(weather) {
  const query = weather.toLowerCase();
  const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  const data = await response.json();
  if (data.photos.length > 0) {
    document.body.style.backgroundImage = `url(${data.photos[0].src.original})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  }
}

function displayMap(lat, lon) {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = ''; 

  const map = L.map('map').setView([lat, lon], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map);

  L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`
  ).addTo(map);
}

async function fetchUserLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      displayCurrentWeather(weatherData);
      fetchForecastData(weatherData.coord);
      fetchAirQuality(weatherData.coord);
      fetchDynamicBackground(weatherData.weather[0].main);
      displayMap(latitude, longitude);
    }, () => {
      alert('Sijaintia ei voitu hakea.');
    });
  } else {
    alert('Selaimesi ei tue geolokaatioita.');
  }
}


window.onload = fetchUserLocationWeather;
