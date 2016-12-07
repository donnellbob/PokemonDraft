module.exports = function(app, io){
	io.on('connection', function(client) {  

	    client.on('initialConnection', function(data) {
	        console.log(data);
	    });

	    client.on('joinGame', function(data) {
	        client.join(data);
	        io.sockets.in(data).emit('message', 'Successfully joined room' + data);
	    });

	    client.on('leaveGame', function(data){
	    	client.leave(data);
	    	io.sockets.in(data).emit('userLeft', 'Someone has left the room you are in! :' + data);
	    });

	    client.on('startGame', function(data){
	    	io.sockets.in(data).emit('gameWasStarted', 'Host started the game! :' + data);
	    });

	    client.on('disconnect', function(data){
	    	//This does tell you a user has disconnected But I couldnt find how to leave the rooms they were in
	    	//(and then tell the rest of the room they have left)
	    	//Need to work on this again eventually it feels important
	    });






	    // Champion Select

	   	client.on('changeTurn', function(data){
	    	io.sockets.in(data.host).emit('turnChange', data);
	    });

	   	client.on('beginGame', function(data){
	    	io.sockets.in(data).emit('beginGame', data);
	    });




	   	// Game
	   	client.on('changeGameTurn', function(data){
	    	io.sockets.in(data.host).emit('turnChange', data);
	    });


	});


}