function Gearbox(config){
  this._shifting    = null;
  this._shifts      = {
    "-1":"R", "0":"N",
    "1":"1st", "2":"2nd",
    "3":"3rd", "4":"4th",
    "5":"5th", "6":"6th"
  };
  this.totalShifts   = config.shifts;
  this.shiftingDelay = config.shiftingDelay;
  this.currentShift  = { value: 0, name: 'N'};

  this.getCurrentShift = function getCurrentShift() {
    return this.currentShift;
  };

  this.shiftUp = function shiftUp(){
    this._debounceShift(function(){
      return this.currentShift.value < this.totalShifts && this.currentShift.value++;
    });

    return this;
  };

  this.shiftDown = function shiftDown(){
    this._debounceShift(function(){
      return this.currentShift.value > -1 && this.currentShift.value--;
    });

    return this;
  };

  this._debounceShift = function _debounceShift(callback){
    this._clearState();
    this._shifting = setTimeout(function(){
      callback.call(this);
      this.currentShift.name = this._shifts[this.currentShift.value+""];
      console.log(this.currentShift);
    }.bind(this), this.shiftingDelay);
    return this;
  };

  this._clearState = function _clearState(){
    (function(){
        if (this._shifting !== null) {
        clearTimeout(this._shifting);
        this._shifting = null;
      }
    }.bind(this))();
    return this;
  };

  return this;
}
