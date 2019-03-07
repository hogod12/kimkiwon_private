// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("myBarChart");

var exam_result_dist = data["report_data"]["exam_result_dist"]
var exam_problem_label = data["report_data"]["exam_problem_label"]
var exam_problem_mark_sum = data["report_data"]["exam_problem_mark_sum"]
var exam_dist_max = exam_result_dist.reduce( function (previous, current) { return previous > current ? previous:current })

var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [`0-${exam_problem_mark_sum*0.1}`, 
            `${exam_problem_mark_sum/10*1+1}-${exam_problem_mark_sum/10*2}`,
            `${exam_problem_mark_sum/10*2+1}-${exam_problem_mark_sum/10*3}`,
            `${exam_problem_mark_sum/10*3+1}-${exam_problem_mark_sum/10*4}`,
            `${exam_problem_mark_sum/10*4+1}-${exam_problem_mark_sum/10*5}`,
            `${exam_problem_mark_sum/10*5+1}-${exam_problem_mark_sum/10*6}`,
            `${exam_problem_mark_sum/10*6+1}-${exam_problem_mark_sum/10*7}`,
            `${exam_problem_mark_sum/10*7+1}-${exam_problem_mark_sum/10*8}`,
            `${exam_problem_mark_sum/10*8+1}-${exam_problem_mark_sum/10*9}`,
            `${exam_problem_mark_sum/10*9+1}-${exam_problem_mark_sum}`],
    datasets: [{
      label: "Revenue",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: exam_result_dist
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
          max: (parseInt(exam_dist_max/10)+1)*10,
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
