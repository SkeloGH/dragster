define("main", ['dragstrip', 'utils', 'playercar','gearbox'], function(){
  "use strict";
  var cfg, stage;
  cfg = {
    screen_width: window.document.body.scrollWidth,
    screen_height: window.document.body.scrollHeight,
    renderer: Phaser.AUTO,
    element: '',
    world: {
      width: metersToPx(402.34),
      height: 512,
      stage_bg: '/assets/game/img/bg/dragstrip.png'
    },
    players: {
      main: {
        car: '/assets/game/img/cars/phantom/car.png'
      },
      enemy: {
        car: '/assets/game/img/cars/phantom/car.png'
      }
    }
  };

  stage = new DragStrip(cfg);
});