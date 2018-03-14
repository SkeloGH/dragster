"use strict";
/*jshint esversion:6 */
/*jshint browser:true */
/*jshint asi:true */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils.js');

var _dragstrip = require('./dragstrip.js');

var _playercar = require('./playercar.js');

var _gearbox = require('./gearbox.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(io) {
    _classCallCheck(this, Game);

    this.io_api = io;
    this.controls = null;
    this.wsocket = null;
    this.cfg = {
      screen_width: window.document.body.scrollWidth,
      screen_height: window.document.body.scrollHeight,
      renderer: Phaser.AUTO,
      element: '',
      players: {
        main: {
          car_sprite: '/assets/game/img/cars/phantom/car.png',
          max_gears: 6,
          max_speed: _utils.Utils.kmHrToPxSec(150)
        },
        enemy: {
          car_sprite: '/assets/game/img/cars/phantom/car.png',
          max_gears: 6,
          max_speed: _utils.Utils.kmHrToPxSec(150)
        }
      }
    };

    this.stage = new _dragstrip.DragStrip({
      world: {
        width: _utils.Utils.metersToPx(402.34),
        height: 512,
        background: '/assets/game/img/bg/dragstrip.png'
      }
    });

    this.characters = {
      player: new _playercar.PlayerCar({
        position_x: 0,
        name: ('' + Date.now()).slice(9, 13),
        gearbox: new _gearbox.Gearbox({
          max_gears: this.cfg.players.main.max_gears,
          shifting_delay: 100
        }),
        max_speed: this.cfg.players.main.max_speed
      }),
      enemy: new _playercar.PlayerCar({
        position_x: 0,
        name: '',
        gearbox: new _gearbox.Gearbox({
          max_gears: this.cfg.players.enemy.max_gears,
          shifting_delay: 100
        }),
        max_speed: this.cfg.players.enemy.max_speed
      })
    };
  }

  _createClass(Game, [{
    key: 'start',
    value: function start() {
      this.game = new Phaser.Game(this.cfg.screen_width, this.cfg.screen_height, this.cfg.renderer, this.cfg.element, {
        preload: function preload() {
          this.game.load.image('stage__bg', this.stage.config.world.background);
          this.game.load.image('player__car', this.cfg.players.main.car_sprite);
          this.game.load.image('enemy__car', this.cfg.players.enemy.car_sprite);
        }.bind(this),

        create: function createStage() {
          var start_x = 0;
          var main_player_y = 377;
          var enemy_player_y = 239;
          var world = this.stage.config.world;
          var main_player = this.cfg.players.main;
          var enemy_player = this.cfg.players.enemy;
          var background = this.game.add.tileSprite(0, 0, world.width, world.height, 'stage__bg');

          this.controls = this.game.input.keyboard.createCursorKeys();
          this.characters.player.sprite = this.game.add.sprite(start_x, main_player_y, 'player__car');
          this.characters.enemy.sprite = this.game.add.sprite(start_x, enemy_player_y, 'enemy__car');

          this.game.stage.backgroundColor = '#dedede';
          this.game.time.advancedTiming = true;
          this.game.stage.disableVisibilityChange = true;

          this.game.world.setBounds(0, 0, world.width, world.height);
          this.game.physics.arcade.enable(this.characters.player.sprite);
          this.game.physics.arcade.enable(this.characters.enemy.sprite);
          this.game.camera.follow(this.characters.player.sprite);
        }.bind(this),

        update: function update() {
          this.characters.player.position_x = this.characters.player.sprite.body.x;
          this.stage.onUpdate(this.characters.player.position_x);
          this.characters.player.onUpdate(this.controls);
          this.characters.enemy.sprite.x = this.characters.enemy.position_x;
        }.bind(this),

        render: function render() {
          this.game.debug.cameraInfo(this.game.camera, 32, 32);
          this.game.debug.spriteCoords(this.characters.player.sprite, 32, 500);
          this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
          this.game.debug.text('Players: ' + [this.characters.player.name, this.characters.enemy.name].join(' '), 2, 120, "#00ff00");
          this.game.debug.text(this.characters.player.gearbox.current_shift.name, this.cfg.screen_width - 45, 377, "#00ff00");
        }.bind(this)
      });

      return this;
    }
  }, {
    key: 'connect',
    value: function connect() {

      this.wsocket = this.io_api(undefined, {
        query: {
          uid: this.characters.player.name
        }
      });

      this.wsocket.on('user.joined', function (data) {
        this.room_name = data.room;
        if (data.id != this.characters.player.name) {
          this.characters.enemy.name = data.id;
        }
      }.bind(this));

      this.wsocket.on('user.update', function (data) {
        if (data.u != this.characters.player.name) {
          this.characters.enemy.name = data.u;
          this.characters.enemy.position_x = data.x;
        }
      }.bind(this));

      this.wsocket.on('user.disconnected', function () {
        window.location.reload();
      }.bind(this));

      return this;
    }
  }, {
    key: 'broadcastLoop',
    value: function broadcastLoop(fps) {
      var fps_to_itvl = 1000 / 60 * fps;

      setInterval(function () {
        if (!!this.wsocket) {
          this.wsocket.emit('user.update', {
            x: this.characters.player.position_x,
            u: this.characters.player.name,
            room: this.room_name
          });
        }
      }.bind(this), fps_to_itvl);

      return this;
    }
  }]);

  return Game;
}();

var io = window.io;
var Phaser = window.Phaser;
window.App = new Game(io).connect().broadcastLoop(30).start();