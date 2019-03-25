$(document).ready(function () {
  // init materialize 
  M.AutoInit();

  // show login form 
  $("#logged-in").hide();

  $(document).ready(function () {
    $('.collapsible').collapsible();
  });

  // Display form to start hike group on click
  $("#search-results").on("click", ".host-btn", function (e) {
    e.stopPropagation();
    $("#host-form").show();
  });
});


