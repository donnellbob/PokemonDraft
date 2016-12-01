app.controller('gameController', function($scope, $http, lobbyService, $interval, championService, _) {
	$scope.timer = 40;

	$scope.test = function(){
		console.log("Test button hit");
	}
});

