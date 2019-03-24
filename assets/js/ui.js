// show login form 
$("#logged-out").show();
/* login form is hidden by default so you don't
* see flashing of the div when moving from 
* page to page. 
*/

// Display form to start hike group on click
$("#search-results").on("click", ".host-btn", function (e) {
  $("#host-form").show();
  $("#search-results").hide();
});
