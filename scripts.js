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

function makePolygon(lat, long) {
  //first and last the same
  const polygon = [];
  const point1 = [lat, long];
  const point2 = [lat, long];
  const point3 = [lat, long];
  const point4 = [lat, long];
  const point5 = [lat, long];

}

function getCoordinates(response) {
  //owner: Natalie
  //make fetch call to getcoordinates passing in formatAddress
  //api url: http://geoservices.tamu.edu

  const lat = response.OutputGeocodes[0].OutputGeocode.Latitude;
  const long = response.OutputGeocodes[0].OutputGeocode.Longitude;
  console.log(lat, long);
  return makePolygon(lat, long);
}


function displayResults(ad, ci, st, z) {
  //fetch with chained callbacks
  const address = encodeURIComponent(ad);
  const city = encodeURIComponent(ci);
  const state = encodeURIComponent(st);
  const zip = encodeURIComponent(z);
  fetch (`https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?apiKey=ad7ae12b6267452bb43785a9d63ff348&version=4.01&streetAddress=${address}&city=${city}&zip=${zip}&format=json`)
  .then(response => response.json())
  .then(responseJ => getCoordinates(responseJ)) //coordinates

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
