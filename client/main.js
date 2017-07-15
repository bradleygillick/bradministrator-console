
$(document).ready(function() {
  var smoothie = new SmoothieChart({millisPerPixel:33,grid:{fillStyle:'rgba(0,0,0,0.08)',strokeStyle:'#434343'},labels:{fillStyle:'#000000'}});
  smoothie.streamTo(document.getElementById("mycanvas"), 2000);


  // Data
  var line1 = new TimeSeries();

  // Add a random value to each line every second
  setInterval(function() {
    line1.append(new Date().getTime(), Math.random());
  }, 1000);

  // Add to SmoothieChart
  smoothie.addTimeSeries(line1, {lineWidth:2,strokeStyle:'#00ff00',fillStyle:'rgba(0,255,0,0.30)'});
});