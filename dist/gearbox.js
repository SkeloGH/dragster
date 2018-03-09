/*jshint esversion: 6*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gearbox = exports.Gearbox = function () {
  function Gearbox(config) {
    _classCallCheck(this, Gearbox);

    this._shifting = null;
    this._shifts = {
      "-1": "R", "0": "N",
      "1": "1st", "2": "2nd",
      "3": "3rd", "4": "4th",
      "5": "5th", "6": "6th"
    };
    this.total_shifts = config.max_gears;
    this.shifting_delay = config.shifting_delay;
    this.current_shift = { value: 0, name: 'N' };
    return this;
  }

  _createClass(Gearbox, [{
    key: "getCurrentShift",
    value: function getCurrentShift() {
      return this.current_shift;
    }
  }, {
    key: "shiftUp",
    value: function shiftUp() {
      this._debounceShift(function () {
        return this.current_shift.value < this.total_shifts && this.current_shift.value++;
      });

      return this;
    }
  }, {
    key: "shiftDown",
    value: function shiftDown() {
      this._debounceShift(function () {
        return this.current_shift.value > -1 && this.current_shift.value--;
      });

      return this;
    }
  }, {
    key: "_debounceShift",
    value: function _debounceShift(callback) {
      this._clearState();
      this._shifting = setTimeout(function () {
        callback.call(this);
        this.current_shift.name = this._shifts[this.current_shift.value + ""];
        console.log(this.current_shift);
      }.bind(this), this.shifting_delay);
      return this;
    }
  }, {
    key: "_clearState",
    value: function _clearState() {
      if (this._shifting !== null) {
        clearTimeout(this._shifting);
        this._shifting = null;
      }
      return this;
    }
  }]);

  return Gearbox;
}();