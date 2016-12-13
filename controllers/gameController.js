app.controller('gameController', function($scope, $http, lobbyService, $modal, $timeout, $interval, championService, _, championAbilities) {
	$scope.timer = 40;
	$scope.isTurn = false;
	$scope.isGameOver = false;
	$scope.pickChampionShown = false;

	$scope.yourName = "";
	$scope.theirName = "";
	$scope.yourTeam = lobbyService.yourTeam;
	$scope.theirTeam = lobbyService.theirTeam;
	$scope.playerChampion = lobbyService.playerChampion;
	$scope.opponentChampion = lobbyService.opponentChampion;



	$scope.swapChampion = function(id){
		$scope.playerChampion = $scope.yourTeam[id];
		// Update service for abilit
		lobbyService.playerChampion = $scope.playerChampion;
		// MISSING ROUND END CODE ETC ETC!!!
	}

	$scope.useAbility = function(id){
		//Makes less noise
		if($scope.isTurn === true) {
			var defender = $scope.opponentChampion;
			var attacker = $scope.playerChampion;
		}else {
			var attacker = $scope.opponentChampion;
			var defender = $scope.playerChampion;
		}
		// Spend cost for ability!
		attacker.cost -= attacker.abilities[id].cost;

		if(attacker.abilities[id].special === false) {
			championAbilities["basicAttack"]($scope.isTurn, id);
		} else {
			championAbilities[attacker.abilities[id].special]($scope.isTurn);
		}
	}


	$scope.changeTurns = function(id) {
		// FIX HOST ADDRESS ITS HIGHLY IMPORTANT!!!!
		details = {
			abilityId : id,
			host : socket.io.engine.id
			// host : lobbyService.sessionID
		}
		socket.emit('changeGameTurn', details);
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
		}else{
			$scope.isTurn = false;
			$scope.yourName = lobbyService.opponentName;
			$scope.theirName = lobbyService.hostName;
		}

		$scope.yourTeam = lobbyService.yourTeam;
		$scope.theirTeam = lobbyService.theirTeam;

		$scope.openPickChampionModal();
	});

	$scope.selectChampion = function(id){
		 $scope.modalInstance.dismiss();
		// FIX HOST IT IS VERY IMPORTANT
		details = {
			playerChampionId : id,
			host : socket.io.engine.id,
			sender : socket.io.engine.id,
			// host : lobbyService.sessionID
		}
		$scope.pickChampionShown = false;
		socket.emit('selectChampion', details);
	}

	$scope.openPickChampionModal = function(item) {
		$scope.pickChampionShown = true;
        $scope.modalInstance = $modal.open({
            templateUrl : 'views/pickChampion.html',
            backdrop : 'static',
           	scope : $scope
        });



    }

	// Socket listeners
	socket.on('gameTurnChange', function(data){
		$scope.timer = 40;
		//Means player just took turn
		$scope.useAbility(data.abilityId);

		if($scope.isTurn === true){
			$scope.isTurn = false;
		}else {
			$scope.isTurn = true;
		}

		if($scope.playerChampion.health <= 0){
			if($scope.pickChampionShown === false){
				$scope.openPickChampionModal();
			}
		}
		
		removeStatusEffects();


	});

	socket.on('selectChampion', function(data){
		$scope.timer = 40;
		//Means player just took turn
		if(data.sender === socket.io.engine.id) {
			$scope.playerChampion = $scope.yourTeam[data.playerChampionId];
			// $scope.playerChampion = $scope.yourTeam[0];
			lobbyService.playerChampion  = $scope.playerChampion;
		}else {
			$scope.opponentChampion = $scope.theirTeam[data.playerChampionId];
			// $scope.opponentChampion = $scope.theirTeam[0];
			lobbyService.opponentChampion = $scope.opponentChampion;
		}

		if($scope.playerChampion.speed > $scope.opponentChampion.speed){
			$scope.isTurn = true;
		} else {
			$scope.isTurn = false;
		}

	});


	var removeStatusEffects = function () {
		//////// Removed status effects /////////////
		
		//// Unattackable remove! ////
		if (_.contains($scope.playerChampion.defenseStatus, "unattackable") && $scope.isTurn === true) { 
			console.log("Removing players unattackable status");
			$scope.playerChampion.defenseBonus -= 1;
			$scope.playerChampion.defenseStatus = _.without($scope.playerChampion.defenseStatus, "unattackable");
		}
		if (_.contains($scope.opponentChampion.defenseStatus, "unattackable") && $scope.isTurn === false) { 
			console.log("Removing opponents unattackable status");
			$scope.opponentChampion.defenseBonus -= 1;
			$scope.opponentChampion.defenseStatus = _.without($scope.opponentChampion.defenseStatus, "unattackable");
		}

		//// Blind Remove ////
		if(_.contains($scope.opponentChampion.attackStatus, "blind") && $scope.isTurn === true) {
			console.log("Removing opponents blind effect!");
			var attackStatusCount = _.countBy($scope.opponentChampion.attackStatus);
			//Re adds attack boosts
			if(attackStatusCount.attackBoost != undefined) { 
				$scope.opponentChampion.attackBonus += 1 + (0.25 * attackStatusCount.attackBoost);
			} else {
				$scope.opponentChampion.attackBonus += 1;
			}
			$scope.opponentChampion.attackStatus = _.without($scope.opponentChampion.attackStatus, "blind");
		}
		if(_.contains($scope.playerChampion.attackStatus, "blind") && $scope.isTurn === false) {
			console.log("Removing players blind effect!");
			//Re adds attack boosts
			if(attackStatusCount.attackBoost != undefined) { 
				$scope.opponentChampion.attackBonus += 1 + (0.25 * attackStatusCount.attackBoost);
			} else {
				$scope.opponentChampion.attackBonus += 1;
			}
			$scope.playerChampion.attackStatus = _.without($scope.playerChampion.attackStatus, "blind");
		}

		//// Defense Boost ////
		if(_.contains($scope.playerChampion.defenseStatus, "defenseBoost") && $scope.isTurn === true){
			var defenseBoost = _.findWhere($scope.playerChampion.defenseStatus, "defenseBoost");
			$scope.playerChampion.defenseStatus.splice(_.indexOf($scope.playerChampion.defenseStatus, defenseBoost), 1)
			//Check if that was last boost if so remove bonus
			if(_.contains($scope.playerChampion.defenseStatus, "defenseBoost") == false) {
				$scope.playerChampion.defenseBonus -= 0.25;
			}
		} 
		if(_.contains($scope.opponentChampion.defenseStatus, "defenseBoost") && $scope.isTurn === false){
			var defenseBoost = _.findWhere($scope.opponentChampion.defenseStatus, "defenseBoost");
			$scope.opponentChampion.defenseStatus.splice(_.indexOf($scope.opponentChampion.defenseStatus, defenseBoost), 1)
			//Check if that was last boost if so remove bonus
			if(_.contains($scope.opponentChampion.defenseStatus, "defenseBoost") == false) {
				$scope.opponentChampion.defenseBonus -= 0.25;
			}
		} 

	}


});

