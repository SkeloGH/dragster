/*jshint esversion: 6*/
/*jshint asi: true*/
"use strict"
export class PlayerCar {
  constructor(config){

    Object.keys(config).forEach(function(key){
      return (config.propertyIsEnumerable(key) ? this[key] = config[key] : false)
    }.bind(this))

    this.max_speed_rwd      = -1400 // px/sec
    this.max_accel_rwd      = -150

    return this
  }

  accelerate(){
    this.sprite.body.acceleration.x = this.getAcceleration()
    this.sprite.animations.play('left')
    return this
  }

  brake(){
    let objectSpeed   = this.sprite.body.velocity.x
    let acceleration  = this.sprite.body.velocity.x * -1

    if (objectSpeed > 0 && objectSpeed < 90 ||
      objectSpeed < 0 && objectSpeed > -90) {
      acceleration = 0
      this.sprite.body.velocity.x = 0
    }

    this.sprite.body.acceleration.x = acceleration
    this.sprite.animations.play('right')
    return this
  }

  coastNeutral(){
    let deccel_rate = this.sprite.body.velocity.x / this.gearbox.total_shifts
    this.sprite.body.acceleration.x = deccel_rate * -1
    this.sprite.animations.stop()
    return this
  }

  getAcceleration(){
    let acceleration  = 0
    let carSpeed      = this.sprite.body.velocity.x
    let accelRate     = this.max_speed / this.gearbox.total_shifts
    let currentShift  = this.gearbox.getCurrentShift().value
    let maxShiftSpeed = accelRate * currentShift

    if (currentShift > 0 && carSpeed <= maxShiftSpeed) {
      acceleration  = accelRate * currentShift
    }

    if (currentShift < 0){
      if (carSpeed >= this.max_speed_rwd) {
        acceleration = this.max_accel_rwd
      }
    }
    return acceleration
  }

  onUpdate(cursors, callback){
    if (cursors.up.isDown){
      this.gearbox.shiftUp()
    }else if (cursors.down.isDown){
      this.gearbox.shiftDown()
    }

    if (cursors.right.isDown){
      this.accelerate()
    }else if (cursors.left.isDown){
      this.brake()
    }else if (!cursors.right.isDown && !cursors.left.isDown){
      this.coastNeutral()
    }
    if(typeof callback == 'function'){
      callback.call(this)
    }
    return this
  }
}