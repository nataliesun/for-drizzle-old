let date = new Date();
let now = date.getHours();

let time = getTwelveHours(now);
let hourlyProbability = [];
let tempData = [];

function getTwelveHours(current) {
  let nextTwelve = [];
  for (let i = 0; i < 12; i++) {
    let nextHour = current + i;
    if (nextHour < 12) {
      nextTwelve.push(`${nextHour} am`);
    } else if (nextHour < 24) {
      nextTwelve.push(`${nextHour - 12} pm`);
    } else if (nextHour === 24) {
      nextTwelve.push(`${nextHour - 12} am`);
    } else {
      nextTwelve.push(`${nextHour - 24} am`);
    }
  }
  return nextTwelve;
}



function makeWeatherCharts() {

let rainChart = document.getElementById('myChart').getContext('2d');

let rainProbChart = new Chart(rainChart, {
    type: 'line',
    data: {
      labels: time,
      datasets: [{
        label: 'Rain Probability',
        data: hourlyProbability,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderWidth: 2,
        borderColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Rain Probability'
      }
    // scales: {
    //   yAxes: [{
    //     ticks: {
    //       suggestedMax: 100
    //     }
    //   }]
    // }
    },


  });


}
