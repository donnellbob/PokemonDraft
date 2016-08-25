module.exports = function(app, io){
	
	io.on('connection', function(client){
		client.on('sendMessage', function(message, sessionID){
			//broad casts to all including sender
			// io.sockets.in(sessionID).emit('recieveMessage', message);

			//broadcasts to all except sender i think?
			client.broadcast.to(sessionID).emit('recieveMessage', message);

			console.log("Attempting to send message  +  : " + sessionID + " : " + message);
		});
	});

}