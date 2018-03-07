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
      height: 512
    }
  };

  stage = new DragStrip(cfg);
  stage.init();
});