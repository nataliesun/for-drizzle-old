function searchesSlide() {
  //toggles the past searches display
  const button = $('#searches-show');
  button.on('click', () => {
    $('#past-searches').toggle('slow');

    if (button.html() === "Past Searches") {
      button.html("X");
    } else {
      button.html("Past Searches");
    }
  });
}

function watchRemove() {
  //empties the searches display
  $('.searches').on('click', '.removeSearches', function (){
    $('.searches').empty();
    window.localStorage.removeItem('search');
  })
}

function displaySearches() {
  //uses local storage to display users' recently searched addresses
  let search = window.localStorage.getItem('search');
  if (search !== null) {
    $('.searches').append(`<button class="removeSearches">Clear searches</button>`);
  }
  let searchJ = JSON.parse(search);

  let count = 0;

  searchJ.forEach(item => {
    let address = decodeURIComponent(item.address);
    let city = decodeURIComponent(item.city);
    let state = decodeURIComponent(item.state);
    let zip = decodeURIComponent(item.zip);
    $(".searches").append(
      `<p>${address}, ${city}, ${state}, ${zip}</p>
      <button class="searchAgain" data-result="${count}">Search again</button>`
    );
    count++;
  });
}

function watchSearchAgain() {
  //searches for the address on file
  $('.searches').on('click', '.searchAgain', function() {
    let search = window.localStorage.getItem('search');
    let searchJ = JSON.parse(search);

    let searchIndex = $(this).data('result');

    let selectedSearch = searchJ[searchIndex];

    let address = decodeURIComponent(selectedSearch.address);
    let city = decodeURIComponent(selectedSearch.city);
    let state = decodeURIComponent(selectedSearch.state);
    let zip = decodeURIComponent(selectedSearch.zip);
    RESULTS_EL.find('#loading').show();

  displayResults(address, city, state, zip);
  })

}

function deletePolygons(polygons) {
  //deletes the stored polygons made from account since there is a maximum amount you can save
  polygons.forEach(poly => {
    let deleteReq = `https://api.agromonitoring.com/agro/1.0/polygons/${poly}?appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
    let options = { method: "DELETE" };
    fetch(deleteReq, options);
  });
}

function cleanup() {
  //gets the ids of all stored polygons and deltes
  let allPolygonsReq = `https://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed`;
  fetch(allPolygonsReq)
    .then(response => response.json())
    .then(responseJson => {
      let allPolygons = responseJson.map(poly => poly.id);
      deletePolygons(allPolygons);
    });
}

function getLocationKey(array) {
  //a bunch of api keys since max 50 calls/day 
  //apikey1: al6kRy3N5JRgKrnOpGtBdJuvEKocl44u
  //apikey2: BLazK0LqHmOv7OY2GJLTS1xKRr4Msame
  //apikey3: IwQXmAT1yzTn2WpTPEVm61ktKK5XkNow
  //apikey4: NUwklQSrmbeN1wfH3DPqeIKtzV00ugJG
  //apikey5: 4hvDuxAVb8vTbuD66W53PXCAkGWqvtjD

  //function takes in coordinates array and gets a key to use in getRainForecast's API call
  let locationKeyReq = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=IwQXmAT1yzTn2WpTPEVm61ktKK5XkNow=${
    array[1]
  },${array[0]}`;

  return fetch(locationKeyReq)
  .then(handleErrors)
  .then(response => response.json())
  .then(responseJson => responseJson.Key);
}

function getRainForecast(key) {
  //uses the key from getLocation key to get the 12 hour rain forecast from Accuweather API

  let forecastReq = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=IwQXmAT1yzTn2WpTPEVm61ktKK5XkNow&details=true`;

    return fetch(forecastReq)
    .then(handleErrors)
    .then(response => response.json())
    .then(responseJ => determineRainProbability(responseJ))
}

function determineRainProbability(forecastArray) {
  //gets the data from getRainForecast and determines if any hour's probability of rain is > 50
  let probability = false;
  for (let i = 0; i < forecastArray.length; i++ ) {
    let hourlyRainProb = forecastArray[i].RainProbability;
    hourlyProbability.push(hourlyRainProb);
    if (hourlyRainProb >= 50) {
      probability = true;
    }
  }
  return probability;
}

function getMoisture(id) {
  //uses the "id" from the polygon to get soil moisture data
  const url = `https://api.agromonitoring.com/agro/1.0/soil?polyid=${id}&appid=859dbb08fa72a87e13b7ac7d68ef66ed`;

  return fetch(url)
    .then(response => response.json())
    .then(responseJson => responseJson.moisture);
}

function getPolygon(coordinates) {
  //gets the "id" of the polygon made from user's address so the Agro API can gather soil data
  const url =
    "https://api.agromonitoring.com/agro/1.0/polygons?appid=859dbb08fa72a87e13b7ac7d68ef66ed";
  const body = {
    name: "Polygon Sample",
    geo_json: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [coordinates]
      }
    }
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  return fetch(url, options)
    .then(response => response.json())
    .then(responseJson => responseJson.id);
}

function makePolygon(array) {
  //adds area around the coordinate of user's input address
  const point1 = [array[0], array[1]];
  const point2 = [array[0] + 0.00957, array[1] - 0.000137];
  const point3 = [array[0] + 0.0139, array[1] - 0.005551];
  const point4 = [array[0] + 0.00015, array[1] - 0.005679];
  const point5 = [array[0], array[1]];
  return [point1, point2, point3, point4, point5];
}

function getCoordinates(ad, ci, st, z) {
  //gets the coordinates from user's input address
  const address = encodeURIComponent(ad);
  const city = encodeURIComponent(ci);
  const state = encodeURIComponent(st);
  const zip = encodeURIComponent(z);

  return fetch(
    `https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?apiKey=ad7ae12b6267452bb43785a9d63ff348&version=4.01&streetAddress=${address}&city=${city}&zip=${zip}&format=json`
  )
    .then(handleErrors)
    .then(response => response.json())
    .then(responseJ => {
      if (responseJ.FeatureMatchingResultType !== "Success") {
        throw new Error("Invalid Address!")
      }
      else {
        const lat = parseFloat(responseJ.OutputGeocodes[0].OutputGeocode.Latitude);
        const long = parseFloat(responseJ.OutputGeocodes[0].OutputGeocode.Longitude);
        return [long, lat];
      }
    })
}

const RESULTS_EL = $("#results");
const SUGGESTION_EL = $("#suggestion");

function showEverything(moist, rainProbable) {
  //displays to the DOM the html using the data from API fetches
  let moistureContent = moist*100;
  let rain = rainProbable ? `will` : `won't`;
  let suggestion = ((moistureContent >= 30) || rainProbable) ? `you don't need to water` : `you should water`;

  let resultStr = `<p>The moisure content of your soil is ${moistureContent}% and it probably ${rain} rain in the next 12 hours so ... ${suggestion}</p>`
  SUGGESTION_EL.append(resultStr);
  //makes the rain chart
  makeWeatherCharts();
}

function displayResults(ad, ci, st, z) {
  //clears the suggestion div and old map when the user searches again
  SUGGESTION_EL.html('');
  $("#map").empty();

  //makes fetches to each API in order for the data to be used for the next -- ends up with moisture content and rain forecast
  getCoordinates(ad, ci, st, z)
    .then(coordinates => {
      return Promise.all([makePolygon(coordinates), getLocationKey(coordinates), displayMap(coordinates)])
      .then(([ polygon, key ]) => {
        return Promise.all([getPolygon(polygon).then(id => getMoisture(id)), getRainForecast(key)])
          .then(([moist, rainProbable]) => showEverything(moist, rainProbable)
          )}
      )}
    )//error handling
    .catch(error => alert(error.message))
    .finally(function() {
      //stops loading anitmation
      RESULTS_EL.find('#loading').hide();
  })
}

function handleErrors(response) {
  //function to handle all bad requests
  if (response.status !== 200) {
    throw new Error("Invalid request");
  }
  return response;
}

function displayMap(array) {
  //uses google's map img api to diplay the user's input location
  let displayMapReq;
  $("#map").append(
    `<img src="https://maps.googleapis.com/maps/api/staticmap?size=400x400&markers=color:blue%7C${array[1]},${array[0]}&key=AIzaSyB1CRKX58WoY0erbMTwbYTW_U9Quq74QYQ">`
  );
}

function watchForm() {
    //watches the form for submit of address
    $('#js-form').on('submit', function(event){
      event.preventDefault();
      //formatting address
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

      //adding address to local storage
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

      //displays loading animation
      RESULTS_EL.find('#loading').show();
    //displays results from API calls
    displayResults(address, city, state, zip);
    //clears API account data to not hit max
    cleanup();
  });
}

function main() {
  console.log("App running");
  let search = window.localStorage.getItem("search");
  if (search !== null) {
    displaySearches();
  }
  watchForm();
  watchSearchAgain();
  watchRemove();
  searchesSlide();
}

$(main);
