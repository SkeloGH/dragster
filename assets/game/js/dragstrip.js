function DragStrip(config){
  "use strict";
  var self        = this;
  this.cursors    = null;
  this.characters = {};
  this.player     = null;
  this.states     = {};
  this.cfg        = {
    screen_width: config.screen_width,
    screen_height: config.screen_height,
    renderer: config.renderer,
    element: config.element || '',
    world: {
      width: config.world.width,
      height: config.world.height,
      stage_bg: config.world.stage_bg
    },
    players: {
      main: {
        car: config.players.main.car
      },
      enemy: {
        car: config.players.enemy.car
      }
    },
    handlers: {
      preload: preload,
      create: create,
      update: update,
      render: render
    }
  };

  this.states = {
    timer: {
      start : 0,
      finish : 0
    }
  };

  this.game = new Phaser.Game(this.cfg.screen_width,
    this.cfg.screen_height, this.cfg.renderer,
    this.cfg.element, this.cfg.handlers);

  function preload() {
    self.game.stage.backgroundColor = '#dedede';
    self.game.load.image('stage__bg', self.cfg.world.stage_bg);
    self.game.load.image('player__car', self.cfg.players.main.car);
    self.game.load.image('enemy__car', self.cfg.players.enemy.car);
    self.game.time.advancedTiming = true;
  }

  function create() {
    var cfg         = self.cfg;
    var shift_text  = new Phaser.Text(self.game, 0, 0, 'N', {color: '#000'});
    var background  = self.game.add.tileSprite(0, 0, cfg.world.width, cfg.world.height, 'stage__bg');
    self.cursors    = self.game.input.keyboard.createCursorKeys();
    self.characters = {
      'enemy': self.game.add.sprite(0, 239, 'enemy__car')
    };
    self.player  = new PlayerCar({
      sprite: self.game.add.sprite(0, 377, 'player__car'),
      gearbox: new Gearbox({ shifts: 6, shiftingDelay: 100 }),
      topSpeed: kmHrToPxSec(150),
      topRwdSpeed: kmHrToPxSec(-50)
    });

    self.game.world.setBounds(0, 0, cfg.world.width, cfg.world.height);
    self.game.physics.arcade.enable(self.player.car);
    self.game.camera.follow(self.player.car);
  }

  function update() {
    self.checkTiming();
    self.player.update(self.cursors);
  }

  function render(){
    self.game.debug.cameraInfo(self.game.camera, 32, 32);
    self.game.debug.spriteCoords(self.player.car, 32, 500);
    self.game.debug.text(self.game.time.fps || '--', 2, 14, "#00ff00");
  }

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