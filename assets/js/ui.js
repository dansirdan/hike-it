// show login form 
$("#loggin-in").hide();
/* login form is hidden by default to avoid
* a flash of the div when pages are loading
*/

// Display form to start hike group on click
$("#search-results").on("click", ".host-btn", function (e) {
  e.stopPropagation();
  $("#host-form").show();
  $("#search-results").hide();
});
