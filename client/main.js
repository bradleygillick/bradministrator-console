$(document).ready(function() {
  var smoothie = new SmoothieChart({maxValue:100,minValue:0,millisPerPixel:33,grid:{fillStyle:'rgba(0,0,0,0.08)',strokeStyle:'#434343'},labels:{fillStyle:'#000000'}});
  smoothie.streamTo(document.getElementById("mycanvas"), 2000);


  // Data
  var line1 = new TimeSeries();
  // var times=[];
  // for (var j=0; j < 18; j++) {
  //   times[j] = new Date().getTime();
  //   console.log('times[i] is:', times[j]);
  // }
  // var vals = [40, 45, 42,50,57,63,75,77,82,84,91,84,88,93,80,77,80,81];

  // Add a random value to each line every second
  // setInterval(function() {
  //   line1.append(new Date().getTime(), os.freemem());
  //   (i === 9) ? (i = 0) : (i++)
  //   // console.log('line1 is :', line1)
  // }, 1000);

  // Add to SmoothieChart
  smoothie.addTimeSeries(line1, {lineWidth:2,strokeStyle:'#00ff00',fillStyle:'rgba(0,255,0,0.30)'});
});