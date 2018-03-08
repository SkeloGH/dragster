function Gearbox(config){
  "use strict";
  this._shifting    = null;
  this._shifts      = {
    "-1":"R", "0":"N",
    "1":"1st", "2":"2nd",
    "3":"3rd", "4":"4th",
    "5":"5th", "6":"6th"
  };
  this.total_shifts   = config.max_gears;
  this.shifting_delay = config.shifting_delay;
  this.current_shift  = { value: 0, name: 'N'};

  this.getCurrentShift = function getCurrentShift() {
    return this.current_shift;
  };

  this.shiftUp = function shiftUp(){
    this._debounceShift(function(){
      return this.current_shift.value < this.total_shifts && this.current_shift.value++;
    });

    return this;
  };

  this.shiftDown = function shiftDown(){
    this._debounceShift(function(){
      return this.current_shift.value > -1 && this.current_shift.value--;
    });

    return this;
  };

  this._debounceShift = function _debounceShift(callback){
    this._clearState();
    this._shifting = setTimeout(function(){
      callback.call(this);
      this.current_shift.name = this._shifts[this.current_shift.value+""];
      console.log(this.current_shift);
    }.bind(this), this.shifting_delay);
    return this;
  };

  this._clearState = function _clearState(){
    if (this._shifting !== null) {
      clearTimeout(this._shifting);
      this._shifting = null;
    }
    return this;
  };

  return this;
}
