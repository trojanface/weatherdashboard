$("#searchBar").on("submit", function () {
    event.preventDefault();

    console.log($("#searchText").val());
    let cityName = $("#searchText").val();
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=2a41be6b56e8918bc7efe98c840f4638";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
        });
    addToHistory(cityName);
});


function addToHistory(location) {
    var savedCities;
    var foundMatch = false;
    if (localStorage.getItem("prevCities") != null) {
        savedCities = JSON.parse(localStorage.getItem("prevCities"));
        console.log(savedCities.length);
        for (var i = 0; i < savedCities.length; i++) {//check for duplicates
            if (location == savedCities[i]) {
                var holdingCity = savedCities[i];
                console.log(savedCities);
                savedCities.splice(i,1); 
                console.log(savedCities);
                savedCities.unshift(holdingCity);
                console.log(savedCities);
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
        for (var i = 0; i < loadArray.length; i++) {
            let newRow = $("<div class='row'>");
            let newCol = $("<div class='col'>");
            let newButton = $("<button class='btn btn-primary mb-2'>" + loadArray[i] + "</button>");//will need to make a custome css class to set width 100%
            $("#searchHistory").append(newRow);
            $(newRow).append(newCol);
            $(newCol).append(newButton);
        }
    } else {
        console.log("There was a load error");
    }


}