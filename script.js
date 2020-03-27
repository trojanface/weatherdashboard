regenerateHistory();

$("#searchBar").on("submit", function () {
    event.preventDefault();
getWeatherData($("#searchText").val());
    
});

$("#searchHistory").on("click", ".historyButton", function () {
    console.log($(this).attr("data-value"));
   getWeatherData($(this).attr("data-value"));
});

function getWeatherData (searchCity) {
    let cityName = searchCity;
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=2a41be6b56e8918bc7efe98c840f4638";
    $.ajax({
        url: queryURL,
        method: "GET",
        success: function (response) {
            console.log(response);
            addToHistory(cityName, response);
        },
        error: function () {
            console.log("Could not find location - OpenApi");
        }

    })

}

function getUVIndex(locationData) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader('x-access-token', '663335dfc52559aebce59235c9106df9');
        },
        url: 'https://api.openuv.io/api/v1/uv?lat=' + locationData.coord.lat + '&lng=' + locationData.coord.lon,
        success: function (uvData) {
            if (uvData.result.uv < 3) {
                var uvClass = "lowUV";
            } else {
                if (uvData.result.uv < 6) {
                    uvClass = "medUV";
                } else {
                    uvClass = "highUV";
                }
            }
            var uvSpan = $("<span class='" + uvClass + "'>" + uvData.result.uv + "</span>")
            $("#cityUV").text("UV Index: ");
            $("#cityUV").append(uvSpan);
        },
        error: function (uvData) {
            //console.log(uvData);
            console.log("There was an error - UVApi - "+uvData.responseText);
        }
    })
}

function addToHistory(location, recievedData) {
    //Updates the City Details
    $("#cityName").text(recievedData.name + " (" + moment().format("dddd") + ", " + moment().format("MMMM Do") + ")");
    var weatherIcon = $("<img src='https://openweathermap.org/img/wn/" + recievedData.weather[0].icon + ".png'>");
    $("#cityName").append(weatherIcon);
    $("#cityTemp").text("Temperature: " + (recievedData.main.temp - 273.15).toFixed(0) + "°");
    $("#cityHumid").text("Humidity: " + recievedData.main.humidity);
    $("#cityWind").text("Wind Speed: " + recievedData.wind.speed);
    getUVIndex(recievedData);


    //Updates the History
    var savedCities;
    var foundMatch = false;
    if (localStorage.getItem("prevCities") != null) {
        savedCities = JSON.parse(localStorage.getItem("prevCities"));
        console.log(savedCities.length);
        for (var i = 0; i < savedCities.length; i++) {//check for duplicates
            if (location == savedCities[i]) {
                var holdingCity = savedCities[i];
                savedCities.splice(i, 1);
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
            let newButton = $("<button class='historyButton btn btn-primary mb-2' data-value=\""+loadArray[i]+"\">" + loadArray[i] + "</button>");
            $("#searchHistory").append(newRow);
            $(newRow).append(newCol);
            $(newCol).append(newButton);
        }
    } else {
        console.log("There was a load error");
    }


}