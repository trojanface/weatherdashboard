regenerateHistory();

$("#searchBar").on("submit", function () {
    event.preventDefault();

    console.log($("#searchText").val());
    let cityName = $("#searchText").val();
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=2a41be6b56e8918bc7efe98c840f4638";
    $.ajax({
        url: queryURL,
        method: "GET",
        success: addToHistory(cityName),
        error: errorMessage()

    })
        
});

function errorMessage () {

}

function addToHistory(location) {
    var savedCities;
    var foundMatch = false;
    if (localStorage.getItem("prevCities") != null) {
        savedCities = JSON.parse(localStorage.getItem("prevCities"));
        console.log(savedCities.length);
        for (var i = 0; i < savedCities.length; i++) {//check for duplicates
            if (location == savedCities[i]) {
                var holdingCity = savedCities[i];
                savedCities.splice(i,1); 
                savedCities.unshift(holdingCity);
                foundMatch = true;
            }
        }
        if (foundMatch === false) {
            //add location into the array.
            savedCities.unshift(location);
        }
        localStorage.setItem("prevCities", JSON.stringify(savedCities));
        console.log(savedCities);
    } else {
        savedCities = [location];
        localStorage.setItem("prevCities", JSON.stringify(savedCities));
    }
     regenerateHistory(savedCities);
}

function regenerateHistory(loadArray) {
    $("#searchHistory").empty();
    if (localStorage.getItem("prevCities") !== null) {
        if (loadArray == null) {
            loadArray = JSON.parse(localStorage.getItem("prevCities"));
        }
        for (var i = 0; i < loadArray.length; i++) {
            let newRow = $("<div class='row'>");
            let newCol = $("<div class='col-md-12'>");
            let newButton = $("<button class='btn btn-primary mb-2'>" + loadArray[i] + "</button>");
                        $("#searchHistory").append(newRow);
            $(newRow).append(newCol);
            $(newCol).append(newButton);
        }
    } else {
        console.log("There was a load error");
    }


}