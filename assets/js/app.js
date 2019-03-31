$(document).ready(function () {

  $("#search-results").hide();

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
  var joinHike = database.ref("join-a-hike/");
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  var usersRef = database.ref("users/");

  var username;
  var date;

  // CONNECTION LISTENER
  connectedRef.on("value", function (snapshot) {
    if (snapshot.val()) {
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    };
  });

  // NEEDED FOR JOINHIKE
  var activeHikeArr = [];

  // DATABASE REFERENCE TO PUSH ACTIVE HIKES TO PAGE ON LOAD
  joinHike.once("value", function (snap) {

    // EMPTY THE ARRAY LOCALLY TO PULL IN FROM FIREBASE
    activeHikeArr = [];
    // FOR EACH LOOPS THROUGH THE ARRAY OF DATA
    snap.forEach(function (childSnap) {
      var childData = childSnap.val();
      outOfDate(joinHike, childSnap, childData);

      if (childData.active) {
        activeHikeArr.push(childData);
      }

      // console.log(childData.date)
    });

    console.log(activeHikeArr);

    // ADDS ALL ACTIVE HIKE CARDS TO THE PAGE ONCE (REFRESH HACK)
    for (let i = 0; i < activeHikeArr.length; i++) {

      hikeID = activeHikeArr[i].hikeID;
      image = activeHikeArr[i].image;
      name = activeHikeArr[i].name;
      distance = activeHikeArr[i].distance;
      summary = activeHikeArr[i].summary;
      conditions = activeHikeArr[i].conditions;
      date = activeHikeArr[i].date

      // CREATE ACTIVE HIKES
      createHikes($("#active-hikes"), hikeID, image, name, distance, summary, conditions, date);
    };
  });

  var myHikeArr = [];

  // DATABASE REFERENCE TO PUSH MY HIKES TO PAGE ON LOAD
  usersRef.once("value", function (snap) {

    // EMPTY THE ARRAY LOCALLY TO PULL IN FROM FIREBASE
    var hikeRef = snap.child(username)
    myHikeArr = [];
    // FOR EACH LOOPS THROUGH THE ARRAY OF DATA

    hikeRef.forEach(function (childSnap) {
      var myHikeData = childSnap.val();
      outOfDate(usersRef.child(username), childSnap, myHikeData)

      if (myHikeData.active) {
        myHikeArr.push(myHikeData);
      }
    });

    console.log(myHikeArr);

    // ADDS ALL ACTIVE HIKE CARDS TO THE PAGE ONCE (REFRESH HACK)
    for (let i = 0; i < myHikeArr.length; i++) {
      // image = activeHikeArr[i].image;
      hikeID = myHikeArr[i].hikeID;
      image = myHikeArr[i].image;
      name = myHikeArr[i].name;
      distance = myHikeArr[i].distance;
      summary = myHikeArr[i].summary;
      conditions = myHikeArr[i].conditions;
      date = myHikeArr[i].date

      // CREATE ACTIVE HIKES
      createHikes($("#favorite-hikes"), hikeID, image, name, distance, summary, conditions, date);
    };
  });


  // SEARCH BUTTON LISTENER
  $("#search-results").on("click", ".hike-submit", function (e) {
    e.preventDefault();
    console.log("I've been clicked");

    var joinHikeID = parseInt($(this).attr("data-id"));
    var hikeKey = "200435031-6aa58562b036efd25371d400543a5981";
    var joinHikeQuery = `https://www.hikingproject.com/data/get-trails-by-id?ids=${joinHikeID}&key=${hikeKey}`

    $.ajax({
      url: joinHikeQuery,
      method: "GET"
    }).then(function (response) {

      var joinResult = response.trails;
      console.log(joinResult);

      var hikeIDJ = joinResult[0].id;
      var imageJ = joinResult[0].imgSmallMed;
      var nameJ = joinResult[0].name;
      var distanceJ = joinResult[0].length;
      var summaryJ = joinResult[0].summary;
      var conditionsJ = joinResult[0].conditionDetails;

      var newHike = {
        hikeID: hikeIDJ,
        image: imageJ,
        name: nameJ,
        distance: distanceJ,
        summary: summaryJ,
        conditions: conditionsJ,
        date: date,
        // ALLOWS US TO DELETE IT ON A SWITCH FLIP TO FALSE
        // KEEP A LISTENER FOR THIS ACTIVE AND CHANGE WHEN FLIPPED
        active: true
        // BOOM 
        // database.ref(this/active).set(false) ETC
        // ANOTHER LATE NIGHT THOUGHT
      }
      console.log(newHike);

      // var x = database.ref().child("join-a-hike/")
      database.ref(`join-a-hike/`).push(newHike);
      database.ref(`users/${username}`).push(newHike);
      console.log(username + " username on push")
      // thought for presentation: make some fake accounts and fill with fake data
    });
    // appends the chosen hike to the favorites page and to the current hikes page
    // save to the database
  });

  // API calls
  var citySearch;

  function masterAPI() {

    // GEOCODER QUERY AND VARIABLE BUILDER
    console.log(citySearch);

    var splitCity = citySearch.split(" ");
    var geoCity = splitCity.join("+");
    // var geoCity = "Salt+Lake+City"
    var geoKey = "AIzaSyCRZmQJcBVO85oD5CSKZSc80BAtfvqD9HU";
    var geoQuery = `https://maps.googleapis.com/maps/api/geocode/json?address=${geoCity},+UT&key=${geoKey}`;

    // AJAX CALL FOR GEOCODER
    $.ajax({
      url: geoQuery,
      method: "GET"
    }).then(function (response) {

      var geoResult = response.results;
      console.log(geoResult);

      // GRAB THE LATITUDE AND LONGITUDE
      var cityLat = geoResult[0].geometry.location.lat;
      var cityLon = geoResult[0].geometry.location.lng;
      console.log(cityLat);
      console.log(cityLon);

      // HIKE PROJECT API KEY AND QUERY BUILDER
      var hikeKey = "200435031-6aa58562b036efd25371d400543a5981";
      var hikeQuery = `https://www.hikingproject.com/data/get-trails?lat=${cityLat}&lon=${cityLon}&key=${hikeKey}`;

      // AJAX CALL FOR THE HIKE PROJECT
      $.ajax({
        url: hikeQuery,
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
          var conditions = hikeResult[i].conditionDetails;
          var hikeID = hikeResult[i].id;

          // FUNCTION TO CREATE DIV IS CALLED
          createHikes($("#search-results"), hikeID, image, name, distance, summary, conditions);
        }
      })
    });
  };

  // ON CLICK LISTENER FOR 'SEARCH'
  $("#search-hike").on("click", function (e) {
    citySearch = $("#city-name").val().trim();
    $("#search-results").show();
    e.preventDefault();
    masterAPI();
    var hikeDate = $("#hike-date").val().trim();
    var hikeTime = $("#hike-time").val().trim();
    date = `${hikeDate} ${hikeTime}`
  });

  // FUNCTION TO DYNAMICALLY CREATE THE HIKES
  function createHikes(hook, hikeID, image, name, distance, summary, conditions, date) {

    // card
    var card = $("<div>").addClass("card").attr("hike-data", hikeID) // CREATES UNIQUE ID FOR THE HIKE

    var imgDiv = $("<div>").addClass("card-image");
    var img = $("<img>").addClass("result-img").attr("src", image).attr("alt", image);
    var btn = $("<a>").addClass("btn-floating halfway-fab waves-effect waves-light teal hike-submit").attr("data-id", hikeID);
    var icon = $("<i>").addClass("material-icons").text("add");
    var add = btn.append(icon);

    imgDiv.append(img, add);

    var cardContent = $("<div>").addClass("card-content");
    var day = $("<p>").addClass("date").text(date);
    var title = $("<span>").addClass("card-title result-name").text(name);
    var sum = $("<p>").addClass("result-summery").text(summary);

    cardContent.append(day, title, sum);

    var cardFooter = $("<div>").addClass("card-action");
    var cond = $("<p>").addClass("result-conditions").text(conditions);
    var dist = $("<p>").addClass("result-distance").text(`${distance} Miles`);

    cardFooter.append(cond, dist);
    card.append(imgDiv, cardContent, cardFooter);

    $(hook).append(card);
  };

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
    const username = $("#regname").val().trim();
    const email = $("#regemail").val().trim();
    const password = $("#regpass").val().trim();

    // user registration
    auth.createUserWithEmailAndPassword(email, password).then(function (credentials) {

      auth.currentUser.updateProfile({
        displayName: username
      });

      console.log(credentials);
    });

    // RESETS THE INPUTS
    $("#regname, #regemail, #regpass").val("");
  });

  $("#logout").on("click", function (e) {
    e.stopPropagation();

    auth.signOut().then(function () {
      console.log("logged out");
    }).catch(function (error) {
      console.log(error);
    });
  });

  auth.onAuthStateChanged(function (user) {
    // console.log(user);
    if (user) {
      username = user.displayName;
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

  var outOfDate = function (ref, data, val) {
    var expires = moment();
    var check = moment(val.date, "MMMM Do YYYY, h:mm a");

    if (expires > check) {
      // console.log(val.name + " out of date");
      ref.child(data.key).update({ active: false });
    }
    return data
  }

  //--------------------------------------------------------------------------------------------
  // Possibilities to expand: Include a feature to add hike event to Google calendar 
});