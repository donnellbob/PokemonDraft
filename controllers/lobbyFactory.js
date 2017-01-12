app.factory('lobbyService', function(championService){
	return {
		sessionID : 'null',
		hostName : 'Test name ',
		opponentName : 'Other test name',
		yourTeam : [],
		theirTeam : [],
		playerChampion : {},
		opponentChampion : {}
		// yourTeam : [
		// championService.champions[0],
		// championService.champions[1],
		// championService.champions[9],
		// championService.champions[7],
		// championService.champions[6]
		// ],
		// theirTeam : [
		// championService.champions[5],
		// championService.champions[4],
		// championService.champions[3],
		// championService.champions[8],
		// championService.champions[2]
		// ],
		// // Bellow is missing {}
		// playerChampion : championService.champions[3],
		// opponentChampion : championService.champions[5]
	};
});