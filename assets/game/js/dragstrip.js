define(function(){
  var cfg, characters, states, game, playerCam, background, enemy, player, cursors, shift_text;

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
    player: {
      // 3.59 kmh = 1 m/s
      topSpeed: kmHrToPxSec(150),//4200 px/s ->
      topRwdSpeed: kmHrToPxSec(50) * -1,
      maxAccelerationRwd: -150,
      maxShifts: 6,
      shiftWaitMs: 100
    },
    world: {
      width: metersToPx(402.34),
      height: 512
    }
  };

  states = {
    player: {
      currentShift: 0,
      _shifting: null
    },
    timer: {
      start : 0,
      finish : 0
    }
  };

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

    // window.addEventListener('resize', function () {
    //   game.scale.setGameSize(window.document.body.scrollWidth, window.document.body.scrollHeight);
    // });
  }

  function create() {
    shift_text  = new Phaser.Text(game, 0, 0, 'N', {color: '#000'});
    background  = game.add.tileSprite(0, 0, cfg.world.width, cfg.world.height, 'BG__dragstrip');
    cursors     = game.input.keyboard.createCursorKeys();
    characters  = {
      'player': game.add.sprite(0, 377, 'CAR__player'),
      'enemy': game.add.sprite(0, 239, 'CAR__enemy')
    };

    game.world.setBounds(0, 0, cfg.world.width, cfg.world.height);
    game.physics.arcade.enable(characters.player);
    game.camera.follow(characters.player);

    characters.player.body.velocity.x    = 0;
    characters.player.body.maxVelocity.x = cfg.player.topSpeed;

  }

  function update() {
    if (characters.player.body.x > 0 &&
      characters.player.body.x < cfg.world.width &&
      states.timer.start === 0 && states.timer.finish === 0) {
        timer('start');
    }
    if (characters.player.body.x >= cfg.world.width &&
      states.timer.start !== 0 && states.timer.finish === 0) {
        timer('finish');
    }
    _handleKeyPress();
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

  function render(){
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(characters.player, 32, 500);
  }

  function _handleKeyPress(){
    if (cursors.up.isDown){
      _shiftUp('player');
    }else if (cursors.down.isDown){
      _shiftDown('player');
    }else if (!cursors.up.isDown && !cursors.down.isDown){
        _neutral('player');
    }

    if (cursors.right.isDown){
        accelerate('player');
    }else if (cursors.left.isDown){
        brake('player');
    }
  }

  function getCurrentShift(targetObj){
    return states[targetObj].currentShift;
  }

  function getAcceleration(targetObj){
    var character     = characters[targetObj];
    var currentShift  = getCurrentShift(targetObj);
    var objectSpeed   = character.body.velocity.x;
    var acceleration  = 0;
    var accelRate     = cfg[targetObj].topSpeed / cfg[targetObj].maxShifts;
    var maxShiftSpeed = accelRate * currentShift;

    if (currentShift > 0 &&
      objectSpeed < cfg[targetObj].topSpeed &&
      objectSpeed <= maxShiftSpeed) {
      acceleration  = accelRate * currentShift;
    }

    if (currentShift < 0){
      if (objectSpeed >= cfg[targetObj].topRwdSpeed) {
        acceleration = cfg[targetObj].maxAccelerationRwd;
      }
    }

    return acceleration;
  }

  function accelerate(targetObj){
    var character = characters[targetObj];
    character.body.acceleration.x = getAcceleration(targetObj);
    character.animations.play('left');
  }


  function brake(targetObj){
    var character = characters[targetObj];
    var objectSpeed = character.body.velocity.x;
    var acceleration = character.body.velocity.x * -1;

    if (objectSpeed > 0 && objectSpeed < 90 ||
      objectSpeed < 0 && objectSpeed > -90) {
      acceleration = 0;
      characters.player.body.velocity.x = 0;
    }

    character.body.acceleration.x = acceleration;
    character.animations.play('right');
  }

  function _neutral(targetObj){
    var character = characters[targetObj];
    var deccel_rate = character.body.velocity.x / cfg[targetObj].maxShifts;
    character.body.acceleration.x = deccel_rate * -1;
    character.animations.stop();
    // targetObj.frame = 4;
  }

  function _shiftUp(targetObj){
    if (states[targetObj]._shifting !== null) {
      clearTimeout(states[targetObj]._shifting);
      states[targetObj]._shifting = null;
    }
    states[targetObj]._shifting = setTimeout(function(){
      if (states[targetObj].currentShift < cfg[targetObj].maxShifts) {
        states[targetObj].currentShift++;
        // console.log(shift_text);
        shift_text.textContent = ""+states[targetObj].currentShift;
      }
    }, cfg.player.shiftWaitMs);
  }

  function _shiftDown(targetObj){
    if (states[targetObj]._shifting !== null) {
      clearTimeout(states[targetObj]._shifting);
      states[targetObj]._shifting = null;
    }
    states[targetObj]._shifting = setTimeout(function(){
      if (states[targetObj].currentShift > -1) {
        states[targetObj].currentShift--;
        // console.log(shift_text);
        shift_text.textContent = states[targetObj].currentShift;
      }
    }, cfg.player.shiftWaitMs);
  }

  return {init: init};
});