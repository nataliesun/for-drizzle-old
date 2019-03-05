

let time = [];
let hourlyProbability = [];



function makeRainChart() {

let rainChart = document.getElementById('myChart')
                  .getContext('2d');

let rainPropChart = new Chart(rainChart, {
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
      responsive: false,
      title: {
        display: true,
        text: 'Rain Probability'
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMax: 100
          }
        }]
      }
    },


  })

}
