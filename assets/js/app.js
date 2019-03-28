M.AutoInit();
//
// FIREBASE CONFIG

var config = {
  apiKey: "AIzaSyD6vRPaTQwhxm4Zs-oa7Rw8eyS2mnnCR84",
  authDomain: "hikeit-34330.firebaseapp.com",
  databaseURL: "https://hikeit-34330.firebaseio.com",
  projectId: "hikeit-34330",
  storageBucket: "",
  messagingSenderId: "956706165596"
};
firebase.initializeApp(config);

// DATABASE VARIABLES
var database = firebase.database();
var auth = firebase.auth();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

// CONNECTION LISTENER
connectedRef.on("value", function (snapshot) {
  if (snapshot.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  };
});

// API calls
function masterAPI() {

  // GEOCODER QUERY AND VARIABLE BUILDER
  var GEOcity = $("#city-name");
  var GEOkey = "AIzaSyCRZmQJcBVO85oD5CSKZSc80BAtfvqD9HU";
  var GEOquery = `https://maps.googleapis.com/maps/api/geocode/json?address=${GEOcity},+UT&key=${GEOkey}`;

  // AJAX CALL FOR GEOCODER
  $.ajax({
    url: GEOquery,
    method: "GET"
  }).then(function (response) {

    var GEOresult = response.results;
    console.log(GEOresult);

    // GRAB THE LATITUDE AND LONGITUDE
    var cityLat = GEOresult[0].geometry.location.lat;
    var cityLon = GEOresult[0].geometry.location.lng;
    console.log(cityLat);
    console.log(cityLon);

    // HIKE PROJECT API KEY AND QUERY BUILDER
    var HIKEkey = "200435031-6aa58562b036efd25371d400543a5981";
    var HIKEquery = `https://www.hikingproject.com/data/get-trails?lat=${cityLat}&lon=${cityLon}&key=${HIKEkey}`;

    // AJAX CALL FOR THE HIKE PROJECT
    $.ajax({
      url: HIKEquery,
      method: "GET"
    }).then(function (response) {

      var hikeResult = response.trails;
      console.log(hikeResult);

      // FOR LOOP -- DYNAMICALLY CREATE 10 COLLAPSEABLE DIVS WITH THE HIK INFORMATION
      for (let i = 0; i < 10; i++) {
        var image = hikeResult[i].imgSmallMed;
        var name = hikeResult[i].name;
        var distance = hikeResult[i].length;
        var summary = hikeResult[i].summary;
        var conditions = hikeResult[i].conditionDetails

        // FUNCTION TO CREATE DIV IS CALLED
        createHikes(image, name, distance, summary, conditions);

      }
    })
  });
};

// ON CLICK LISTENER FOR 'SEARCH'
$("#search-hike").on("click", function (e) {
  preventDefault(e);
  masterAPI();
});

// FUNCTION TO DYNAMICALLY CREATE THE HIKES
function createHikes(image, name, distance, summary, conditions) {

  // var ul = $("<ul>")
  // ul.addClass("result collapsible expandable")

  var li = $("<li>");

  var divHeader = $("<div>");
  divHeader.addClass("row collapsible-header");

  var hikeImage = $("<img>");
  hikeImage.addClass("result-img col s3");
  hikeImage.attr("src", image);
  hikeImage.attr("alt", image);

  var hikeTitle = $("<h4>");
  hikeTitle.addClass("result-name col s6");
  hikeTitle.text(name);

  var p1 = $("<p>");
  p1.addClass("result-distance col s3");
  p1.text(`Distance: ${distance} miles`);

  var divBtn = $("<div>")
  divBtn.addClass("col s3");

  var hikeBtn = $("<button>");
  hikeBtn.addClass("btn orange accent-3")
  hikeBtn.attr("type", "submit");
  hikeBtn.attr("id", "hike-submit");
  hikeBtn.text("Add Hike");

  divBtn.append(hikeBtn);
  divHeader.append(hikeImage, hikeTitle, p1, divBtn);

  var divBody = $("<div>");
  divBody.addClass("row summery collapsible-body");

  var divSummary = $("<div>");
  divSummary.addClass("col s5");

  var p2 = $("<p>");
  p2.addClass("result-summery");
  p2.text(summary);

  var p3 = $("<p>");
  p3.text(`Conditions: ${conditions}`);

  divSummary.append(p2, p3);
  divBody.append(divSummary);

  var HikeCard = li.append(divHeader, divBody);

  $("#search-results").append(HikeCard);

  // var divWeather = $("<div>");
  // divWeather.addClass("col s4");

  // var p4 = $("<p>");
  // p4.text(WEATHER);

  // var dateOfHike; 
  // var timeOfHike

};

$("#hike-submit").on("click", function () {
  // appends the chosen hike to the favorites page and to the current hikes page
  // save to the database


})

////////////////////////////
// FORM FOR CREATING ACCOUNT

// TODO: email needs validation before passed to sign in method
// LOG IN ON CLICK
$("#login-btn").on("click", function (e) {
  e.preventDefault();
  console.log("logged in");

  // user info from inputs
  const email = $("#email").val().trim();
  const password = $("#pass").val().trim();

  // user login
  auth.signInWithEmailAndPassword(email, password).then(function (credentials) {
    console.log(credentials)

  }).catch(function (error) {
    console.log(error)
  });

  $("#email, #pass").val("");
});

// CREATE ACCOUNT ON CLICK
$("#reg-btn").on("click", function (e) {
  e.preventDefault();
  console.log("registered");

  // user info from inputs
  const email = $("#regemail").val().trim();
  const password = $("#regpass").val().trim();
  const passConfirm = $("#reregpass").val().trim();

  // user registration
  auth.createUserWithEmailAndPassword(email, password).then(function (credentials) {
    console.log(credentials)

  }).catch(function (error) {
    console.log(error)
  });

  // if (password === passConfirm) {
  //   auth.createUserWithEmailAndPassword(email, password).then(function (credentials) {
  //     console.log(credentials)

  //   }).catch(function (error) {
  //     console.log(error)
  //   });

  $("#regemail, #regpass, reregpass").val("");

});

auth.onAuthStateChanged(function (user) {
  console.log(user);
  if (user) {
    $(".logged-in").show();
    $(".logged-out").hide();
  } else {
    console.log("not logged in")
    $(".logged-in").hide();
    $(".logged-out").show();
  }
});

$("#logout").on("click", function (e) {
  e.stopPropagation();

  auth.signOut().then(function () {
    console.log("logged out");
  }).catch(function (error) {
    console.log(error);
  });
});

// --------------------------------------------------------------------------------------------
// Possibilities to expand: Include a feature to add hike event to Google calendar 