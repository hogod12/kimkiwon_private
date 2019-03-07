// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("myBarChart");

var user_result_sum = data["university_statistics"]["result_sum"]
var university_average = data["university_statistics"]["average"]
var university_max = data["university_statistics"]["max"]
var university_min = data["university_statistics"]["min"]

var data_array = [user_result_sum, university_average,university_max,university_min];

var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [`학생점수`,
            `평균`, 
            `최고득점`,
            `최저득점`],
    datasets: [{
      label: "Revenue",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: data_array
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          maxTicksLimit: 10
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
