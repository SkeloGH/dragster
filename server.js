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
  socket.on('user.update', function(data){
    io.to(data.room).emit('user.update', data);
  });
});

const join = (uid, socket)=>{
  let room = {};
  let DEBUG = {};
  DEBUG['waiting'] = JSON.stringify(waiting);
  DEBUG['matched'] = JSON.stringify(matched);
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
  DEBUG['uid'] = uid;
  DEBUG['room'] = JSON.stringify(room);
  DEBUG['users'] = room.users;
  console.log('[DEBUG] '+JSON.stringify(DEBUG));
};

const leave = (uid) => {
  // - Looks for the room with the given uid (inneficient lookup for now).
  // - Removes the user from the room.
  // - Moves the room back to the waiting queue.
  matched.forEach(function(match_room, room_idx){
    match_room.users.forEach(function(user, usr_idx, source){

      if(user == uid){
        source.splice(usr_idx, 1);
        if (source.length > 0) {
          waiting.push(match_room);
          matched.splice(room_idx, 1);
          io.to(match_room.name).emit('user.disconnected',{uid: uid});
        }
      }
    });
  });
};