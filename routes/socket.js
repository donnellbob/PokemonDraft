module.exports = function(app, io){
	io.on('connection', function(client) {  

	    client.on('initialConnection', function(data) {
	        console.log(data);
	    });

	    client.on('joinGame', function(data) {
	        client.join(data);
	        io.sockets.in(data).emit('message', 'Successfully joined room' + data);
	    });

	});

	

}