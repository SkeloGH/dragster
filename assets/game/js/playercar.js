function PlayerCar(config){
  this.car                = config.sprite;
  this.topSpeed           = config.topSpeed;
  this.topRwdSpeed        = config.topRwdSpeed;
  this.gearbox            = config.gearbox;
  this.maxAccelerationRwd = -150;

  this.accelerate = function accelerate(){
    this.car.body.acceleration.x = this.getAcceleration();
    this.car.animations.play('left');
    return this;
  };

  this.brake = function brake(){
    var objectSpeed   = this.car.body.velocity.x;
    var acceleration  = this.car.body.velocity.x * -1;

    if (objectSpeed > 0 && objectSpeed < 90 ||
      objectSpeed < 0 && objectSpeed > -90) {
      acceleration = 0;
      this.car.body.velocity.x = 0;
    }

    this.car.body.acceleration.x = acceleration;
    this.car.animations.play('right');
    return this;
  };

  this.coast_neutral = function coast_neutral(){
    var deccel_rate = this.car.body.velocity.x / this.gearbox.totalShifts;
    this.car.body.acceleration.x = deccel_rate * -1;
    this.car.animations.stop();
    return this;
  };

  this.getAcceleration = function getAcceleration(){
    return (function(){
      var acceleration  = 0;
      var carSpeed      = this.car.body.velocity.x;
      var accelRate     = this.topSpeed / this.gearbox.totalShifts;
      var currentShift  = this.gearbox.getCurrentShift().value;
      var maxShiftSpeed = accelRate * currentShift;

      if (currentShift > 0 && carSpeed <= maxShiftSpeed) {
        acceleration  = accelRate * currentShift;
      }

      if (currentShift < 0){
        if (carSpeed >= this.topRwdSpeed) {
          acceleration = this.maxAccelerationRwd;
        }
      }
      return acceleration;
    }.bind(this))();
  };

  this.update = function update(cursors, callback){
    (function _update(){
      if (cursors.up.isDown){
        this.gearbox.shiftUp();
      }else if (cursors.down.isDown){
        this.gearbox.shiftDown();
      }

      if (cursors.right.isDown){
        this.accelerate();
      }else if (cursors.left.isDown){
        this.brake();
      }else if (!cursors.right.isDown && !cursors.left.isDown){
        this.coast_neutral();
      }
      if(typeof callback == 'function'){
        callback.call(this);
      }
    }.bind(this))();
    return this;
  };

  return this;
}