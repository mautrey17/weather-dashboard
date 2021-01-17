//Global variables
var city;
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var show = false;
var prevCity;
var pushCity = true;
var lastSearch = JSON.parse(localStorage.getItem("lastCity"));

//Function to check storage and display last searched city
function checkStorage(){
    if (cities.length > 0){
        city = lastSearch;
        getWeather();
        getForecast();
        addBtn();

        //do not re-add city to search history
        // var doubleEntry = cities.length - 1;
        // console.log(doubleEntry)
        // cities.splice()
    }
}
checkStorage();

function checkForDouble(){
    for(var i=0; i<cities.length; i++){
        var cityCheck = city.toLowerCase();
        var cityCheckExist = cities[i].toLowerCase();
        console.log(cityCheckExist);
        console.log(cityCheck);
        if(cityCheckExist === cityCheck){
            pushCity = false;
            console.log("Do not push");
        }
        else{
            console.log("do push")
            
        }
        console.log(pushCity);
    }
    console.log(cities.length)
    // cities.push(city);
    
    if(pushCity || (cities.length < 1)) {
        console.log("its working")
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    console.log("function running")
    pushCity = true;
}




//Function to call current weather
function getWeather() {
    //AJAX query and variable for icon query
    var currentWeatherQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7&units=imperial";
    var weatherIcon;
    
    //Clear previous entry
    $(".current-weather").empty();
    
    //AJAX call to API
    $.get(currentWeatherQuery).then(function(response){
    
        //get icon data and create query
        weatherIcon = response.weather[0].icon;
        var imgQuery = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

        //create location vars for other calls
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //create HTML elements
        var cityDisplay = $("<h2>").text(response.name + " " + dayjs().format("MM/DD/YYYY")).addClass("card-title")
        var iconSpan = $("<span>");
        var currentImg = $("<img>").attr("src", imgQuery)
        var currentTemp = $("<p>").text("Tempurature: " + response.main.temp + " F");
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWind = $("<p>").text("Windspeed: " + response.wind.speed + " MPH");
        var currentUV;

        //Add icon to title
        $(iconSpan).append(currentImg);
        $(cityDisplay).append(iconSpan)

        //save city to console
        // prevCity = JSON.stringify(city);
        console.log(city);
        
        //check if city is already saved
        
        console.log(pushCity)
        

        //UV Query and AJAX
        var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7"

        $.get(uvQuery).then(function(response2){
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

            //Format UV data
            $(uvSpan).text(uv);
            currentUV = $("<p>").text("UV Index: ").append(uvSpan);

            //Append all elements to document
            $(".current-weather").append(cityDisplay, currentTemp, currentHumidity, currentWind, currentUV)
            
            //check for previous entry
            checkForDouble();
            
            // cities.push("test")
            console.log(cities);

            localStorage.setItem("lastCity", JSON.stringify(city));
            
        })    
    })   
}

//Function to get forecast data and display
function getForecast(){
    var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=56ecce8b9a89bb783f4aaec43e6b84a7&units=imperial"
    var dayCount = 1;
    show = true;
    
    //Clear previous forecast cards
    $(".forecast-cards").empty();
    
    //AJAX call
    $.get(forecastQuery).then(function(response){
        //For loop to get the following day's weather
        for(var i=0; i<response.list.length; i+=8){
            var weatherIcon = response.list[i].weather[0].icon;
            var imgQuery = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
            
            //Format date
            var newDay = dayjs().add(dayCount, 'day');
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

            //Append new elements to document
            $(cardBody).append(dateFuture, iconFuture, tempFuture, humidityFuture);
            $(newCard).append(cardBody);
            $(newCol).append(newCard);
            $(".forecast-cards").append(newCol);
            
        }

        //Display hidden elements if they have been set to be turned on
        if(show){
            $(".new-test").removeClass("hide");
            $(".current-weather").removeClass("hide");
        }
    })
}

//event handler for search button
$("#search-button").on("click", function(event){
    event.preventDefault();
    city = $("#city-input").val();

    //run weather functions
    getWeather();
    getForecast();
    addBtn();
})

//Function to create button when cities are searched
function addBtn(){
    var cityName = city;

    //add html elements
    var newLi = $("<li>").addClass("old-city list-group-item").attr("data-city", cityName).text(cityName)

    //append to Doc
    $(".city-history").append(newLi);

}

//Function to display previously searched cities when clicked in the history
$(".city-history").on("click", "li", function(event){
    // event.stopPropagation();
    // event.preventDefault();

    city = $(this).attr("data-city");
    // console.log($(this).attr("data-city"));
    console.log("click", city);
    
    // $(".forecast-cards").empty();  
    // $(".current-weather").empty(); 

    getWeather();
    getForecast();
    // console.log("help")
});

