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
