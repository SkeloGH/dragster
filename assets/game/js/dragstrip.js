function DragStrip(config){
  "use strict";
  var self        = this;
  this.u_cfg      = config;
  this.game       = null;
  this.cursors    = null;
  this.characters = {};
  this.player     = null;
  this.states     = {};
  this.cfg        = {};

  this.init = function init(){
    var u_cfg = self.u_cfg;
    self.cfg   = {
      screen_width: u_cfg.screen_width || 800,
      screen_height: u_cfg.screen_height || 600,
      renderer: u_cfg.renderer || Phaser.AUTO,
      element: u_cfg.element || '',
      world: {
        width: u_cfg.world.width || metersToPx(402.34),
        height: u_cfg.world.height || 512
      },
      handlers: {
        preload: self.preload,
        create: self.create,
        update: self.update,
        render: self.render
      },
    };
    self.states = {
      timer: {
        start : 0,
        finish : 0
      }
    };
    self.game = new Phaser.Game(self.cfg.screen_width,
      self.cfg.screen_height, self.cfg.renderer,
      self.cfg.element, self.cfg.handlers);
  };

  this.preload = function preload() {
    self.game.stage.backgroundColor = '#dedede';
    self.game.load.image('BG__dragstrip', '/assets/game/img/bg/dragstrip.png');
    self.game.load.image('CAR__player', '/assets/game/img/cars/phantom/car.png');
    self.game.load.image('CAR__enemy', '/assets/game/img/cars/phantom/car.png');
    self.game.time.advancedTiming = true;
    // window.addEventListener('resize', function () {
    //   game.scale.setGameSize(window.document.body.scrollWidth, window.document.body.scrollHeight);
    // });
  };

  this.create = function create() {
    var cfg         = self.cfg;
    var shift_text  = new Phaser.Text(self.game, 0, 0, 'N', {color: '#000'});
    var background  = self.game.add.tileSprite(0, 0, cfg.world.width, cfg.world.height, 'BG__dragstrip');
    self.cursors    = self.game.input.keyboard.createCursorKeys();
    self.characters = {
      'enemy': self.game.add.sprite(0, 239, 'CAR__enemy')
    };
    self.player  = new PlayerCar({
      sprite: self.game.add.sprite(0, 377, 'CAR__player'),
      gearbox: new Gearbox({ shifts: 6, shiftingDelay: 100 }),
      topSpeed: kmHrToPxSec(150),
      topRwdSpeed: kmHrToPxSec(-50)
    });

    self.game.world.setBounds(0, 0, cfg.world.width, cfg.world.height);
    self.game.physics.arcade.enable(self.player.car);
    self.game.camera.follow(self.player.car);
  };

  this.update = function update() {
    self.checkTiming();
    self.player.update(self.cursors);
  };

  this.render = function render(){
    self.game.debug.cameraInfo(self.game.camera, 32, 32);
    self.game.debug.spriteCoords(self.player.car, 32, 500);
    self.game.debug.text(self.game.time.fps || '--', 2, 14, "#00ff00");
  };

  this.checkTiming = function checkTiming(){
    var carPos, worldLimit, startTime, finishTime, shouldCount, hasStarted, hasFinished;
    carPos     = self.player.car.body.x;
    worldLimit = self.cfg.world.width;
    startTime  = self.states.timer.start;
    finishTime = self.states.timer.finish;
    hasStarted = carPos < worldLimit && !startTime && !finishTime;
    hasFinished = carPos >= worldLimit && !!startTime && !finishTime;
    shouldCount = carPos > 0 || startTime > 0;

    if (shouldCount){
      if (hasStarted) {
        self.timer('start');
      }
      if (hasFinished) {
        self.timer('finish');
      }
    }
  };

  this.timer = function timer(action){
    var total;
    self.states.timer[action] = Date.now();
    if (action == 'finish') {
      total = self.states.timer.finish - self.states.timer.start;
      console.log(total);
      return total;
    }
  };

  return this;
}