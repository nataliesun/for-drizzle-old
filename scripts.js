function cleanup() {
  //owner: Julie
  //cleans up polygons and resets form
}

function getRainForecast() {
  //owner: Julie
  //use zip code/coordinates
  //api url: https://openweathermap.org/api
}

function getMoisture() {
  //owner: Mengqi
  //gets the moisture from polygon
  //api url: https://agromonitoring.com/api
}


function getPolygon() {
  //owner: Mengqi
  //makes polygon from coordinates
}


function getCoordinates() {
  //owner: Natalie
  //make fetch call to getcoordinates passing in formatAddress
  //api url: http://geoservices.tamu.edu
}


function formatAddress() {
  //owner: Natalie
  //gets address and turns into string that getCoordinates fxn needs it to be in
  //street+city+state+zip
}


function displayResults() {
  //fetch with chained callbacks

  //1. call to formatAddress
  //2. make call to getCoordinates
  //3. getPolygon with coordinates
  //4. getMoisture with polygon
  //5. getRainForecast from address
  //6. cleanup to reset form and clean up polygons
  //7. catch error for bad addresses
}


function watchForm() {
    $('#js-form').on('submit', function(event){
      event.preventDefault();
      const address = $('#address').val().trim();
      const city = $('#city').val().trim();
      const state = $('#state').val().trim();
      const zip = $('#zip').val().trim();
      displayResults(address, city, state, zip);
    })

}


function main() {
  console.log('App running');
  watchForm();

}


$(main)
