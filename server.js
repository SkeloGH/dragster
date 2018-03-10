/*jshint esversion: 6*/
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const http_port = process.env.PORT || 3000;

app.use('/', express.static('root'));
app.use('/', express.static('views'));
app.use('/assets', express.static('assets'));
app.use('/dist', express.static('dist'));

// app.listen(http_port, function () {
//   console.log('http://127.0.0.1:'+http_port);
// });
http.listen(http_port, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('user.joined', function(msg){
    console.log('message: ' + msg);
    io.emit('user.joined', { for: 'everyone' });
  });
});
