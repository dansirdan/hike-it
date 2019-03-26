$(document).ready(function () {
  M.AutoInit();
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
  // var chatData = database.ref("/chat/");
  // var connectionsRef = database.ref("/connections");
  // var connectedRef = database.ref(".info/connected");

  // LISTENERS FOR FIREBASE
  // 1. client connection changes
  // 
  // 2. disconnection events
  // 
  // 3. chat snapshot
  // 
  // 4. local data snapshot at page load and other value changes



  // GOOGLE API INFORMATION
  var GEOcity;
  var GEOkey = "AIzaSyCRZmQJcBVO85oD5CSKZSc80BAtfvqD9HU";
  var GEOquery = `https://maps.googleapis.com/maps/api/geocode/json?address=${GEOcity}&key=${GEOkey}`;

  $.ajax({
    url: GEOquery,
    method: "GET"
  }).then(function (response) {
    var GEOresult = response.data;
    console.log(GEOresult);
    cityLat = GEOresult.geometry.location.lat;
    cityLon = GEOresult.geometry.location.lng;
  });

  // HIKEPROJECT API INFORMATION
  var cityLat;
  var cityLon;
  var HIKEkey = "";
  var HIKEquery = `https://www.hikingproject.com/data/get-trails?lat=${cityLat}&lon=${cityLon}&key=${HIKEkey}`;

  $.ajax({
    url: HIKEquery,
    method: "GET"
  }).then(function (response) {
    var hikeResult = response.data;
    console.log(hikeResult);

    for (let i = 0; i < 10; i++) {
      var img = $("<img>");
      img.addClass("src", hikeResult[i].imgMedium);



    }

  })

  // REQUIREMENTS REMINDER: 2 new technologies
  //      (1) Materialize: Dates-> Under Pickers
  //      (2) Google Fonts (for making it pretty :) )

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


  // })

  // Form for searching for hike: 
  // Enter:
  //      Zipcode 
  //      Date
  //      maxDistance
  //      Sort by quality or distance - toggle 
  //          (TODO: How does this actually work? Should this feature be included in initial form or results?)
  //              (perhaps it could be a checkbox?)
  //      minLength
  //      minStars
  //      
  // 

  // Select on-click
  //      api call 
  // variables from form: zip, date, distance, (sort?), minlength, stars
  // include method(s) for: conditions, 
  // variables for weatherAPI: zip && date
  // variables for hikingAPI: distance, (sort?), minlength, stars
  // var apiKEY = ????
  // var queryURL = https://www.hikingproject.com/data/get-trails?

  // 




  // --------------------------------------------------------------------------------------------
  // Possibilities to expand: Include a feature to add hike event to Google calendar 
});