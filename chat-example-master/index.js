var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sockets = {};
var users = [];
var messages = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log("connected");
	
  	socket.on('login', function(userobj){
  		console.log(userobj);
    	sockets[userobj["name"]] = socket;
      console.log("User==",users.indexOf(userobj["name"]));

      if (users.indexOf(userobj["name"]) == -1) {
        users[users.length] = userobj["name"];
        io.emit("logged in", users);
      }
  	});


    socket.on('logout', function(msgpacket){
      users.splice(users.indexOf(msgpacket["name"]),1);
      delete users[msgpacket["name"]];
      console.log(users);
    });

  	// message packet: {sourceUser: "", destinationUser: "", messageBody: ""}

  	socket.on('message', function(msgpacket){
      console.log(msgpacket);
      io.emit("message", msgpacket);
  	});


});

http.listen(3000, function(){
  console.log('listening on *:5000');
});
