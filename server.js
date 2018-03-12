/*jshint esversion: 6*/
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const http_port = process.env.PORT || 3000;

let waiting = [];
let matched = [];

app.use('/', express.static('root'));
app.use('/', express.static('views'));
app.use('/assets', express.static('assets'));
app.use('/dist', express.static('dist'));


http.listen(http_port, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  let uid = socket.handshake.query.uid;

  join(uid, socket);

  socket.on('disconnect', function(){
    leave(uid);
  });
});

const join = (uid, socket)=>{
  let room = {};

  if (waiting.length > 0) {
    room = waiting.pop();
    room.users.push(uid);
    matched.push(room);
  }else{
    room.name = Date.now();
    room.users = [uid];
    waiting.push(room);
  }

  socket.join(room.name);
  io.to(room.name).emit('user.joined', {id: uid, room: room.name});
  console.log(uid+' user connected');
};

const leave = (uid) => {
  matched.forEach(function(match_room, room_idx){
    match_room.users.forEach(function(user, usr_idx, source){
      console.log(user, uid);
      if(user == uid){
        source.splice(usr_idx, 1);
        if (source.length > 0) {
          waiting.push(match_room);
          matched.splice(room_idx, 1);
        }
      }
    });
  });

  console.log(uid+' user disconnected');
  console.log(matched);
  console.log(waiting);
};