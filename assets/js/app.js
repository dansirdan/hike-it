// FIREBASE CONFIG
// 
//     /* <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase.js"></script> */
//
// var config = {
//     apiKey: "AIzaSyD6vRPaTQwhxm4Zs-oa7Rw8eyS2mnnCR84",
//     authDomain: "hikeit-34330.firebaseapp.com",
//     databaseURL: "https://hikeit-34330.firebaseio.com",
//     projectId: "hikeit-34330",
//     storageBucket: "",
//     messagingSenderId: "956706165596"
// };
// firebase.initializeApp(config);

// DATABASE VARIABLES
// var database = firebase.database();
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
// 

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
        createCard();
$("#SomeDivID").append(createCard())


    }

})
function createCard(img, body, rating) {
    var card = $("<div>")
    card.attr("class", "card")
    card.attr("src", img)
    
}
// REQUIREMENTS REMINDER: 2 new technologies
//      (1) Materialize: Dates-> Under Pickers
//      (2) Google Fonts (for making it pretty :) )

// FORM FOR CREATING ACCOUNT
// input # or . :
// on submit click grab input .val().trim() = username & password/email
// submit button listener
// ("SUBMIT-BTN").on("click", function(){

// CODE GOES HERE 

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