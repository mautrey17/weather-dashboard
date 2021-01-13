//API Calls
var city;
var show = false

//Function to call current weather
function getWeather() {
    // city = "raleigh";
    var currentWeatherQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7&units=imperial";
    
    $(".current-weather").empty();
    
    $.get(currentWeatherQuery).then(function(response){
        console.log(response);

        //create location vars for other calls
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //create HTML elements
        var cityDisplay = $("<h2>").text(response.name + " " + dayjs().format("MM/DD/YYYY") + " picHere").addClass("card-title")
        var iconSpan = $("<span>")
        var currentTemp = $("<p>").text("Tempurature: " + response.main.temp);
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWind = $("<p>").text("Windspeed: " + response.wind.speed + " MPH");
        // var iconTest = $("<img>").attr("src", response.weather[0].icon)
        var currentUV;
        
        console.log(response.weather[0].main)

        

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

function getForecast(){
    var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7&units=imperial"
    var dayCount = 1;
    show = true;
    

    $(".forecast-cards").empty();
    


    $.get(forecastQuery).then(function(response){
        // console.log(response);
        for(var i=0; i<response.list.length; i+=8){
            var check = response.list[i];
            // console.log(check);

            var newDay = dayjs().add(dayCount, 'day');
            // console.log(newDay);
            newDay = newDay.format("MM/DD/YYYY");
            dayCount += 1

            //create html holding elements
            var newCol = $("<div>").addClass("col-md-2")
            var newCard = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            

            //create data inside cards
            var dateFuture = $("<p>").text(newDay);
            var iconFuture = $("<p>").text("insert icon here");
            var tempFuture = $("<p>").text("Temperature: " + response.list[i].main.temp + " F")
            var humidityFuture = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%");

            $(cardBody).append(dateFuture, iconFuture, tempFuture, humidityFuture);
            $(newCard).append(cardBody);
            $(newCol).append(newCard);
            $(".forecast-cards").append(newCol);
            
        }

        
        // $(".day-forecast").prepend(forecastTitle);
        if(show){
            $(".new-test").removeClass("hide");
            $(".current-weather").removeClass("hide");
        }
    })
}

function addBtn(){
    var cityName = $("#city-input").val();

    //add html elements
    var newBtn = $("<button>").addClass("old-city");
    var newLi = $("<li>").addClass("list-group-item").attr("data-city", cityName).text(cityName);

    //append to Doc
    $(newBtn).append(newLi);
    $(".city-history").append(newBtn);
}

$("#search-button").on("click", function(event){
    event.preventDefault();
    city = $("#city-input").val();

    getWeather();
    getForecast();
    addBtn();
})

$(".old-city").on("click", function(){
    // city = $(this).attr("data-city");
    // console.log($(this).attr("data-city"));
    console.log("hi")
    
    // getWeather();
    // getForecast();
})