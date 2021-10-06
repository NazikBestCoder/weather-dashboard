var cityInput = $("input");
var searchBtn = $(".search-button");
var pastSearches = $(".past-searches");
searchBtn.on("click", saveInput);
cityInput.on("keydown", saveInputOnEnter);

// Loads past searches from local storage 
// and adds them to the array used in saveInput() and saveInputOnEnter()
var savedCities = [getPastSearches()];
function saveInput() {
    savedCities.push(cityInput.val().toLowerCase().trim());
    localStorage.setItem("cities", savedCities)
    getWeatherFromSearch(cityInput.val().toLowerCase().trim());
    createButtons();
    cityInput.val("") 
}
function saveInputOnEnter(e) {
    var key = enter.key;
    if (key === "Enter") {
        savedCities.push(cityInput.val().toLowerCase().trim());
        localStorage.setItem("cities", savedCities)
        getWeatherFromSearch(cityInput.val().toLowerCase().trim());
        createButtons();
        cityInput.val("")
    }
}

// Past searches are generated as past citybuttons
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
    var cityButton = $(pastCity)
    cityButton.on("click", getWeatherFromButton)
}


//   This Weather Forecast function shows when you
//    tap on past city buttons
var data;
var APIKey ="f178079ecb3e9f51706699da213503d1"  
function getWeatherFromButton() {
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

