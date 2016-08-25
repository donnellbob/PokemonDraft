module.exports = function(app, io){

	//Testing values
	var hostedGames = [
	{name: "Greg", hostName: "George", players: 2, private: "No", id: '1'}, 
	{name: "Cool Game", hostName: "Jim", players: 1, private: "Yes", id: '2'},
	{name: "Fun Game", hostName: "Tim", players: 1, private: "No", id: '3'},
	{name: "Crazy Game", hostName: "Old'greg", players: 2, private: "Yes", id: '4'},
	{name: "Interesting Game", hostName: "Jay", players: 1, private: "Yes", id: '5'}
	];

	// Returns server list
	app.get("/routes/serverTable", function(req, res){
		res.send(hostedGames);
	});

	//Adds new server to list
	app.post("/routes/serverTableUpdate", function(req, res){
		hostedGames.push(req.body);
	});

}