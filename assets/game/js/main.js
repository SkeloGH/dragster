"use strict"
/*jshint esversion:6 */
/*jshint browser:true */
/*jshint asi:true */
import {Utils} from './utils.js'
import {DragStrip} from './dragstrip.js'
import {PlayerCar} from './playercar.js'
import {Gearbox} from './gearbox.js'

class Game{
  constructor(io){
    this.io_api   = io
    this.controls = null
    this.wsocket  = null
    this.cfg = {
      screen_width: window.document.body.scrollWidth,
      screen_height: window.document.body.scrollHeight,
      renderer: Phaser.AUTO,
      element: '',
      players: {
        main: {
          car_sprite: '/assets/game/img/cars/phantom/car.png',
          max_gears: 6,
          max_speed: Utils.kmHrToPxSec(150)
        },
        enemy: {
          car_sprite: '/assets/game/img/cars/phantom/car.png',
          max_gears: 6,
          max_speed: Utils.kmHrToPxSec(150),
        }
      }
    }

    this.stage = new DragStrip({
      world: {
        width: Utils.metersToPx(402.34),
        height: 512,
        background: '/assets/game/img/bg/dragstrip.png'
      }
    })

    this.characters = {
      player: new PlayerCar({
        position_x: 0,
        name: (''+Date.now()).slice(9, 13),
        gearbox: new Gearbox({
          max_gears: this.cfg.players.main.max_gears,
          shifting_delay: 100
        }),
        max_speed: this.cfg.players.main.max_speed
      }),
      enemy: new PlayerCar({
        position_x: 0,
        name: '',
        gearbox: new Gearbox({
          max_gears: this.cfg.players.enemy.max_gears,
          shifting_delay: 100
        }),
        max_speed: this.cfg.players.enemy.max_speed
      })
    }
  }

  start(){
    this.game = new Phaser.Game(
      this.cfg.screen_width,
      this.cfg.screen_height,
      this.cfg.renderer,
      this.cfg.element,
      {
        preload: function preload() {
          this.game.load.image('stage__bg', this.stage.config.world.background)
          this.game.load.image('player__car', this.cfg.players.main.car_sprite)
          this.game.load.image('enemy__car', this.cfg.players.enemy.car_sprite)
        }.bind(this),

        create: function createStage() {
          let start_x        = 0
          let main_player_y  = 377
          let enemy_player_y = 239
          let world          = this.stage.config.world
          let main_player    = this.cfg.players.main
          let enemy_player   = this.cfg.players.enemy
          let background     = this.game.add.tileSprite(0, 0, world.width, world.height, 'stage__bg')

          this.controls                 = this.game.input.keyboard.createCursorKeys()
          this.characters.player.sprite = this.game.add.sprite(start_x, main_player_y, 'player__car')
          this.characters.enemy.sprite  = this.game.add.sprite(start_x, enemy_player_y, 'enemy__car')

          this.game.stage.backgroundColor = '#dedede'
          this.game.time.advancedTiming   = true
          this.game.stage.disableVisibilityChange = true

          this.game.world.setBounds(0, 0, world.width, world.height)
          this.game.physics.arcade.enable(this.characters.player.sprite)
          this.game.physics.arcade.enable(this.characters.enemy.sprite)
          this.game.camera.follow(this.characters.player.sprite)
        }.bind(this),

        update: function update() {
          this.characters.player.position_x = this.characters.player.sprite.body.x
          this.stage.onUpdate(this.characters.player.position_x)
          this.characters.player.onUpdate(this.controls)
          this.characters.enemy.sprite.x = this.characters.enemy.position_x
        }.bind(this),

        render: function render(){
          this.game.debug.cameraInfo(this.game.camera, 32, 32)
          this.game.debug.spriteCoords(this.characters.player.sprite, 32, 500)
          this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00")
          this.game.debug.text('Players: '+([this.characters.player.name, this.characters.enemy.name].join(' ')), 2, 120, "#00ff00")
          this.game.debug.text(this.characters.player.gearbox.current_shift.name,
            this.cfg.screen_width-45,
            377,
            "#00ff00")
        }.bind(this)
      }
    )

    return this
  }

  connect(){

    this.wsocket = this.io_api(undefined, {
      query: {
        uid: this.characters.player.name
      }
    });

    this.wsocket.on('user.joined', function(data){
      this.room_name  = data.room;
      if (data.id != this.characters.player.name) {
        this.characters.enemy.name = data.id;
      }
    }.bind(this));

    this.wsocket.on('user.update', function(data){
      if (data.u != this.characters.player.name) {
        this.characters.enemy.name = data.u;
        this.characters.enemy.position_x = data.x;
      }
    }.bind(this));

    this.wsocket.on('user.disconnected', function(){
      window.location.reload();
    }.bind(this));

    return this
  }

  broadcastLoop(fps){
    let fps_to_itvl = (1000/60)*fps

    setInterval(function(){
      if (!!this.wsocket) {
        this.wsocket.emit('user.update', {
          x: this.characters.player.position_x,
          u: this.characters.player.name,
          room: this.room_name
        })
      }
    }.bind(this), fps_to_itvl)

    return this
  }
}

let io     = window.io
let Phaser = window.Phaser
window.App = new Game(io).connect().broadcastLoop(30).start()
