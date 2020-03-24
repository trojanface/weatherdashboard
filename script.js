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
});
