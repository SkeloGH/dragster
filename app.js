var express = require('express');
var app = express();

app.use('/', express.static('root'));
app.use('/', express.static('views'));
app.use('/assets', express.static('assets'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});