app.factory('lobbyService', function(championService){
	return {
		sessionID : 'null',
		hostName : '',
		opponentName : '',
		yourTeam : [ 	
		championService.champions[0],
		championService.champions[1],
		championService.champions[2],
		championService.champions[3],
		championService.champions[4]
		],
		theirTeam : [
		championService.champions[5],
		championService.champions[6],
		championService.champions[7],
		championService.champions[8],
		championService.champions[9]
		],
		playerChampion : championService.champions[0],
		opponentChampion : championService.champions[5]
	};
});