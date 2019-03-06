function displaySearches() {
  let search = window.localStorage.getItem('search');
  let searchJ = JSON.parse(search);
  
  let count = 0;

  searchJ.forEach(item => {
    let address = decodeURIComponent(item.address);
    let city = decodeURIComponent(item.city);
    let state = decodeURIComponent(item.state);
    let zip = decodeURIComponent(item.zip);
    $('.searches').append(
      `<p>${address}, ${city}, ${state}, ${zip}</p>
      <button class="searchAgain" data-result="${count}">Search again</button>`
    );
    count++;
  })
};

function watchSearchAgain() {
  $('.searches').on("click", '.searchAgain', function() {
  let search = window.localStorage.getItem('search');
  let searchJ = JSON.parse(search);

  let searchIndex = $(this).data('result');

  let selectedSearch = searchJ[searchIndex];
  
  let address = decodeURIComponent(selectedSearch.address);
  let city = decodeURIComponent(selectedSearch.city);
  let state = decodeURIComponent(selectedSearch.state);
  let zip = decodeURIComponent(selectedSearch.zip);
    
  displayResults(address, city, state, zip);
  })
}

function deletePolygons(polygons) {
  polygons.forEach(poly => {
    let deleteReq = `https://api.agromonitoring.com/agro/1.0/polygons/${poly}?appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
    let options = {method: 'DELETE'};
    fetch(deleteReq, options)});
}

function cleanup() {
  let allPolygonsReq = `https://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
    fetch(allPolygonsReq)
        .then(response => response.json())
        .then(responseJson => {
            let allPolygons = responseJson.map(poly => poly.id);
            deletePolygons(allPolygons);
        });
}

function getLocationKey(array) {
  let locationKeyReq = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=IwQXmAT1yzTn2WpTPEVm61ktKK5XkNow&q=${array[1]},${array[0]}`;

  return fetch(locationKeyReq).then(response => response.json())
    .then(responseJson => responseJson.Key);
}

function getRainForecast(array) {
  getLocationKey(array).then(key => {
    let forecastReq = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=IwQXmAT1yzTn2WpTPEVm61ktKK5XkNow&details=true`;
    
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

function getMoisture(id) {

  const url = `https://api.agromonitoring.com/agro/1.0/soil?polyid=${id}&appid=859dbb08fa72a87e13b7ac7d68ef66ed`;

  return fetch(url)
  .then(response => response.json())
  .then(responseJson => responseJson.moisture)
}


function getPolygon(coordinates) {
  const url = 'https://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed';
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
}

function makePolygon(array) {
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

  
  //add request to localStorage for later use
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

const RESULTS_EL = $('#results');
const SUGGESTION_EL = $('#suggestion');


function showRainForecast(rainProbable){
  let rain = rainProbable ? "will" : "won't";
  RESULTS_EL.append(`<p>It probably ${rain} rain</p>`);
  STORE.rain = rainProbable;
  updateStore(rain);
}

function showMoistureContent(moist) {
  let moistureContent = moist*100;
  RESULTS_EL.append(`<p>Moisure content is ${moistureContent}</p>`);
  updateStore(moistureContent);
}

function updateStore(param) {
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
    return "Don't water"
  } else if (obj.rain ===  "won't" && obj.moistureContent < 30) {
    return 'You should water'
  }
}

function displayResults(ad, ci, st, z) {
  //fetch with chained callbacks
  RESULTS_EL.html('');
  SUGGESTION_EL.html('');
  getCoordinates(ad, ci, st, z)
  .then(coordinates => makePolygon(coordinates))
  .then(polygon => getPolygon(polygon))
  .then(id => getMoisture(id))
  .then(moist => showMoistureContent(moist));

  getCoordinates(ad, ci, st, z)
  .then(coordinates => getRainForecast(coordinates))
  .then(rainProbable => showRainForecast(rainProbable))

  //7. catch error for bad addresses
}

function watchButton() {
  $('#updateResults').on('click', () => {
    $('#updateResults').hide();
    const suggestionHtml = getSuggestionHtml(STORE);
    $('#suggestion').html(suggestionHtml);
  })
}

function watchForm() {
    $('#js-form').on('submit', function(event){
      event.preventDefault();
      const address = $('#address').val().trim();
      const city = $('#city').val().trim();
      const state = $('#state').val().trim();
      const zip = $('#zip').val().trim();
      
      const searchInfo = {
        address: address,
        city: city,
        state: state,
        zip: zip
      };

      let search = window.localStorage.getItem('search');
      let searchJ = JSON.parse(search);

      if (search === null) {
        let addSearchesArr = [];
        addSearchesArr.push(searchInfo);
        window.localStorage.setItem('search', JSON.stringify(addSearchesArr));
      } else {
        searchJ.push(searchInfo);
        window.localStorage.setItem('search', JSON.stringify(searchJ));
      }
      
      displayResults(address, city, state, zip);
      cleanup();
    })

}

function main() {
  console.log('App running');
  let search = window.localStorage.getItem('search');
  if (search !== null) {
    displaySearches();
  }
  watchForm();
  watchButton();
  watchSearchAgain();
}

$(main)
