module.exports = function(app, io, _, passwordhasher){

	//Testing values
	var hostedGames = [
	{name: "Greg", hostName: "George", players: 2, private: "No", id: '1', opponentName : ""}, 
	{name: "Cool Game", hostName: "Jim", players: 1, private: "Yes", id: '2', opponentName : "", password : passwordhasher.createHash('ssha512', 'alice', new Buffer('83d88386463f0625', 'hex')},
	{name: "Fun Game", hostName: "Tim", players: 1, private: "No", id: '3', opponentName : ""},
	{name: "Crazy Game", hostName: "Old'greg", players: 2, private: "Yes", id: '4', opponentName : "", password : passwordhasher.createHash('ssha512', 'alice', new Buffer('83d88386463f0625', 'hex')},
	{name: "Interesting Game", hostName: "Jay", players: 1, private: "Yes", id: '5', opponentName : "", password : passwordhasher.createHash('ssha512', 'alice', new Buffer('83d88386463f0625', 'hex'))}
	];

	// Returns server list
	app.get("/routes/serverTable", function(req, res){
		res.send(hostedGames);
	});

	//Adds new server to list
	app.post("/routes/serverTableUpdate", function(req, res){
		if(req.body.password != undefined){
			var protectedGame = req.body;
			var encryptedPassword = passwordhasher.createHash('ssha512', req.body.password, new Buffer('83d88386463f0625', 'hex'));
			protectedGame.password = encryptedPassword.hash;
			protectedGame.private = "Yes";
			hostedGames.push(protectedGame);
		}else{
			hostedGames.push(req.body);
		}
	});

	app.post("/routes/updateRoomDetails", function(req, res){
		var room = _.findWhere(hostedGames, {id : req.body.id});
		if(room.players > 1){
			res.send({hostName : room.hostName, roomHasSpace : false});
		}else{
			if(room.private === "No"){
				room.opponentName = req.body.opponentName;
				room.players += 1;
				io.sockets.in(req.body.id).emit('roomUpdate', room.opponentName);

				res.send({hostName : room.hostName, roomHasSpace : true, roomIsPrivate : room.private});
			}else{
				if(req.body.password === undefined){
					res.send({hostName : room.hostName, roomHasSpace : true, roomIsPrivate : room.private});
				}else{
					var encryptEnteredPassword = passwordhasher.createHash('ssha512', req.body.password, new Buffer('83d88386463f0625', 'hex'));
					
					if(encryptEnteredPassword.hash.equals(room.password)){
						res.send({hostName : room.hostName, roomHasSpace : true, roomIsPrivate : room.private});
					}else{
						res.send({hostName : room.hostName, roomHasSpace : false, roomIsPrivate : room.private, passwordCheck: false});
					}

				}
			}
		}


	});

}