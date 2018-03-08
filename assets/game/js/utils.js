/*jshint esversion:6*/
export class Utils {
  static metersToPx(meters){
    // 1m == 100px
    var meterAsPx = 1 * 100;
    return (meters * meterAsPx) / 1;
  }

  static kmHrToPxSec(kmHr){
    // 1kmh == .28ms == 28pxs
    var kmHrAsPxSec = 0.28 * 100;
    return (kmHr * kmHrAsPxSec) / 1;
  }
}
