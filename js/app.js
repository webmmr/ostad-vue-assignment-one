// getting the DOM elements
const curTime = document.getElementById("time"),
  curCity = document.getElementById("city"),
  curCountry = document.getElementById("country"),
  condition = document.getElementById("condition"),
  temperature = document.getElementById("temp"),
  feelsLike = document.getElementById("feels"),
  humidityValue = document.getElementById("hum_value"),
  uvValue = document.getElementById("uv_value"),
  visibilityValue = document.getElementById("vis_value"),
  windValue = document.getElementById("wind_value"),
  lastUpdated = document.getElementById("last_updated"),
  inputField = document.getElementById("search_city"),
  searchForm = document.getElementById("search_form");

// API key for the weather API
const apiKey = "ed6361071dmshce1cb7fb56c6f1dp10c4dejsnbf788e376a5b";

// getting the current position
navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
  const { latitude, longitude } = pos.coords;

  getCurrentCityWeatherData(latitude, longitude);
  document.body.classList.remove("blurred");
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Fetch weather data for the current city based on coordinates
async function getCurrentCityWeatherData(lat, lon) {
  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${lat}&q=${lon}&days=1`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    const { location, current } = await response.json();

    displayWeather(location, current);
  } catch (e) {
    console.error("Error fetching weather data:", error);
  }
}

// handling the form submit
const handleSubmit = (e) => {
  e.preventDefault();

  let searchCity = inputField.value;

  getSearchWeatherdata(searchCity);

  searchForm.reset();
};

// Event listener for form submission
searchForm.addEventListener("submit", handleSubmit);

// getting weather data based on the searched city
async function getSearchWeatherdata(searchCity) {
  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${searchCity}&days=1`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    const { location, current } = await response.json();

    displayWeather(location, current);
  } catch (e) {
    console.error("Error fetching weather data:", error);
  }
}

function displayWeather(location, current) {
  // current time
  const [date, time] = location.localtime.split(" ");
  const [hour, minute] = time.split(":");

  const currentTime = `${hour <= 12 ? hour : hour - 12}:${minute} ${
    hour <= 12 ? "AM" : "PM"
  }`;

  const currentDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // last updated
  const [lastDate, lastTime] = current.last_updated.split(" ");
  const [lastHour, lastMinute] = lastTime.split(":");

  const LastUpdatedTime = `${lastHour <= 12 ? hour : hour - 12}:${lastMinute} ${
    hour <= 12 ? "AM" : "PM"
  }`;

  const lastUpdatedDate = new Date(lastDate).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const { name: cityName, country } = location;

  const {
    condition: { text },
    temp_c: tempC,
    feelslike_c: feelsLikeC,
    humidity,
    uv,
    vis_km: visKm,
    wind_dir: windDir,
    wind_degree: windDegree,
    wind_kph: windKph,
  } = current;

  curTime.innerHTML = `${currentTime},  ${currentDate}`;

  curCity.textContent = cityName;
  curCountry.textContent = country;
  condition.textContent = text;
  temperature.innerHTML = tempC + "&#8451;";
  feelsLike.innerHTML = feelsLikeC + "&#8451;";

  humidityValue.textContent = humidity + "%";
  uvValue.textContent = uv;
  visibilityValue.textContent = visKm + "km";
  windValue.textContent = humidity + "%";
  windValue.textContent = `${windKph} kph, ${windDegree}° ${windDir}`;
  lastUpdated.textContent = `${LastUpdatedTime},  ${lastUpdatedDate}`;
}
