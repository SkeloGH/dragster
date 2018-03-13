/*jshint esversion:6 */
/*jshint browser:true */
"use strict";

var _utils = require('./utils.js');

var _dragstrip = require('./dragstrip.js');

var _playercar = require('./playercar.js');

var _gearbox = require('./gearbox.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function Game() {
  _classCallCheck(this, Game);

  var controls = void 0;
  var game_cfg = {
    screen_width: window.document.body.scrollWidth,
    screen_height: window.document.body.scrollHeight,
    renderer: Phaser.AUTO,
    element: ''
  };
  var players_cfg = {
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
  };
  var stage = new _dragstrip.DragStrip({
    world: {
      width: _utils.Utils.metersToPx(402.34),
      height: 512,
      background: '/assets/game/img/bg/dragstrip.png'
    }
  });
  var characters = {
    player: new _playercar.PlayerCar({
      gearbox: new _gearbox.Gearbox({
        max_gears: players_cfg.main.max_gears,
        shifting_delay: 100
      }),
      max_speed: players_cfg.main.max_speed
    }),
    enemy: new _playercar.PlayerCar({
      gearbox: new _gearbox.Gearbox({
        max_gears: players_cfg.enemy.max_gears,
        shifting_delay: 100
      }),
      max_speed: players_cfg.enemy.max_speed
    })
  };
  var game = new Phaser.Game(game_cfg.screen_width, game_cfg.screen_height, game_cfg.renderer, game_cfg.element, {
    preload: function preload() {
      game.load.image('stage__bg', stage.config.world.background);
      game.load.image('player__car', players_cfg.main.car_sprite);
      game.load.image('enemy__car', players_cfg.enemy.car_sprite);
    },
    create: function createStage() {
      var start_x = 0;
      var main_player_y = 377;
      var enemy_player_y = 239;
      var world = stage.config.world;
      var main_player = players_cfg.main;
      var enemy_player = players_cfg.enemy;
      var background = game.add.tileSprite(0, 0, world.width, world.height, 'stage__bg');

      controls = game.input.keyboard.createCursorKeys();
      characters.player.sprite = game.add.sprite(start_x, main_player_y, 'player__car');
      characters.enemy.sprite = game.add.sprite(start_x, enemy_player_y, 'enemy__car');

      game.stage.backgroundColor = '#dedede';
      game.time.advancedTiming = true;
      game.stage.disableVisibilityChange = true;

      game.world.setBounds(0, 0, world.width, world.height);
      game.physics.arcade.enable(characters.player.sprite);
      game.physics.arcade.enable(characters.enemy.sprite);
      game.camera.follow(characters.player.sprite);
    },
    update: function update() {
      player_pos_x = characters.player.sprite.body.x;
      stage.onUpdate(player_pos_x);
      characters.player.onUpdate(controls);
      characters.enemy.sprite.x = enemy_pos_x;
    },
    render: function render() {
      game.debug.cameraInfo(game.camera, 32, 32);
      game.debug.spriteCoords(characters.player.sprite, 32, 500);
      game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
      game.debug.text('Players: ' + [_uid, enemy_name].join(' '), 2, 120, "#00ff00");
      game.debug.text(characters.player.gearbox.current_shift.name, game_cfg.screen_width - 45, 377, "#00ff00");
    }
  });

  setInterval(function () {
    if (!!socket) {
      socket.emit('user.update', {
        x: player_pos_x,
        u: _uid,
        room: room_name
      });
    }
  }, 50);
};

window.game = new Game();