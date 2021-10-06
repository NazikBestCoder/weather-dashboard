var cityInput = $("input");
var searchBtn = $(".search-button");
var pastSearches = $(".past-searches");
searchBtn.on("click", saveInput);
cityInput.on("keydown", saveInputOnEnter);
var data;
var APIKey ="f178079ecb3e9f51706699da213503d1" 


// ================================
// ====GET Weather from Search=====
// ================================

function getTodayWeatherFromSearch(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + APIKey
    fetch(url)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var newUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey
                fetch(newUrl)
                    .then(function (newResponse) {
                        return newResponse.json();
                    })
                        .then(function(newData) {
                            displayWeather(newData, city);
                        })
            })
}

// =============================
// ====CURRENT==================
// ===========WEATHER===========
// =================DISPLAY=====
// =============================
var displayCityName = $(".city-name");
var displayCityInfo = $(".city-info-list");
var displayCurrentTemp = $("#current-temp");
var displayCurrentWind = $("#current-wind");
var displayCurrentHumidity = $("#current-humidity");
var displayCurrentUVI = $("#current-uvi");
var displayCurrentWeather = $("#current-weather-icon");

function displayWeather(data, city) {
    var cityArr = city.split(" ");
    console.log("test data", data)
    for (let i = 0; i < cityArr.length; i++) {
        cityArr[i] = cityArr[i].charAt(0).toUpperCase() + cityArr[i].substr(1);
    }
    var currentTimeUnix = data.current.dt + data.timezone_offset;
    var currentDate = new Date(currentTimeUnix*1000)
    currentDate = currentDate.toLocaleDateString("en-US");
    city = cityArr.join(" ")
    var currentTemp = data.current.temp;
    var currentWindSpeed = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUVI = data.current.uvi;
    var currentWeather = data.current.weather[0].icon;
    console.log(currentWeather)  
    displayCityName.text(city + " " + currentDate)
    displayCurrentTemp.text("Temp: " + currentTemp + "°F");
    displayCurrentWind.text("Wind: " + currentWindSpeed + " MPH");
    displayCurrentHumidity.text("Humidity: " + currentHumidity);
    displayCurrentUVI.text("UV Index: " + currentUVI + "%");
    displayCurrentWeather.text("Weather: ");
    displayCurrentWeather.append(`<img src="http://openweathermap.org/img/wn/${currentWeather}@2x.png" alt="weather">`);

    
//  =================================
//  ============DISPLAY==============
//  ==========5-DAY FORECAST=========
//  =================================
    var fivedayForecastArr = data.daily;
    console.log("test data", fivedayForecastArr)
    for (let i = 1; i < 6; i++) {
        var forecastTimeUnix = fivedayForecastArr[i].dt + data.timezone_offset;
        var forecastDate = new Date(forecastTimeUnix*1000);
        var displayForecast = $("#"+i);
        forecastDate = forecastDate.toLocaleDateString("en-US");
        console.log("test data", displayForecast)
        displayForecast.siblings().text(forecastDate);
        displayForecast.children().eq(0).text("Temp: " + fivedayForecastArr[i].temp.day + "°F");
        displayForecast.children().eq(1).text("Wind: " + fivedayForecastArr[i].wind_speed + " MPH");
        displayForecast.children().eq(2).text("Humidity: " + fivedayForecastArr[i].humidity + " %");
        displayForecast.children().eq(3).text("Weather: ");
        displayForecast.children().eq(3).append(`<img src="http://openweathermap.org/img/wn/${fivedayForecastArr[i].weather[0].icon}@2x.png" alt="weather">`);
        console.log(displayForecast.children().eq(3))
    }
}
// ==================================
// ==========LOCAL STORAGE===========
// ==================================
// loads past searches from local 
// storage and adds them to the array

var savedCities = [getPastSearches()];

function saveInput() {
    savedCities.push(cityInput.val().toLowerCase().trim());
    localStorage.setItem("cities", savedCities)
    getTodayWeatherFromSearch(cityInput.val().toLowerCase().trim());
    createButtons();
    cityInput.val("") 
}

function saveInputOnEnter(e) {
    var key = e.key;
    if (key === "Enter") {
        savedCities.push(cityInput.val().toLowerCase().trim());
        localStorage.setItem("cities", savedCities)
        getTodayWeatherFromSearch(cityInput.val().toLowerCase().trim());
        createButtons();
        cityInput.val("")
    }
}

// ===========CREATE============== 
// =========PAST CITY=============
// ==========BUTTONS==============
var pastCity;
function createButtons() {
    if (pastSearches.children().text().toLowerCase().includes(cityInput.val().toLowerCase())) { 
        return;
    } else if (pastSearches.children().length > 10) {
        pastSearches.children().last().remove();
    }
    pastCity = $("<button>")
    var cityName = cityInput.val();
    var cityNameArr = cityName.split(" ");
    for (let i = 0; i < cityNameArr.length; i++) {
        cityNameArr[i] = cityNameArr[i].charAt(0).toUpperCase() + cityNameArr[i].substr(1);
    }
    cityName = cityNameArr.join(" ");
    pastCity.text(cityName);
    pastCity.attr("id", cityInput.val().toLowerCase())
    pastCity.attr("class", "btn btn-secondary")
    pastSearches.prepend(pastCity);
    var pastCityButton = $(pastCity)
    pastCityButton.on("click", getTodayWeatherFromButton)
}


// ========================================
// =========DISPLAY WEATHER================
//=======FROM PAST CITY BUTTONS============
// ========================================


function getTodayWeatherFromButton() {
    var city = $(this).attr("id");

    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + APIKey
    fetch(url)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var newUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey
                fetch(newUrl)
                    .then(function (newResponse) {
                        return newResponse.json();
                    })
                        .then(function(newData) {
                            displayWeather(newData, city);
                        })
            })
} 



// -----------------------------------
// ----------LOADING------------------
// ------------PAST-------------------
// ----------------SEARCHES-----------

function getPastSearches() {
    var getCities = localStorage.getItem("cities")
    if (getCities === null) {
        return;
    }
    var citiesArr = getCities.split(",")
    for (let i = 0; i < citiesArr.length; i++) {
        citiesArr[i] = citiesArr[i].charAt(0).toUpperCase() + citiesArr[i].substr(1);
        cityName = citiesArr.join(" ");
        pastCity = $("<button>")
        pastCity.text(citiesArr[i]);
        pastCity.attr("id", citiesArr[i])
        pastCity.attr("class", "btn btn-secondary")
        pastSearches.prepend(pastCity);
        var pastCityButton = $(pastCity)
        pastCityButton.on("click", getTodayWeatherFromButton)
        if (citiesArr[i] === "") {
            pastCity.remove();
        }
        var savedCities = [];
        savedCities = localStorage.getItem("cities")
    }
    return savedCities;
}
// ===========================
// =======Clear History=======
// ===========================
$(".clear-button").on("click", clearHistory)
function clearHistory() {
    localStorage.setItem("cities", "")
    pastSearches.children().remove();
}

