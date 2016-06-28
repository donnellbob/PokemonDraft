module.exports = function(app, io){

	io.on('connection', function(client) {  
	    console.log('Client connected...');

	    client.on('initialConnection', function(data) {
	        console.log(data);
	    });

	    client.on('joinGame', function(data) {
	        console.log(data);
	        client.join(data);
	        io.sockets.in('1').emit('message', 'Successfully joined room');
	    });

	    io.sockets.in(1).emit('message', 'anyone in this room yet?');
	    io.sockets.in('foobar').emit('message', 'anyone in this room yet?');

	});

}