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

function preload() {
  game.load.image('BG__dragstrip', 'assets/bg/dragstrip.png');
  game.load.image('CAR__player', 'assets/cars/phantom/car.png');
  game.load.image('CAR__enemy', 'assets/cars/phantom/car.png');
}

function create() {
  game.add.sprite(0, 0, 'BG__dragstrip');
  enemy = game.add.sprite(0, 239, 'CAR__enemy');
  player = game.add.sprite(0, 377, 'CAR__player');
  game.physics.arcade.enable(player);


  cursors = game.input.keyboard.createCursorKeys();


  console.log('create');
}

function update() {
  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.up.isDown){
      //  Move to the left
      player.body.velocity.x = 150;

      player.animations.play('left');
  }else if (cursors.down.isDown){
      //  Move to the right
      player.body.velocity.x = -150;

      player.animations.play('right');
  }else{
      //  Stand still
      player.animations.stop();
      // player.frame = 4;
  }
  console.log('update');
}