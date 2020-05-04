//Establish todays date with Moment JS and store in a variable
var todayDate = moment().format("M D YYYY");
var formatDate = todayDate.replace(/ /g, "/");

//Creates array of searched cities from local storage
var cities = [];
var storedCities = JSON.parse(localStorage.getItem("cities"));
if (storedCities !== null) {
  cities = storedCities;
}

//Loops through existing array of city names in local storage and appends on click even
for (var i = 0; i < cities.length; i++) {
  var newLi = $("<li>").addClass("list-group-item itemStyle");
  var newBtn = $("<button>").addClass("buttonStyle");
  newBtn.text(cities[i]).attr("style", "text-transform:uppercase;");
  newLi.append(newBtn);
  $(".listStyle").append(newLi);

  //This block of code runs the same function as the on click, on line 170 but targets the newly created buttons from local storage
  newBtn.on("click", function (event) {
    $(".displayQuery").attr("style", "display:unset");

    var storageSearch = event.target.innerHTML;
    //establish search query for current and 5-day forecast
    var currentQuery =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      storageSearch +
      "&appid=4d677b30939e25627e4be2728809246c";

    var forecastQuery =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      storageSearch +
      "&appid=4d677b30939e25627e4be2728809246c";

    //AJAX method retrieves current weather data and stores in Jumbotron li elements
    $.ajax({
      url: currentQuery,
      method: "GET",
    }).then(function (response) {
      var city = response.name;
      //Get icon from object and concatenate with URL to provide source for image element.
      var icon = response.weather[0].icon;
      var imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      $("#image").attr("src", imgURL);
      var currentTemp = response.main.temp;
      var tempF = ((currentTemp - 273.15) * 1.8 + 32).toFixed(0);
      var currentHumidity = response.main.humidity;
      var currentWind = response.wind.speed;
      //find coordinates for use in current UV data call
      var currentLon = response.coord.lon;
      var currentLat = response.coord.lat;
      //generate HTML elements and store current data
      $(".cityName").text(city + "  " + "(" + formatDate + ")");
      $("#currentTemp").text("Temperature: " + tempF + "°F");
      $("#currentHumidity").text("Humidity: " + currentHumidity + "%");
      $("#currentWind").text("Wind Speed " + currentWind + "MPH");

      //Declare function inside other AJAX method that takes coordinates and inputs them into new AJAX method to determine UV index
      function findUV() {
        var UVQuery =
          "http://api.openweathermap.org/data/2.5/uvi?appid=4d677b30939e25627e4be2728809246c&lat=" +
          currentLat +
          "&lon=" +
          currentLon;

        $.ajax({
          url: UVQuery,
          method: "GET",
        }).then(function (response) {
          var uvRating = response.value;

          var uvEl = $("#currentUV").html("UV Index: " + uvRating);
          //Sorts through UV rating and assigns a class that will style UV element based on UV index rating
          if (uvRating > 7) {
            uvEl.removeClass("yellow");
            uvEl.removeClass("green");
            uvEl.addClass("red");
          } else if (uvRating < 3) {
            uvEl.removeClass("red");
            uvEl.removeClass("yellow");
            uvEl.toggleClass("green");
          } else {
            uvEl.removeClass("red");
            uvEl.removeClass("green");
            uvEl.toggleClass("yellow");
          }
        });
      }
      findUV();
    });

    $.ajax({
      url: forecastQuery,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var daysOfWeek = [
        "placeholder",
        "#dayOne",
        "#dayTwo",
        "#dayThree",
        "#dayFour",
        "#dayFive",
      ];
      //Display each five day forecast card a date
      for (var i = 1; i < 6; i++) {
        var today = moment();
        var tomorrow = today.add("days", i);
        var tomorrowFormat = moment(tomorrow).format("M D YYYY");
        var tmrwFormatFinish = tomorrowFormat.replace(/ /g, "/");
        $(daysOfWeek[i]).text(tmrwFormatFinish);
      }
      //Pulls all the appropriate data for the five day forecast and displays
      var iconDay1 = response.list[0].weather[0].icon;
      var firstImage =
        "http://openweathermap.org/img/wn/" + iconDay1 + "@2x.png";
      $("#imageOne").attr("src", firstImage);
      var tempDay1 = response.list[0].main.temp;
      var tempF1 = ((tempDay1 - 273.15) * 1.8 + 32).toFixed(1);
      $("#cardOneA").text("Temp: " + tempF1 + "°F");
      var humidityDay1 = response.list[0].main.humidity;
      $("#cardOneB").text("Humidity: " + humidityDay1 + "%");

      var iconDay2 = response.list[7].weather[0].icon;
      var secondImage =
        "http://openweathermap.org/img/wn/" + iconDay2 + "@2x.png";
      $("#imageTwo").attr("src", secondImage);
      var tempDay2 = response.list[7].main.temp;
      var tempF2 = ((tempDay2 - 273.15) * 1.8 + 32).toFixed(1);
      $("#cardTwoA").text("Temp: " + tempF2 + "°F");
      var humidityDay2 = response.list[7].main.humidity;
      $("#cardTwoB").text("Humidity: " + humidityDay2 + "%");

      var iconDay3 = response.list[15].weather[0].icon;
      var thirdImage =
        "http://openweathermap.org/img/wn/" + iconDay3 + "@2x.png";
      $("#imageThree").attr("src", thirdImage);
      var tempDay3 = response.list[15].main.temp;
      var tempF3 = ((tempDay3 - 273.15) * 1.8 + 32).toFixed(1);
      $("#cardThreeA").text("Temp: " + tempF3 + "°F");
      var humidityDay3 = response.list[15].main.humidity;
      $("#cardThreeB").text("Humidity: " + humidityDay3 + "%");

      var iconDay4 = response.list[23].weather[0].icon;
      var fourthImage =
        "http://openweathermap.org/img/wn/" + iconDay4 + "@2x.png";
      $("#imageFour").attr("src", fourthImage);
      var tempDay4 = response.list[23].main.temp;
      var tempF4 = ((tempDay4 - 273.15) * 1.8 + 32).toFixed(1);
      $("#cardFourA").text("Temp: " + tempF4 + "°F");
      var humidityDay4 = response.list[23].main.humidity;
      $("#cardFourB").text("Humidity: " + humidityDay4 + "%");

      var iconDay5 = response.list[31].weather[0].icon;
      var fifthImage =
        "http://openweathermap.org/img/wn/" + iconDay5 + "@2x.png";
      $("#imageFive").attr("src", fifthImage);
      var tempDay5 = response.list[31].main.temp;
      var tempF5 = ((tempDay5 - 273.15) * 1.8 + 32).toFixed(1);
      $("#cardFiveA").text("Temp: " + tempF5 + "°F");
      var humidityDay5 = response.list[31].main.humidity;
      $("#cardFiveB").text("Humidity: " + humidityDay5 + "%");
    });
  });
}

//User searches city with search button click, calls all AJAX functions
$(".btn").on("click", function () {
  $(".displayQuery").attr("style", "display:unset");

  //Takes user city name input and stores in variable
  var userSearch = $(".userSearch").val();
  var cityName = userSearch;
  cities.push(userSearch);

  localStorage.setItem("cities", JSON.stringify(cities));

  //Creates new search history element immediately upon search button click
  var newLi = $("<li>").addClass("list-group-item itemStyle");
  var newBtn = $("<button>").addClass("buttonStyle");
  newBtn.text(userSearch).attr("style", "text-transform:uppercase;");
  newLi.append(newBtn);
  $(".listStyle").append(newLi);
  newBtn.on("click", function (event) {});

  //establish search query for current and 5-day forecast
  var currentQuery =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=4d677b30939e25627e4be2728809246c";

  var forecastQuery =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=4d677b30939e25627e4be2728809246c";

  //AJAX method retrieves current weather data and stores in Jumbotron li elements
  $.ajax({
    url: currentQuery,
    method: "GET",
  }).then(function (response) {
    var city = response.name;
    //Get icon from object and concatenate with URL to provide source for image element.
    var icon = response.weather[0].icon;
    var imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    $("#image").attr("src", imgURL);
    var currentTemp = response.main.temp;
    var tempF = ((currentTemp - 273.15) * 1.8 + 32).toFixed(0);
    var currentHumidity = response.main.humidity;
    var currentWind = response.wind.speed;
    //find coordinates for use in current UV data call
    var currentLon = response.coord.lon;
    var currentLat = response.coord.lat;
    //generate HTML elements and store current data
    $(".cityName").text(city + "  " + "(" + formatDate + ")");
    $("#currentTemp").text("Temperature: " + tempF + "°F");
    $("#currentHumidity").text("Humidity: " + currentHumidity + "%");
    $("#currentWind").text("Wind Speed " + currentWind + "MPH");

    //declare function inside other AJAX method that takes coordinates and inputs them into new AJAX method to determine UV index
    function findUV() {
      var UVQuery =
        "http://api.openweathermap.org/data/2.5/uvi?appid=4d677b30939e25627e4be2728809246c&lat=" +
        currentLat +
        "&lon=" +
        currentLon;

      $.ajax({
        url: UVQuery,
        method: "GET",
      }).then(function (response) {
        var uvRating = response.value;

        var uvEl = $("#currentUV").html("UV Index: " + uvRating);

        if (uvRating > 7) {
          uvEl.removeClass("yellow");
          uvEl.removeClass("green");
          uvEl.addClass("red");
        } else if (uvRating < 3) {
          uvEl.removeClass("red");
          uvEl.removeClass("yellow");
          uvEl.toggleClass("green");
        } else {
          uvEl.removeClass("red");
          uvEl.removeClass("green");
          uvEl.toggleClass("yellow");
        }
      });
    }
    findUV();
  });

  $.ajax({
    url: forecastQuery,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var daysOfWeek = [
      "placeholder",
      "#dayOne",
      "#dayTwo",
      "#dayThree",
      "#dayFour",
      "#dayFive",
    ];

    for (var i = 1; i < 6; i++) {
      var today = moment();
      var tomorrow = today.add("days", i);
      var tomorrowFormat = moment(tomorrow).format("M D YYYY");
      var tmrwFormatFinish = tomorrowFormat.replace(/ /g, "/");
      $(daysOfWeek[i]).text(tmrwFormatFinish);
    }

    var iconDay1 = response.list[0].weather[0].icon;
    var firstImage = "http://openweathermap.org/img/wn/" + iconDay1 + "@2x.png";
    $("#imageOne").attr("src", firstImage);
    var tempDay1 = response.list[0].main.temp;
    var tempF1 = ((tempDay1 - 273.15) * 1.8 + 32).toFixed(1);
    $("#cardOneA").text("Temp: " + tempF1 + "°F");
    var humidityDay1 = response.list[0].main.humidity;
    $("#cardOneB").text("Humidity: " + humidityDay1 + "%");

    var iconDay2 = response.list[7].weather[0].icon;
    var secondImage =
      "http://openweathermap.org/img/wn/" + iconDay2 + "@2x.png";
    $("#imageTwo").attr("src", secondImage);
    var tempDay2 = response.list[7].main.temp;
    var tempF2 = ((tempDay2 - 273.15) * 1.8 + 32).toFixed(1);
    $("#cardTwoA").text("Temp: " + tempF2 + "°F");
    var humidityDay2 = response.list[7].main.humidity;
    $("#cardTwoB").text("Humidity: " + humidityDay2 + "%");

    var iconDay3 = response.list[15].weather[0].icon;
    var thirdImage = "http://openweathermap.org/img/wn/" + iconDay3 + "@2x.png";
    $("#imageThree").attr("src", thirdImage);
    var tempDay3 = response.list[15].main.temp;
    var tempF3 = ((tempDay3 - 273.15) * 1.8 + 32).toFixed(1);
    $("#cardThreeA").text("Temp: " + tempF3 + "°F");
    var humidityDay3 = response.list[15].main.humidity;
    $("#cardThreeB").text("Humidity: " + humidityDay3 + "%");

    var iconDay4 = response.list[23].weather[0].icon;
    var fourthImage =
      "http://openweathermap.org/img/wn/" + iconDay4 + "@2x.png";
    $("#imageFour").attr("src", fourthImage);
    var tempDay4 = response.list[23].main.temp;
    var tempF4 = ((tempDay4 - 273.15) * 1.8 + 32).toFixed(1);
    $("#cardFourA").text("Temp: " + tempF4 + "°F");
    var humidityDay4 = response.list[23].main.humidity;
    $("#cardFourB").text("Humidity: " + humidityDay4 + "%");

    var iconDay5 = response.list[31].weather[0].icon;
    var fifthImage = "http://openweathermap.org/img/wn/" + iconDay5 + "@2x.png";
    $("#imageFive").attr("src", fifthImage);
    var tempDay5 = response.list[31].main.temp;
    var tempF5 = ((tempDay5 - 273.15) * 1.8 + 32).toFixed(1);
    $("#cardFiveA").text("Temp: " + tempF5 + "°F");
    var humidityDay5 = response.list[31].main.humidity;
    $("#cardFiveB").text("Humidity: " + humidityDay5 + "%");
  });
});

//Allows user to hit enter as well as click the search button to trigger the AJAX function
$(".userSearch").on("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $(".btn").click();
  }
});
