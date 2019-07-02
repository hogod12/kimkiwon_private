// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Bar Chart Example
var ctx = document.getElementById("myBarChart");

var result_sum = parseInt(content_data["result"]["result_sum"]);
var exam_problem_score_sum = content_data["exam"]["exam_problem_score_sum"];
var exam_statistic_distribution = JSON.parse(content_data["exam"]["exam_statistic_distribution"]);
var exam_statistic_distribution_max = exam_statistic_distribution.reduce(function(a,b){return parseInt(a)>parseInt(b) ? parseInt(a):parseInt(b);});
var y_limit = (parseInt(exam_statistic_distribution_max/10)+1)*10;

var exam_color = new Array(10).fill("#4e73df");
if (i = 0) {
  exam_color[0] = "#ff7f00";
} 
else {
  exam_color[parseInt((result_sum-1)/10)] = "#ff7f00";
}

var exam_color_2 = new Array(10).fill("#2e59d9");
if (i = 0) {
  exam_color_2[0] = "#ff7f00";
} 
else {
  exam_color_2[parseInt((result_sum-1)/10)] = "#ff7f00";
}


var exam_problem_score_range_label = new Array();
var score_range = exam_problem_score_sum/10;
for (var i = 0 ; i < 10 ; i++) {
  if (i == 0) {
    exam_problem_score_range_label[0] = "0-" + String(score_range);
  }
  else {
    exam_problem_score_range_label[i] = String(score_range*i+1) + "-" + String(score_range*(i+1));
  }
}

var myBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: exam_problem_score_range_label,
    datasets: [{
      label: "득점구간 학생수",
      backgroundColor: exam_color,
      hoverBackgroundColor: exam_color_2,
      borderColor: "#4e73df",
      data: exam_statistic_distribution,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 20
        },
        maxBarThickness: 40,
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: y_limit,
          maxTicksLimit: 10,
          padding: 10,
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
  }
});
