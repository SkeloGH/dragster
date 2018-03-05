define(function(){
  require(['playercar','gearbox'], init);
  var cfg, characters, states, game, playerCam, background,
    enemy, player, cursors, shift_text;

  cfg = {
    width: window.document.body.scrollWidth,
    height: window.document.body.scrollHeight,
    renderer: Phaser.AUTO,
    element: '',
    handlers: {
      preload: preload,
      create: create,
      update: update,
      render: render
    },
    world: {
      width: metersToPx(402.34),
      height: 512
    }
  };

  states = {
    timer: {
      start : 0,
      finish : 0
    }
  };

  function init(){
    game = new Phaser.Game(cfg.width,
      cfg.height, cfg.renderer,
      cfg.element, cfg.handlers);
  }

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
    shift_text  = new Phaser.Text(game, 0, 0, 'N', {color: '#000'});
    background  = game.add.tileSprite(0, 0, cfg.world.width, cfg.world.height, 'BG__dragstrip');
    cursors     = game.input.keyboard.createCursorKeys();
    characters  = {
      'enemy': game.add.sprite(0, 239, 'CAR__enemy')
    };
    gearbox = new Gearbox({ shifts: 6, shiftingDelay: 100 });
    player  = new PlayerCar({
      sprite: game.add.sprite(0, 377, 'CAR__player'),
      gearbox: gearbox,
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

  function checkTiming(){
    var carPos, worldLimit, startTime, finishTime;
    carPos     = player.car.body.x;

    if (carPos > 0){
      (function check(){
        worldLimit = cfg.world.width;
        startTime  = states.timer.start;
        finishTime = states.timer.finish;

        if (carPos < worldLimit && !startTime && !finishTime) {
            timer('start');
        }
        if (carPos >= worldLimit && !!startTime && !finishTime) {
            timer('finish');
        }
      })();
    }
  }

  function render(){
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player.car, 32, 500);
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
  }

  function timer(action){
    var total;
    states.timer[action] = Date.now();
    if (action == 'finish') {
      total = states.timer.finish - states.timer.start;
      console.log(total);
      return total;
    }
  }

  function metersToPx(value){
    // 1m == 100px
    var meterAsPx = 1 * 100;
    return (value * meterAsPx) / 1;
  }

  function kmHrToPxSec(value){
    // 1kmh == .28ms == 28pxs
    var kmHrAsPxSec = 0.28*100;
    return (value * kmHrAsPxSec) / 1;
  }

});