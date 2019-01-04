// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("myBarChart");

console.log(data)
console.log(selected_result)

var exam_result_distribution = JSON.parse(data[selected_result]["exam_result_distribution"])
var exam_score_sum = JSON.parse(data[selected_result]["exam_problem_mark"]).reduce((a,b) => a+b)
var exam_dist_max = exam_result_distribution.reduce( function (previous, current) { return previous > current ? previous:current })

var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [`0-${exam_score_sum*0.1}`, 
            `${exam_score_sum/10*1+1}-${exam_score_sum/10*2}`,
            `${exam_score_sum/10*2+1}-${exam_score_sum/10*3}`,
            `${exam_score_sum/10*3+1}-${exam_score_sum/10*4}`,
            `${exam_score_sum/10*4+1}-${exam_score_sum/10*5}`,
            `${exam_score_sum/10*5+1}-${exam_score_sum/10*6}`,
            `${exam_score_sum/10*6+1}-${exam_score_sum/10*7}`,
            `${exam_score_sum/10*7+1}-${exam_score_sum/10*8}`,
            `${exam_score_sum/10*8+1}-${exam_score_sum/10*9}`,
            `${exam_score_sum/10*9+1}-${exam_score_sum}`],
    datasets: [{
      label: "Revenue",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: exam_result_distribution
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
          max: exam_dist_max + 10,
          maxTicksLimit: 5
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
