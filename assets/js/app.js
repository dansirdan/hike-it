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
    activeHikeArr.push(childData);
  })

  console.log(activeHikeArr);

  // ADDS ALL ACTIVE HIKE CARDS TO THE PAGE ONCE (REFRESH HACK)
  for (let i = 0; i < activeHikeArr.length; i++) {
    image = activeHikeArr[i].image;
    hikeID = activeHikeArr[i].hikeID;
    image = activeHikeArr[i].image;
    name = activeHikeArr[i].name;
    distance = activeHikeArr[i].distance;
    summary = activeHikeArr[i].summary;
    conditions = activeHikeArr[i].conditions;
    date = activeHikeArr[i].date;
    time = activeHikeArr[i].date;

    // TEST: WORKING
    // console.log(name);

    // CREATE ACTIVE HIKES
    // createActiveHikeCard(image, name, distance, hikeID, summary, conditions);

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
      date: hikeDate,
      time: hikeTime,
      // ALLOWS US TO DELETE IT ON A SWITCH FLIP TO FALSE
      // KEEP A LISTENER FOR THIS ACTIVE AND CHANGE WHEN FLIPPED
      active: true
      // BOOM 
      // database.ref(this/active).set(false) ETC
      // ANOTHER LATE NIGHT THOUGHT
    }
    console.log(newHike);
    // var joinKey = database.ref().child("join-a-hike/")
    database.ref(`join-a-hike/`).push(newHike);
    // database.ref(THIS USER).push(newHike);
    // save to favorites
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
        createHikes(image, name, distance, hikeID, summary, conditions);

      }
    })
  });
};

var hikeDate;
var hikeTime;
// ON CLICK LISTENER FOR 'SEARCH'
$("#search-hike").on("click", function (e) {
  citySearch = $("#city-name").val().trim();
  $("#search-results").show();
  e.preventDefault();
  masterAPI();
  hikeDate = $("#hike-date").val().trim();
  hikeTime = $("#hike-time").val().trim();
  console.log(hikeDate);
  console.log(hikeTime);
});

// FUNCTION TO DYNAMICALLY CREATE THE HIKES
function createHikes(hikeID, image, name, distance, summary, conditions) {
  
  // card
  var card = $("<div>").addClass("card").attr("hike-data", hikeID) // CREATES UNIQUE ID FOR THE HIKE

  var imgDiv = $("<div>").addClass("card-image");
  var img = $("<img>").addClass("result-img").attr("src", image).attr("alt", image);
  var btn = $("<a>").addClass("btn-floating halfway-fab waves-effect waves-light teal");
  var icon = $("<i>").addClass("material-icons hike-submit").text("add");
  var add = btn.append(icon);

  imgDiv.append(img, add);

  var cardContent = $("<div>").addClass("card-content");
  var title = $("<span>").addClass("card-title result-name").text(name);
  var sum = $("<p>").addClass("result-summery").text(summary);

  cardContent.append(title, sum);

  var cardFooter = $("<div>").addClass("card-action");
  var cond = $("<p>").addClass("result-conditions").text(conditions);
  var dist = $("<p>").addClass("result-distance").text(`${distance} Miles`);

  cardFooter.append(cond, dist);
  card.append(imgDiv, cardContent, cardFooter);


  $("#search-results").append(card);

  // ***********************************************************************


  // var li = $("<li>");
  // li.attr("hike-data", hikeID)

  // var divHeader = $("<div>");
  // divHeader.addClass("row collapsible-header");

  // var hikeImage = $("<img>");
  // hikeImage.addClass("result-img col s3");
  // hikeImage.attr("src", image);
  // hikeImage.attr("alt", image);

  // var hikeTitle = $("<h4>");
  // hikeTitle.addClass("result-name col s6");
  // hikeTitle.text(name);

  // var p1 = $("<p>");
  // p1.addClass("result-distance col s3");
  // p1.text(`Distance: ${distance} miles`);

  // var divBtn = $("<div>")
  // divBtn.addClass("col s3");

  // var hikeBtn = $("<button>");
  // hikeBtn.addClass("btn orange accent-3")
  // hikeBtn.attr("type", "submit");
  // hikeBtn.attr("id", "hike-submit");
  // hikeBtn.text("Add Hike");

  // divBtn.append(hikeBtn);
  // divHeader.append(hikeImage, hikeTitle, p1, divBtn);

  // var divBody = $("<div>");
  // divBody.addClass("row summery collapsible-body");

  // var divSummary = $("<div>");
  // divSummary.addClass("col s5");

  // var p2 = $("<p>");

  // p2.addClass("result-summery");
  // p2.text(summary);

  // var p3 = $("<p>");
  // p3.text(`Conditions: ${conditions}`);

  // divSummary.append(p3, p2);
  // divBody.append(divSummary);

  // var HikeCard = li.append(divHeader, divBody);

  // $("#search-results").append(HikeCard);

  // var divWeather = $("<div>");
  // divWeather.addClass("col s4");

  // var p4 = $("<p>");
  // p4.text(WEATHER);

  // var dateOfHike; 
  // var timeOfHike
};

// NOTE: -- "auth.currentUser.uid" -- this points you to the currently signed in user


// **************** CHAT FUNCTION:start ***********************
//   var user = firebase.auth().signInAnonymously();
//   firebase.auth().onAuthStateChanged(function (user) {
//       if (user) {
//           // User is signed in.
//           var isAnonymous = user.isAnonymous;
//           user_id = user.uid;
//       } else {
//           // User is signed out.
//       }
//   });

//   // get firebase database reference...
//   var db_ref = firebase.database().ref('/');
//   db_ref.on('child_added', function (data) {
//       var type;
//       if (data.val().user_id == user_id) {
//           type = "sent";
//       } else {
//           type = "replies";
//       }
//       $('<li class="' + type + '"><p>' + data.val().message + '</p></li>').appendTo($(
//           '.messages ul'));
//       $('.message-input input').val(null);
//       $('.contact.active .preview').html('<span>You: </span>' + data.val().message);
//       $(".messages").animate({
//           scrollTop: $(".messages")[0].scrollHeight
//       }, 0);
//   });

//   function writeUserData(message) {
//       db_ref.push({
//           user_id: user_id,
//           message: message
//       });
//   }
// **************** CHAT FUNCTION:end ***********************    

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
    console.log(credentials)
    database.ref('users/' + credentials.user.uid).set({
      username: username

    });
  });

  $("#regname, regemail, #regpass").val("");
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

//--------------------------------------------------------------------------------------------
// Possibilities to expand: Include a feature to add hike event to Google calendar 