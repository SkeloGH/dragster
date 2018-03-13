/*jshint esversion: 6*/
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const http_port = process.env.PORT || 3000;

let DEBUG   = {};
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
});

const join = (uid, socket)=>{
  let room = {};

  DBUG = DEBUG.join_fn = {};
  DBUG.waiting = JSON.stringify(waiting);

  if (waiting.length > 0) {
    waiting.reverse();
    room = waiting.pop();
    waiting.reverse();
    room.users.push(uid);
    matched.push(room);
  }else{
    room.name = Date.now();
    room.users = [uid];
    waiting.push(room);
  }

  socket.join(room.name);
  io.to(room.name).emit('user.joined', {id: uid, room: room.name});

  DBUG.matched = JSON.stringify(matched);
  DBUG.uid = uid;
  DBUG.room = JSON.stringify(room);
  console.log('[DBUG] '+JSON.stringify(DBUG));
  delete DEBUG.join_fn;
};

const leave = (uid, socket) => {
  // - Looks for the room with the given uid (inneficient lookup for now).
  DBUG = DEBUG.leave_fn = {};
  DBUG.u = uid;

  matched.forEach(function(match_room, room_idx){
    match_room.users.forEach(function(user, usr_idx){
      let room_users = match_room.users;

      if(user == uid){
        // - Removes the user from the room.
        room_users.splice(usr_idx, 1);

        // - If a player has not left
        if (room_users.length > 0) {
          // - Moves the room back to the waiting queue.
          waiting.push(match_room);
          matched.splice(room_idx, 1);

          io.to(match_room.name).emit('user.disconnected',{uid: uid});

          DBUG.f = match_room.name;
        }
      }
    });
  });

  DBUG.w = waiting;
  DBUG.m = matched;
  console.log('[DBUG] '+JSON.stringify(DBUG));
  delete DEBUG.leave_fn;
};