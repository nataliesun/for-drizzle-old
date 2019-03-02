function deletePolygons(polygons) {
  //owner: Julie

  polygons.forEach(poly => {
    let deleteReq = `http://api.agromonitoring.com/agro/1.0/polygons/${poly}?appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
    let options = {method: 'DELETE'};
    fetch(deleteReq, options)});
}

function cleanup() {
  //owner: Julie
  //cleans up polygons and resets form

  // api endpoint for getting all of a user's polygons
  let allPolygonsReq = `http://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed`;

  //fetch all polygons -- get list of polygons out of response and pass it to delete function

    fetch(allPolygonsReq)
        .then(response => response.json())
        .then(responseJson => {
            let allPolygons = responseJson.map(poly => poly.id);
            deletePolygons(allPolygons);
        });

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
             coordinates
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

  return fetch(url, options).then(response => response.json()).then(responseJson => responseJson.id)

  //owner: Mengqi
  //makes polygon from coordinates
}

function makePolygon(long, lat) {
  //first and last the same
  const point1 = [long, lat];
  const point2 = [long+0.00957, lat-0.000137];
  const point3 = [long+0.0139, lat-0.005551];
  const point4 = [long+0.00015, lat-0.005679];
  const point5 = [long, lat];
  return [point1, point2, point3, point4, point5];

}

function getCoordinates(response) {
  //owner: Natalie
  //make fetch call to getcoordinates passing in formatAddress
  //api url: http://geoservices.tamu.edu

  const lat = response.OutputGeocodes[0].OutputGeocode.Latitude;
  const long = response.OutputGeocodes[0].OutputGeocode.Longitude;
  //console.log(lat, long);
  console.log(makePolygon(parseFloat(long),parseFloat(lat)));
}

function getAddress(ad, ci, st, z) {
  const address = encodeURIComponent(ad);
  const city = encodeURIComponent(ci);
  const state = encodeURIComponent(st);
  const zip = encodeURIComponent(z);

  return fetch (`https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?apiKey=ad7ae12b6267452bb43785a9d63ff348&version=4.01&streetAddress=${address}&city=${city}&zip=${zip}&format=json`)
}


function displayResults(ad, ci, st, z) {
  //fetch with chained callbacks

  getAddress(ad, ci, st, z)
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
  //getPolygon();

}


$(main)
