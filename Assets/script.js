const cityName = document.querySelector("#searchedCity");
const currentCity = "";
const lastCity = "";


var apiCurrentWeather = function (event) {
    // event.preventDefault();
    var city = document.querySelector("#city").value;
    fetch(
      `http://api.weatherapi.com/v1/current.json?key=e21bef81b61345b7935222422221709&q=London&aqi=no`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        console.log("currentweather", response);