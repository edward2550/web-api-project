const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_APIkey = "AIzaSyDBZDlaR7dir_W3wvU_m6ZMofx3LUMH-BY";

//Create dropdown menu from store.js and render
function displayList() {
  const optionsHtml = Object.keys(countryArray).map((key, index) => {
    return `
    <option class="country-list center" value="${key}">${countryArray[key]}</option>`;
  });

  const dropdownHtml = `
  <label for="country-select"></label>
  <select id="country-select" class="center drop" aria-label="Country List">${optionsHtml.join("")}</select>
   `;
  $("#country-list").html(dropdownHtml);
}

//calls the webcam API and renders webcam results
function getCamApiData() {
  $("#country-list").on("change", "select", event => {
    let countryKeySelected = $("#country-select").val();
    let countryNameSelected = $("#country-select").text();
  $.ajax({
  url: `https://webcamstravel.p.mashape.com/webcams/list/limit=6/orderby=popularity,desc/category=mountain/country=${countryKeySelected}`,
  data: {show:"webcams:image,location,player"},
  dataType: "json",
  type: "GET",
  headers: {"X-Mashape-Key": "b4aef8736dmsh445b582f7fe2e36p1f0e8djsnb4107c8b84da",
  "X-Mashape-Host": "webcamstravel.p.mashape.com"},
    success: function(data) {      
      let webcamArray = data.result.webcams.map(function(webcam) {
        if (data.result.total > 0) { 
        return `
        <div class="cam-div">
        <h4 class=cam-titles>${webcam.location.city}, ${webcam.location.region}</h4>
        <iframe class="webcams" src="${webcam.player.day.embed}"></iframe>
        </div>
        `;
        }
      });
      if(webcamArray.length == 0) {
        $("#js-cam-results-text").html("");
        $("#js-cam-results").html("<h4>This country has no webcams yet :( </h4>");
      } else {
        $("#js-cam-results-text").html(`<h3 id="scrollTo" class="cam-results-for">Webcam Results for ${data.result.webcams[0].location.country}</h3>`);
        $("#js-cam-results").html(webcamArray.join(""));
      }
    }
  });
  });
}
 
function getDataFromYouTube(callback) {
   $("#country-list").on("change", "select", event => {
      let countryNameSelected = $("#country-select option:selected").text();
      const settings = {
        part: "snippet",
        key: YOUTUBE_APIkey,
        q: `Best of travel in ${countryNameSelected}`,
        maxResults: 6,
        relevanceLanguage: "en",
        type: "video",
        order: "Relevance"
      };
      $.getJSON(YOUTUBE_SEARCH_URL, settings, callback);
    });
}

function generateResult(result) {
    return `
    <div class="vid-div">
    <iframe class="vid-results" src="https://www.youtube.com/embed/${result.id.videoId}" title="${result.snippet.title}" aria-label="YouTube Video"></iframe>
    </div>`;
}

//renders YouTube results
function displayYouTubeSearchData(data) {
  let countryNameSelected = $("#country-select option:selected").text();
  const results = data.items.map((item, index) => generateResult(item));
  $("#js-results-text").html(`<h3 class="video-col-title">Video Results for ${countryNameSelected}</h3>`);
  $("#js-results").html( results );
}

//scrolls to results when country is clicked
function scrollTo() {
$("#country-select").on("change", function() {
  $("html, body").animate({
      scrollTop: $("#js-cam-results").offset().top
  }, 1000);
});
}

$(document).ready(function() {
  displayList();
  scrollTo();
  getCamApiData();
  getDataFromYouTube(displayYouTubeSearchData);
});
