$(document).ready(function() {
  
  $(".demo").mouseover(function() {
   
    $(".form").addClass("sticky")
    $(".demo").addClass("active")
  })
  $(".demo").mouseout(function() {
    $(".form").removeClass("sticky");
    $(".demo").removeClass("active");
  });	
  });
  $(document).ready(function () {

    // Graph Data ##############################################
    var graphData = [{
        // Visits
        data: [ [6, 1300], [7, 1600], [8, 1900], [9, 2100], [10, 2500], [11, 2200], [12, 2000], [13, 1950], [14, 1900], [15, 2000] ],
        color: '#71c73e'
      }, {
        // Returning Visits
        data: [ [6, 500], [7, 600], [8, 550], [9, 600], [10, 800], [11, 900], [12, 800], [13, 850], [14, 830], [15, 1000] ],
        color: '#77b7c5',
        points: { radius: 4, fillColor: '#77b7c5' }
      },
     { data: [ [6, 1100], [7, 1200], [8, 1700], [9, 1700], [10, 1500], [11, 1400], [12, 1200], [13, 1100], [14, 1100], [15, 1400]],
      color: '#77b7c5',
      points: { radius: 4, fillColor: '#000000' }
    }
    ];
  
    // Lines Graph #############################################
    $.plot($('#graph-lines'), graphData, {
      series: {
        points: {
          show: true,
          radius: 5
        },
        lines: {
          show: true
        },
        shadowSize: 1
      },
      grid: {
        color: '#646464',
        borderColor: 'transparent',
        borderWidth: 20,
        hoverable: true
      },
      xaxis: {
        tickColor: 'transparent',
        tickDecimals: 2
      },
      yaxis: {
        tickSize: 1000
      }
    });
  
    // Bars Graph ##############################################
    $.plot($('#graph-bars'), graphData, {
      series: {
        bars: {
          show: true,
          barWidth: .9,
          align: 'center'
        },
        shadowSize: 0
      },
      grid: {
        color: '#646464',
        borderColor: 'transparent',
        borderWidth: 20,
        hoverable: true
      },
      xaxis: {
        tickColor: 'transparent',
        tickDecimals: 2
      },
      yaxis: {
        tickSize: 1100
      }
    });
  
    // Graph Toggle ############################################
    $('#graph-bars').hide();
  
    $('#lines').on('click', function (e) {
      $('#bars').removeClass('active');
      $('#graph-bars').fadeOut();
      $(this).addClass('active');
      $('#graph-lines').fadeIn();
      e.preventDefault();
    });
  
    $('#bars').on('click', function (e) {
      $('#lines').removeClass('active');
      $('#graph-lines').fadeOut();
      $(this).addClass('active');
      $('#graph-bars').fadeIn().removeClass('hidden');
      e.preventDefault();
    });
  
    // Tooltip #################################################
    function showTooltip(x, y, contents) {
      $('<div id="tooltip">' + contents + '</div>').css({
        top: y - 16,
        left: x + 20
      }).appendTo('body').fadeIn();
    }
  
    var previousPoint = null;
  
    $('#graph-lines, #graph-bars').bind('plothover', function (event, pos, item) {
      if (item) {
        if (previousPoint != item.dataIndex) {
          previousPoint = item.dataIndex;
          $('#tooltip').remove();
          var x = item.datapoint[0],
            y = item.datapoint[1];
            showTooltip(item.pageX, item.pageY, y + ' visitors at ' + x + '.00h');
        }
      } else {
        $('#tooltip').remove();
        previousPoint = null;
      }
    });
  
  });
 
 
    /*
     *  Main function to set the clock times
     */
     (function() {
        initLocalClocks();
        // Start the seconds container moving
        moveSecondHands();
        // Set the intial minute hand container transition, and then each subsequent step
        setUpMinuteHands();
      })();
      
      /*
       * Starts any clocks using the user's local time
       */
      function initLocalClocks() {
        // Get the local time using JS
        var date = new Date;
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();
      
        // Create an object with each hand and it's angle in degrees
        var hands = [
          {
            hand: 'hours',
            angle: (hours * 30) + (minutes / 2)
          },
          {
            hand: 'minutes',
            angle: (minutes * 6)
          },
          {
            hand: 'seconds',
            angle: (seconds * 6)
          }
        ];
        // Loop through each of these hands to set their angle
        for (var j = 0; j < hands.length; j++) {
          var elements = document.querySelectorAll('.' + hands[j].hand);
          for (var k = 0; k < elements.length; k++) {
              elements[k].style.transform = 'rotateZ('+ hands[j].angle +'deg)';
              // If this is a minute hand, note the seconds position (to calculate minute position later)
              if (hands[j].hand === 'minutes') {
                elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
              }
          }
        }
      }
      
      /*
       * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
       */
      function setUpMinuteHands() {
        // More tricky, this needs to move the minute hand when the second hand hits zero
        var containers = document.querySelectorAll('.minutes-container');
        var secondAngle = containers[containers.length - 1].getAttribute('data-second-angle');
        if (secondAngle > 0) {
          // Set a timeout until the end of the current minute, to move the hand
          var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
          console.log(delay);
          setTimeout(function() {
            moveMinuteHands(containers);
          }, delay);
        }
      }
      
      /*
       * Do the first minute's rotation, then move every 60 seconds after
       */
      function moveMinuteHands(containers) {
        for (var i = 0; i < containers.length; i++) {
          containers[i].style.webkitTransform = 'rotateZ(6deg)';
          containers[i].style.transform = 'rotateZ(6deg)';
        }
        // Then continue with a 60 second interval
        setInterval(function() {
          for (var i = 0; i < containers.length; i++) {
            if (containers[i].angle === undefined) {
              containers[i].angle = 12;
            } else {
              containers[i].angle += 6;
            }
            containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
            containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
          }
        }, 60000);
      }
      
      
      function moveSecondHands() {
        var containers = document.querySelectorAll('.seconds-container');
        setInterval(function() {
          for (var i = 0; i < containers.length; i++) {
            if (containers[i].angle === undefined) {
              containers[i].angle = 6;
            } else {
              containers[i].angle += 6;
            }
            containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
            containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
          }
        }, 1000);
      }
      
     

    //chart.js
    // Any of the following formats may be used
 
    
    const ctx = document.getElementById('myChart');
    
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep'],
    
      datasets: [{
        label: "Reset",
        data: [66, 59, 80, 81, 56, 55, 40,90],
        borderRadius:10,
        
        backgroundColor: [
          'rgb(157,155,253)',
          'rgb(128,126,248)',
          'rgb(109,107,244)',
          'rgb(97,94,248)',
          'rgb(109,106,239)',
          'rgb(127,126,243)',
          'rgb(127,126,243)',
          'rgba(127,126,243)'
        ],
        borderColor: [
          'rgb(240, 248, 255)',
          'rgb(240, 248, 255)',
          'rgb(240, 248, 255)',
          'rgb(240, 248, 255)',
          'rgb(240, 248, 255)',
          'rgb(240, 248, 255)',
          'rgb(240, 248, 255)',
           'rgb(240, 248, 255)'
        ],
        borderWidth: 1
        
      }]
    },
    options : {
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`, 
          title: () => null,
      }
      },
      scales: {
        x: {
         
          display: true,
          grid :{
            display:false
          }
      },
      y: {
        display: false,
    }
  },
  
},
    
  });



 