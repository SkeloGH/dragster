/*jshint esversion: 6*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragStrip = exports.DragStrip = function () {
  function DragStrip(config) {
    _classCallCheck(this, DragStrip);

    this.config = config;
    this.states = {
      timer: {
        start: 0,
        finish: 0
      }
    };

    return this;
  }

  _createClass(DragStrip, [{
    key: 'onUpdate',
    value: function onUpdate(carPos) {
      var worldLimit = this.config.world.width;
      var startTime = this.states.timer.start;
      var finishTime = this.states.timer.finish;
      var hasStarted = carPos < worldLimit && !startTime && !finishTime;
      var hasFinished = carPos >= worldLimit && !!startTime && !finishTime;
      var shouldCount = carPos > 0 || startTime > 0;

      if (shouldCount) {
        if (hasStarted) {
          this.timer('start');
        }
        if (hasFinished) {
          this.timer('finish');
        }
      }
    }
  }, {
    key: 'timer',
    value: function timer(action) {
      var total;
      this.states.timer[action] = Date.now();
      if (action == 'finish') {
        total = this.states.timer.finish - this.states.timer.start;
        console.log(total);
        return total;
      }
    }
  }]);

  return DragStrip;
}();