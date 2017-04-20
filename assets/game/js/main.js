// var dragstrip = require('dragstrip');
// require.config({
//     paths: {
//         dragstrip: 'dragstrip'
//     }
// });

// contents of other.js:

// This code might be called before the require.config() in main.js
// has executed. When that happens, require.js will attempt to
// load 'scripts/foo.js' instead of 'scripts/libs/foo-1.1.3.js'
require(['dragstrip'], function(game) {
  game.init();
});