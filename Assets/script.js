// Variables //
const nameOfCity = document.querySelector("#findCity");
const apiKey = "0f5afb6cde51dd9b2a58d51dc4cf30d4";
const city = "";
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
        "Temperature: " + Math.floor(response.main.temp - 273.15) + " °C";

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

// Forecast Weather //
const apiForecastWeather = function (event) {
  const city = document.querySelector("#city").value;
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("forecast", data);
      const forecastTitle = document.querySelector("#forecast");
      forecastTitle.textContent = "";
      forecastTitle.textContent = "5-Day Forecast";

      const upcomingForecast = document.querySelector("#forecastContainer");
      upcomingForecast.innerHTML = "";
      for (let i = 0; i < data.list.length; i++) {
        const dayData = data.list[i];
        const dayTimeUTC = dayData.dt;
        const timeZoneOffset = data.city.timezone;
        const timeZoneOffsetHours = timeZoneOffset / 60 / 60;
        const thisMoment = moment
          .unix(dayTimeUTC)
          .utc()
          .utcOffset(timeZoneOffsetHours);
        if (
          thisMoment.format("HH:mm:ss") === "11:00:00" ||
          thisMoment.format("HH:mm:ss") === "12:00:00" ||
          thisMoment.format("HH:mm:ss") === "13:00:00"
        ) {
          // Retrieve Data//
          upcomingForecast.innerHTML += `
          <div class="card m-2 p0">
              <ul class="list-unstyled p-3">
                  <li>${thisMoment.format("dddd DD/MM/YY")}</li>
                  <li class="weather-icon"><img src="https://openweathermap.org/img/wn/${
                    dayData.weather[0].icon
                  }@2x.png"></li>
                  <li>Temp: ${dayData.main.temp}&#8451;</li>
                  <br>
                  <li>Wind: ${dayData.wind.speed} mph </li>
                  <br>
                  <li>Humidity: ${dayData.main.humidity} %</li>
              </ul>
          </div>`;
        }
      }
    });
};

// Adding to local storage //
const saveCity = function (newCity) {
  let cityExists = false;
  const city = document.querySelector("#city").value;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage["cities" + i] === city) {
      cityExists = true;
      break;
    }
  }
  // New searches saved to local storage //
  if (cityExists === false) {
    localStorage.setItem("cities" + localStorage.length, city);
  }
};
const renderCity = function () {
  const searchedCity = document.querySelector("#searchedCity");
  searchedCity.textContent = "";
  // Retrieve from local storage //
  for (let i = 0; i < localStorage.length; i++) {
    let savedCities = localStorage.getItem("cities" + i);
    console.log(savedCities);
    let cityEl;
    cityEl = `<button type="button" class="list-group-item list-group-item-action active">${savedCities}</button></li><br>`;
    // Append searched city //
    $("#searchedCity").prepend(cityEl);
  }
};

document.getElementById("searchBtn").onclick = function (event) {
  event.preventDefault();
  apiCurrentWeather();
  apiForecastWeather();
  saveCity();
  renderCity();
};
document.getElementById("searchedCity").onclick = function (event) {
  event.preventDefault();
  $("#city").val(event.target.textContent);
  city = $("#city").val();

  apiCurrentWeather(event);
  apiForecastWeather(event);
};

// Clearing Search History //
$("#clearBtn").on("click", function () {
  localStorage.clear();
  savedCities = [];
  $("#searched-cities").empty();
  city = "Birmingham";
  init();
});
