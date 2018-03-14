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
    leave(uid, socket);
  });

  socket.on('user.update', function(data){
    io.to(data.room).emit('user.update', data);
  });

  console.log({matched: matched.length, waiting: waiting.length});
});

const join = (uid, socket)=>{
  let room = {};

  if (waiting.length > 0) {
    room = waiting.pop();
    room.users.push(uid);
    matched.push(room);
    waiting = [];
  }else{
    room.name = matched.length + 1;
    room.users = [uid];
    waiting.push(room);
  }

  socket.join(room.name);
  io.to(room.name).emit('user.joined', {id: uid, room: room.name});
};

const leave = (uid, socket) => {
  // - Looks for the room with the given uid (inneficient lookup for now).
  matched.forEach(function(match_room, room_idx){
    let user_in_room = match_room.users.some(function(user){
      return (user == uid);
    });

    if (user_in_room) {
      io.to(match_room.name).emit('user.disconnected');
      matched.splice(room_idx, 1);
    }
  });
};