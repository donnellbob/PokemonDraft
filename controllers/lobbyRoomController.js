app.controller('lobbyRoomController', function($scope, $http, lobbyService) {
	$scope.hostName = lobbyService.hostName;
	$scope.opponentName = lobbyService.opponentName;

	socket.on('roomUpdate', function(opponentName) {
		console.log("room needs updating");
		lobbyService.opponentName = opponentName;
		$scope.opponentName = opponentName;
		$scope.$apply();
	});
});

