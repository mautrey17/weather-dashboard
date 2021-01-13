//API Calls
var city;


function getWeather() {
    city = "raleigh";
    var currentWeatherQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7";
    
    
    
    $.get(currentWeatherQuery).then(function(response){
        console.log(response);

        //create location vars for other calls
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //create HTML elements
        var cityDisplay = $("<h2>").text(response.name + " " + dayjs().format("MM/DD/YYYY") + " picHere")
        var iconSpan = $("<span>")
        var currentTemp = $("<p>").text("Tempurature: " + response.main.temp);
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWind = $("<p>").text("Windspeed: " + response.wind.speed + " MPH");
        var currentUV;
        


        

        var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7"

        $.get(uvQuery).then(function(response2){
            
            console.log(response2)
            var uv = response2.value
            console.log(uv)
            currentUV = $("<p>").text("UV Index: " + uv);
            $(".current-weather").append(cityDisplay, currentTemp, currentHumidity, currentWind, currentUV)
        })
        
        
        // console.log(uv)


        //append to document
    
    })
    
}




getWeather()