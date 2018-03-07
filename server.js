var express = require('express');
var app = express();

app.use('/', express.static('root'));
app.use('/', express.static('views'));
app.use('/assets', express.static('assets'));

app.listen(3000, function () {
  console.log('http://127.0.0.1:3000');
});