module.exports = function(app, io){

	io.on('connection', function(client) {  
	    console.log('Client connected...');

	    client.on('join', function(data) {
	        console.log(data);
	    });

	    client.on('test', function(data) {
	        console.log(data);
	    });

	});

}