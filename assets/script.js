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