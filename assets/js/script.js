//API Calls
var city;
var show = false

//Function to call current weather
function getWeather() {
    // city = "raleigh";
    var currentWeatherQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7&units=imperial";
    var weatherIcon;
    
    
    
    $(".current-weather").empty();
    
    $.get(currentWeatherQuery).then(function(response){
        console.log(response);

        weatherIcon = response.weather[0].icon;
        var imgQuery = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

        console.log(imgQuery);

        //create location vars for other calls
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //create HTML elements
        var cityDisplay = $("<h2>").text(response.name + " " + dayjs().format("MM/DD/YYYY")).addClass("card-title")
        var iconSpan = $("<span>");
        var currentImg = $("<img>").attr("src", imgQuery)
        var currentTemp = $("<p>").text("Tempurature: " + response.main.temp);
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWind = $("<p>").text("Windspeed: " + response.wind.speed + " MPH");
        // var iconTest = $("<img>").attr("src", response.weather[0].icon)
        var currentUV;

        $(iconSpan).append(currentImg);
        $(cityDisplay).append(iconSpan)
        
        console.log(response.weather[0].main)

        

        var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7"

        $.get(uvQuery).then(function(response2){
            
            console.log(response2)
            var uv = response2.value
            var uvSpan = $("<span>").addClass("uv");

            //add uv class based on value
            if(uv<3){
                $(uvSpan).addClass("low");
            }
            else if(uv>=3 && uv<6){
                $(uvSpan).addClass("moderate");
            }
            else if(uv>=6 && uv<8){
                $(uvSpan).addClass("high");
            }
            else if(uv>=8 && uv<11){
                $(uvSpan).addClass("very-high");
            }
            else if(uv>11){
                $(uvSpan).addClass("extreme");
            }


            $(uvSpan).text(uv);
            currentUV = $("<p>").text("UV Index: ").append(uvSpan);
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
        console.log(response);
        for(var i=0; i<response.list.length; i+=8){
            var check = response.list[i];
            var weatherIcon = response.list[i].weather[0].icon;
            var imgQuery = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
            console.log(check);

            var newDay = dayjs().add(dayCount, 'day');
            // console.log(newDay);
            newDay = newDay.format("MM/DD/YYYY");
            dayCount += 1

            //create html holding elements
            var newCol = $("<div>").addClass("col-md-2")
            var newCard = $("<div>").addClass("card forecast");
            var cardBody = $("<div>").addClass("card-body");
            

            //create data inside cards
            var dateFuture = $("<p>").text(newDay);
            var iconFuture = $("<img>").attr("src", imgQuery);
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

function cityHandler(){
    city = $(this).attr("data-city");
    // console.log($(this).attr("data-city"));
    console.log(city)
    
    getWeather();
    getForecast();
}

function addBtn(){
    var cityName = $("#city-input").val();

    $(".forecast-cards").empty();  
    $(".current-weather").empty();  

    //add html elements
    var newBtn = $("<button>").addClass("old-city").attr("data-city", cityName);
    var newLi = $("<li>").addClass("list-group-item").text(cityName);

    //append to Doc
    $(newBtn).append(newLi);
    $(".city-history").append(newBtn);

    $(".old-city").on("click", cityHandler)
}

$("#search-button").on("click", function(event){
    event.preventDefault();
    city = $("#city-input").val();

    getWeather();
    getForecast();
    addBtn();
})

