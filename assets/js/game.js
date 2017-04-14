var config = {
  width: 512,
  height: 512,
  renderer: Phaser.AUTO,
  element: '',
  handlers: {
    preload: preload,
    create: create,
    update: update
  }
};
var game = new Phaser.Game(config.width,
  config.height, config.renderer,
  config.element, config.handlers);
var camera, background, enemy, player, cursors, car_speed;

function preload() {
  game.load.image('BG__dragstrip', 'assets/bg/dragstrip.png');
  game.load.image('CAR__player', 'assets/cars/phantom/car.png');
  game.load.image('CAR__enemy', 'assets/cars/phantom/car.png');
}

function create() {
  camera = new Phaser.Camera(game, null, 0, 0, config.width, config.height);
  background = game.add.sprite(0, 0, 'BG__dragstrip');
  enemy = game.add.sprite(0, 239, 'CAR__enemy');
  player = game.add.sprite(0, 377, 'CAR__player');
  cursors = game.input.keyboard.createCursorKeys();


  game.physics.arcade.enable(player);
  player.body.velocity.x = 0;
  player.body.maxVelocity.x = 500;
  camera.follow(player);

}

function update() {
  car_speed = player.body.velocity.x;
  controlKeys();
}

function controlKeys(){
  if (cursors.up.isDown){
      moveForward();
  }else if (cursors.down.isDown){
      moveBackward();
  }else{
      neutral();
  }
}

function moveForward(){
  if (car_speed < -50){
    player.body.acceleration.x = 150;
  }else{
    player.body.acceleration.x = 50;
  }
  player.animations.play('left');
}

function moveBackward(){
  if (car_speed > 50){
    player.body.acceleration.x = -150;
  }else{
    player.body.acceleration.x = -50;
  }
  player.animations.play('right');
}

function neutral(){
  player.body.acceleration.x = car_speed * -1;
  player.animations.stop();
  // player.frame = 4;
}