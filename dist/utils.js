"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion:6*/
var Utils = exports.Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "metersToPx",
    value: function metersToPx(meters) {
      // 1m == 100px
      var meterAsPx = 1 * 100;
      return meters * meterAsPx / 1;
    }
  }, {
    key: "kmHrToPxSec",
    value: function kmHrToPxSec(kmHr) {
      // 1kmh == .28ms == 28pxs
      var kmHrAsPxSec = 0.28 * 100;
      return kmHr * kmHrAsPxSec / 1;
    }
  }]);

  return Utils;
}();