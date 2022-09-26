// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

// Variables //
const nameOfCity = document.querySelector("#findCity");
const apiKey = "260882e0a8017e107611bafad6f6756b";
const city = "";
const previousCity = "";
const savedCities = "";

const apiCurrentWeather = function (event) {
  const city = document.querySelector("#city").value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log("city", response);
      nameOfCity.textContent = response.name;
      const currentDate = document.createElement("span");
      currentDate.textContent =
        " ( " + moment(response.dt.value).format("dddd DD/MM/YYYY") + " ) ";
      nameOfCity.appendChild(currentDate);

      const currentIcon = document.createElement("img");
      currentIcon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
      );
      nameOfCity.append(currentIcon);

      // Current Weather + Retrieving Data //
      const currentWeather = document.querySelector("#currentForecast");
      currentWeather.textContent = "";

      const currentTemperature = document.createElement("span");
      currentTemperature.textContent =
        "Temperature: " +
        Math.floor((response.main.temp - 273.15) * 1.8 + 32) +
        " °F";

      currentWeather.append(currentTemperature);
      const currentHumidity = document.createElement("span");
      currentHumidity.textContent = "Humidity: " + response.main.humidity + "%";
      currentWeather.append(currentHumidity);

      const currentWind = document.createElement("span");
      currentWind.textContent = "Wind: " + response.wind.speed + "MPH";
      currentWeather.append(currentWind);

      const lat = response.coord.lat;
      const lon = response.coord.lon;
      fetch(
        `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (uvi) {
          currentUvi = document.createElement("span");
          currentUvi.textContent = "UV Index: " + uvi.value;
          currentWeather.append(currentUvi);
        });
    });
};
