app.controller('lobbyRoomController', function($scope, $http, lobbyService) {
	$scope.hostName = lobbyService.hostName;
	$scope.opponentName = lobbyService.opponentName;

	socket.on('roomUpdate', function(opponentName) {
		console.log("room needs updating");
		lobbyService.opponentName = opponentName;
		$scope.opponentName = opponentName;
		$scope.$apply();
	});

	$scope.returnLobby = function(){
		var userID = socket.io.engine.id
		var hostID = lobbyService.sessionID;

		if(userID === hostID){
			console.log("Host wants to leave!");

			leaveRoom('host', userID, hostID);
			
			window.location.replace(location.protocol + '//' + location.host);
		}else{
			
			leaveRoom('opponent', userID, hostID);
			console.log("opponent want to leave")
			window.location.replace(location.protocol + '//' + location.host);
		}
	}



	function leaveRoom(player, userID, hostID){
		var details = {player : player, userID : userID, hostID : hostID};
		socket.emit('leaveGame', hostID);
		$http.post("/routes/leaveRoom", details)
            .success(
            function(success){
            
            })
            .error(
            function(error){
                console.log(error)
        });

	}

//Listens to any messages sent back from server 	
	socket.on('userLeft', function(data) {
	   console.log(data);
	   //Oppenent left so search for new!
	   $scope.opponentName = '';
	   $scope.$apply();
	});
});

