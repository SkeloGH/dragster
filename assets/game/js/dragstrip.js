function DragStrip(config){
  "use strict";
  var characters, game, playerCam, background,
    enemy, player, cursors, shift_text;
  var self = this;
  this.cfg = {
    screen_width: config.screen_width || window.document.body.scrollWidth,
    screen_height: config.screen_height || window.document.body.scrollHeight,
    renderer: config.renderer || Phaser.AUTO,
    element: config.element || '',
    world: {
      width: config.world.width || metersToPx(402.34),
      height: config.world.height || 512
    },
    handlers: {
      preload: preload,
      create: create,
      update: update,
      render: render
    },
  };

  self.states = {
    timer: {
      start : 0,
      finish : 0
    }
  };

  this.init = function init(){
    var cfg = self.cfg;
    game = new Phaser.Game(cfg.screen_width,
      cfg.screen_height, cfg.renderer,
      cfg.element, cfg.handlers);
  };

  function preload() {
    game.stage.backgroundColor = '#dedede';
    game.load.image('BG__dragstrip', '/assets/game/img/bg/dragstrip.png');
    game.load.image('CAR__player', '/assets/game/img/cars/phantom/car.png');
    game.load.image('CAR__enemy', '/assets/game/img/cars/phantom/car.png');
    game.time.advancedTiming = true;
    // window.addEventListener('resize', function () {
    //   game.scale.setGameSize(window.document.body.scrollWidth, window.document.body.scrollHeight);
    // });
  }

  function create() {
    var cfg = self.cfg;
    shift_text  = new Phaser.Text(game, 0, 0, 'N', {color: '#000'});
    background  = game.add.tileSprite(0, 0, cfg.world.width, cfg.world.height, 'BG__dragstrip');
    cursors     = game.input.keyboard.createCursorKeys();
    characters  = {
      'enemy': game.add.sprite(0, 239, 'CAR__enemy')
    };
    player  = new PlayerCar({
      sprite: game.add.sprite(0, 377, 'CAR__player'),
      gearbox: new Gearbox({ shifts: 6, shiftingDelay: 100 }),
      topSpeed: kmHrToPxSec(150),
      topRwdSpeed: kmHrToPxSec(-50)
    });

    game.world.setBounds(0, 0, cfg.world.width, cfg.world.height);
    game.physics.arcade.enable(player.car);
    game.camera.follow(player.car);
  }

  function update() {
    checkTiming();
    player.update(cursors);
  }

  function render(){
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player.car, 32, 500);
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
  }

  function checkTiming(){
    var cfg = self.cfg;
    var carPos, worldLimit, startTime, finishTime;
    carPos     = player.car.body.x;

    if (carPos > 0){
      (function check(){
        worldLimit = cfg.world.width;
        startTime  = self.states.timer.start;
        finishTime = self.states.timer.finish;

        if (carPos < worldLimit && !startTime && !finishTime) {
            timer('start');
        }
        if (carPos >= worldLimit && !!startTime && !finishTime) {
            timer('finish');
        }
      })();
    }
  }

  function timer(action){
    var total;
    self.states.timer[action] = Date.now();
    if (action == 'finish') {
      total = self.states.timer.finish - self.states.timer.start;
      console.log(total);
      return total;
    }
  }
}