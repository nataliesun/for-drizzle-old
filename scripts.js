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
          console.log(responseJson);
            let allPolygons = responseJson.map(poly => poly.id);
            deletePolygons(allPolygons);
        });

}

function getRainForecast(array) {
  let locationKeyReq = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=4hvDuxAVb8vTbuD66W53PXCAkGWqvtjD&q=${array[1]},${array[0]}`;

  fetch(locationKeyReq).then(response => response.json())
    .then(responseJson => {
      let key = responseJson.Key;

      // let key = 2243127;
      let forecastReq = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=4hvDuxAVb8vTbuD66W53PXCAkGWqvtjD&details=true`;
      fetch(forecastReq).then(response => response.json()).then(responseJson => {
        let rainProbable = false;
        responseJson.forEach(item => {
          console.log(item.RainProbability);
          if (item.RainProbability > 50) {
            rainProbable = true;
          }
          console.log(rainProbable);
          return rainProbable;
      })
    })
  })
}

// getRainForecast('30.372579','-89.451542');


function getMoisture(id) {
  // console.log(polyid);
  const url = `http://api.agromonitoring.com/agro/1.0/soil?polyid=${id}&appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
  // console.log(url);

  return fetch(url)
  .then(response => response.json())
  .then(responseJson => responseJson.moisture)


  //owner: Mengqi
  //gets the moisture from polygon
  //api url: https://agromonitoring.com/api
}


function getPolygon(coordinates) {
  const url = 'http://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed';
  // const coordinates = [
  //   [-121.1958,37.6683], [-121.1779,37.6687], [-121.1773,37.6792], [-121.1958,37.6792], [-121.1958,37.6683]
  // ];
  console.log('getP', coordinates);
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


  return fetch(url, options)
  .then(response => response.json())
  .then(responseJson => responseJson.id)

  //owner: Mengqi
  //makes polygon from coordinates
}

function makePolygon(array) {
  //first and last the same
  const point1 = [array[0], array[1]];
  const point2 = [array[0]+0.00957, array[1]-0.000137];
  const point3 = [array[0]+0.0139, array[1]-0.005551];
  const point4 = [array[0]+0.00015, array[1]-0.005679];
  const point5 = [array[0], array[1]];
  return [point1, point2, point3, point4, point5];

}

function getCoordinates(ad, ci, st, z) {
  //owner: Natalie
  //make fetch call to getcoordinates passing in formatAddress
  //api url: http://geoservices.tamu.edu
  const address = encodeURIComponent(ad);
  const city = encodeURIComponent(ci);
  const state = encodeURIComponent(st);
  const zip = encodeURIComponent(z);

  return fetch (`https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?apiKey=ad7ae12b6267452bb43785a9d63ff348&version=4.01&streetAddress=${address}&city=${city}&zip=${zip}&format=json`)
  .then(response => response.json())
  .then(responseJ => {
      const lat = parseFloat(responseJ.OutputGeocodes[0].OutputGeocode.Latitude);
      const long = parseFloat(responseJ.OutputGeocodes[0].OutputGeocode.Longitude);
      return [long, lat];
    }
  );
}

const STORE = {
  rain: false,
  moistureContent: 0
}

function showRainForecast(rainProbable){
  let rain = rainProbable ? "will" : "won't";
  $('#results').append(`<p>It probably ${rain} rain</p>`);
  STORE.rain = rainProbable;
  updateStore(rain);
}

function showMoistureContent(moist) {
  let moistureContent = moist*100;
  $('#results').append(`<p>Moisure content is ${moistureContent}</p>`);
  updateStore(moistureContent);
}

function updateStore(param) {
  console.log('type', typeof param)
  if (typeof param === 'string') {
    STORE.rain = param
  } else {
    STORE.moistureContent = param
  }
  $('#updateResults').show();
}

function getSuggestionHtml(obj) {
  console.log(obj);
  if (obj.rain === 'will' && obj.moistureContent > 30) {
    return "Don't water"
  } else if (obj.rain === "won't" && obj.moistureContent > 30) {
    return "Meow, don't water"
  } else if (obj.rain ===  "won't" && obj.moistureContent < 30) {
    return 'You should water'
  }
}


function displayResults(ad, ci, st, z) {
  //fetch with chained callbacks

  getCoordinates(ad, ci, st, z)
  .then(coordinates => makePolygon(coordinates))
  .then(polygon => getPolygon(polygon))
  .then(id => getMoisture(id))
  .then(moist => showMoistureContent(moist));

  getCoordinates(ad, ci, st, z)
  .then(coordinates => getRainForecast(coordinates))
  .then(rainProbable => showRainForecast(rainProbable))

   //coordinates


  //2. make call to getCoordinates
  //3. getPolygon with coordinates
  //4. getMoisture with polygon
  //5. getRainForecast from address
  //6. cleanup to reset form and clean up polygons
  //7. catch error for bad addresses
}

function watchButton() {
  $('#updateResults').on('click', () => {
    const suggestionHtml = getSuggestionHtml(STORE);
    $('#suggestion').html(suggestionHtml)
  })
}


function watchForm() {
    $('#js-form').on('submit', function(event){
      event.preventDefault();
      const address = $('#address').val().trim();
      const city = $('#city').val().trim();
      const state = $('#state').val().trim();
      const zip = $('#zip').val().trim();
      displayResults(address, city, state, zip);
      cleanup();
    })

}


function main() {
  console.log('App running');
  watchForm();
  watchButton();

  //getPolygon();


}


$(main)
