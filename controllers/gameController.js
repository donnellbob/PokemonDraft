app.controller('gameController', function($scope, $http, lobbyService, $interval, championService, _) {
	$scope.timer = 40;
	$scope.isTurn = false;
	$scope.isGameOver = false;
	var typeCounterDamage = 1.25;
	//Hard coded values for testing!!!!
	$scope.yourName = "Jimmy P1";
	$scope.theirName = "Jerry P2";
	$scope.yourTeam = [
		championService.champions[0],
		championService.champions[1],
		championService.champions[2],
		championService.champions[3],
		championService.champions[4]
		];
	$scope.theirTeam = [
		championService.champions[5],
		championService.champions[6],
		championService.champions[7],
		championService.champions[8],
		championService.champions[9]
		];
	$scope.playerChampion = $scope.yourTeam[0];
	$scope.opponentChampion = $scope.theirTeam[0];
	//END OF HARD CODE!


	$scope.swapChampion = function(id){
		$scope.playerChampion = $scope.yourTeam[id];
		// MISSING ROUND END CODE ETC ETC!!!
	}

	$scope.useAbility = function(id){
		//Makes less noise
		var opponent = $scope.opponentChampion;
		var player = $scope.playerChampion;
		var damage = 0;

		if(player.abilities[id].special === false) {
			// IF ability is type counter
			if(checkCounter(player.abilities[id].type, opponent.type) === true) {
				damage = ((player.abilities[id].damage * typeCounterDamage) * player.attackBonus);	
			} else {
				damage = (player.abilities[id].damage * player.attackBonus);
			}

			//Check if opponent has defense else attack
			if(opponent.defenseBonus != 0){
				opponent.health -= (damage - (damage * opponent.defenseBonus));
			} else { 
				opponent.health -= damage;
			}
		} else {
			//objectName.[effect]
		}
		console.log("Damage: " +  damage);
		$scope.changeTurns();
	}


	$scope.changeTurns = function() {
		// FIX HOST ADDRESS ITS HIGHLY IMPORTANT!!!!
		details = {
			playerChampion : $scope.playerChampion, 
			opponentChampion : $scope.opponentChampion,
			yourTeam : $scope.yourTeam,
			theirTeam : $scope.theirTeam,
			host : socket.io.engine.id
			// host : lobbyService.sessionID
		}
		socket.emit('changeGameTurn', details);
	}

	function checkCounter(attackType, defenseType){
		if(attackType === "fire" && defenseType === "earth") {
			return true;
		} else if (attackType === "water" && defenseType === "fire") {
			return true;
		} else if (attackType === "earth" && defenseType === "water") {
			return true;
		} else {
			return false;
		}

	}

	$interval(function(){
		$scope.timer--;
		if($scope.timer === 0 && $scope.isGameOver === true){
			console.log("Game is over so handle it!");
		}else if($scope.timer === 0 && $scope.isGameOver === false && $scope.isTurn === true){
			$scope.changeTurns();
		}

	},1000,0);


	$scope.$on('$routeChangeSuccess', function(){
		//Check who takes first turn on route load (host takes first turn)
		if(socket.io.engine.id === lobbyService.sessionID){
			$scope.isTurn = true;
			$scope.yourName = lobbyService.hostName;
			$scope.theirName = lobbyService.opponentName;
			document.getElementById("yourName").style.background = "#FF8800";
		}else{
			$scope.isTurn = false;
			$scope.yourName = lobbyService.opponentName;
			$scope.theirName = lobbyService.hostName;
			document.getElementById("theirName").style.background = "#FF8800";
		}
	});

	// Socket listeners
	socket.on('turnChange', function(data){
		$scope.timer = 40;
		//Means player just took turn
		if($scope.isTurn === true) { 
			$scope.isTurn = false;
		}else {
			$scope.yourTeam = data.theirTeam;
			$scope.theirTeam = data.yourTeam;
			$scope.opponentChampion = data.playerChampion;
			$scope.playerChampion = data.opponentChampion;
			$scope.isTurn = true;
		}
		console.log(data);

	});

});

