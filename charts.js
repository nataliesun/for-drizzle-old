let date = new Date(); //gets date
let now = date.getHours();

let time = getTwelveHours(now);
let hourlyProbability = [];
let tempData = [];

function getTwelveHours(current) {
  //gets the next twelve hours from now and formats in XXam/pm form
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

//makes the rain probability chart
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
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Rain Probability'
      }
    },
  });
}
