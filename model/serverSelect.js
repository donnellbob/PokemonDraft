module.exports = function(app, io){

	//Testing values
	var hostedGames = [
	{name: "Greg", hostName: "George", players: 2, private: "No", id: '1'}, 
	{name: "Cool Game", hostName: "Jim", players: 1, private: "Yes", id: '2'},
	{name: "Fun Game", hostName: "Tim", players: 1, private: "No", id: '3'},
	{name: "Crazy Game", hostName: "Old'greg", players: 2, private: "Yes", id: '4'},
	{name: "Interesting Game", hostName: "Jay", players: 1, private: "Yes", id: '5'}
	];

	io.on('connection', function(client) {  
	    console.log('Client connected...');

	    client.on('initialConnection', function(data) {
	        console.log(data);
	    });

	    client.on('joinGame', function(data) {
	        client.join(data);
	        io.sockets.in(data).emit('message', 'Successfully joined room' + data);
	    });
	});


	// Returns server list
	app.get("/model/serverTable", function(req, res){
		res.send(hostedGames);
	});

	//Adds new server to list
	app.post("/model/serverTableUpdate", function(req, res){
		hostedGames.push(req.body);
	});

}