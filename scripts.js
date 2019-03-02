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

function getRainForecast(lat, long) {
  

  // hard coding for now to reduce number of test calls
  // let locationKeyReq = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=4hvDuxAVb8vTbuD66W53PXCAkGWqvtjD&q=${lat},${long}`;

  // fetch(locationKeyReq).then(response => response.json())
  //   .then(responseJson => {
      // let key = responseJson.Key;

      let key = 2243127;
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
  // })
}

getRainForecast('30.372579','-89.451542');

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