function metersToPx(value){
  // 1m == 100px
  var meterAsPx = 1 * 100;
  return (value * meterAsPx) / 1;
}

function kmHrToPxSec(value){
  // 1kmh == .28ms == 28pxs
  var kmHrAsPxSec = 0.28*100;
  return (value * kmHrAsPxSec) / 1;
}
