/*jshint esversion: 6*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerCar = exports.PlayerCar = function () {
  function PlayerCar(config) {
    _classCallCheck(this, PlayerCar);

    this.sprite = config.sprite;
    this.max_speed = config.max_speed;
    this.gearbox = config.gearbox;
    this.max_speed_rwd = -1400; // px/sec
    this.max_accel_rwd = -150;
    return this;
  }

  _createClass(PlayerCar, [{
    key: 'accelerate',
    value: function accelerate() {
      this.sprite.body.acceleration.x = this.getAcceleration();
      this.sprite.animations.play('left');
      return this;
    }
  }, {
    key: 'brake',
    value: function brake() {
      var objectSpeed = this.sprite.body.velocity.x;
      var acceleration = this.sprite.body.velocity.x * -1;

      if (objectSpeed > 0 && objectSpeed < 90 || objectSpeed < 0 && objectSpeed > -90) {
        acceleration = 0;
        this.sprite.body.velocity.x = 0;
      }

      this.sprite.body.acceleration.x = acceleration;
      this.sprite.animations.play('right');
      return this;
    }
  }, {
    key: 'coastNeutral',
    value: function coastNeutral() {
      var deccel_rate = this.sprite.body.velocity.x / this.gearbox.total_shifts;
      this.sprite.body.acceleration.x = deccel_rate * -1;
      this.sprite.animations.stop();
      return this;
    }
  }, {
    key: 'getAcceleration',
    value: function getAcceleration() {
      var acceleration = 0;
      var carSpeed = this.sprite.body.velocity.x;
      var accelRate = this.max_speed / this.gearbox.total_shifts;
      var currentShift = this.gearbox.getCurrentShift().value;
      var maxShiftSpeed = accelRate * currentShift;

      if (currentShift > 0 && carSpeed <= maxShiftSpeed) {
        acceleration = accelRate * currentShift;
      }

      if (currentShift < 0) {
        if (carSpeed >= this.max_speed_rwd) {
          acceleration = this.max_accel_rwd;
        }
      }
      return acceleration;
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(cursors, callback) {
      if (cursors.up.isDown) {
        this.gearbox.shiftUp();
      } else if (cursors.down.isDown) {
        this.gearbox.shiftDown();
      }

      if (cursors.right.isDown) {
        this.accelerate();
      } else if (cursors.left.isDown) {
        this.brake();
      } else if (!cursors.right.isDown && !cursors.left.isDown) {
        this.coastNeutral();
      }
      if (typeof callback == 'function') {
        callback.call(this);
      }
      return this;
    }
  }]);

  return PlayerCar;
}();