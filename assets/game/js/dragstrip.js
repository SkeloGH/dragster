function DragStrip(config){
  "use strict";
  this.config = config;
  this.states = {
    timer: {
      start : 0,
      finish : 0
    }
  };

  this.onUpdate = function checkTiming(carPos){
    var worldLimit = this.config.world.width;
    var startTime  = this.states.timer.start;
    var finishTime = this.states.timer.finish;
    var hasStarted  = carPos < worldLimit && !startTime && !finishTime;
    var hasFinished = carPos >= worldLimit && !!startTime && !finishTime;
    var shouldCount = carPos > 0 || startTime > 0;

    if (shouldCount){
      if (hasStarted) {
        this.timer('start');
      }
      if (hasFinished) {
        this.timer('finish');
      }
    }
  };

  this.timer = function timer(action){
    var total;
    this.states.timer[action] = Date.now();
    if (action == 'finish') {
      total = this.states.timer.finish - this.states.timer.start;
      console.log(total);
      return total;
    }
  };

  return this;
}