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
  const polyid = "5c7acfe257121a000ec4e968";
  // console.log(polyid);
  const url = `http://api.agromonitoring.com/agro/1.0/soil?polyid=${polyid}&appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
  // console.log(url);

  fetch(url).then(response => response.json()).then(responseJson => console.log(responseJson.moisture))

  //owner: Mengqi
  //gets the moisture from polygon
  //api url: https://agromonitoring.com/api
}


function getPolygon(coordinates) {
  const url = 'http://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed';
  // const coordinates = [
  //   [-121.1958,37.6683], [-121.1779,37.6687], [-121.1773,37.6792], [-121.1958,37.6792], [-121.1958,37.6683]
  // ];

  const body = {
    "name":"Polygon Sample",
    "geo_json":{
       "type":"Feature",
       "properties":{
 
       },
       "geometry":{
          "type":"Polygon",
          "coordinates":[
             [
                [-121.1958,37.6683],
                [-121.1779,37.6687],
                [-121.1773,37.6792],
                [-121.1958,37.6792],
                [-121.1958,37.6683]
             ]
          ]
       }
    }
 }

  const options = {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(body)
  }

  fetch(url, options).then(response => response.json()).then(responseJson => console.log(responseJson.id))

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
  getPolygon();
  getMoisture();
}


$(main)
