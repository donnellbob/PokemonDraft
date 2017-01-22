app.controller('gameController', function($scope, $http, lobbyService, $modal, $timeout, $interval, championService, _, championAbilities, gameAnimation, combatLog) {
	$scope.timer = 40;
	$scope.isTurn = false;
	$scope.isGameOver = false;
	$scope.pickChampionShown = false;
	$scope.gameOverShown = false;
	$scope.firstChampionPicked = false;
	$scope.newRound = true;
	$scope.yourName = "";
	$scope.theirName = "";
	$scope.yourTeam = lobbyService.yourTeam;
	$scope.theirTeam = lobbyService.theirTeam;
	$scope.playerChampion = lobbyService.playerChampion;
	$scope.opponentChampion = lobbyService.opponentChampion;
	$scope.combatLog = combatLog.combatLog;

	// If opponent picks first dont show champion
	var opponentChampionPickFirst = false;

	$scope.swapChampion = function(id){
		$scope.playerChampion = $scope.yourTeam[id];
		lobbyService.playerChampion = $scope.playerChampion;
		$scope.selectChampion(id);
	
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
			// host : socket.io.engine.id
			host : lobbyService.sessionID
		}
		socket.emit('changeGameTurn', details);
	}


	$interval(function(){
		$scope.timer--;
		if($scope.isGameOver === true){
			if($scope.gameOverShown === false){
				$scope.openGameOverModal();
			}
			$scope.gameOverShown = true;
		}else if($scope.timer === 0 && $scope.isGameOver === false && $scope.isTurn === true){
			$scope.changeTurns(-1);
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
		if($scope.pickChampionShown === true){
			$scope.modalInstance.dismiss();
		}
		// FIX HOST IT IS VERY IMPORTANT
		details = {
			playerChampionId : id,
			// host : socket.io.engine.id,
			sender : socket.io.engine.id,
			host : lobbyService.sessionID
		}
		$scope.pickChampionShown = false;
		socket.emit('selectChampion', details);
	}

//// Modals ////
	$scope.openPickChampionModal = function(item) {
		$scope.pickChampionShown = true;
        $scope.modalInstance = $modal.open({
            templateUrl : 'views/pickChampion.html',
            backdrop : 'static',
           	scope : $scope
        });
    }

	$scope.openGameOverModal = function(item) {
        $scope.modalInstance = $modal.open({
            templateUrl : 'views/gameOver.html',
            backdrop : 'static',
           	scope : $scope
        });
    }

//// Socket listeners ////
	socket.on('gameTurnChange', function(data){
		$scope.timer = 40;
		//Means player just took turn
		if(data.abilityId != -1){
			$scope.useAbility(data.abilityId);
		} 

		$scope.yourTeamDeath = [];
		$scope.theirTeamDeath = [];
		//Check if game over
		_.map($scope.yourTeam, function(champion){
			if(champion.health > 0){
				$scope.yourTeamDeath.push("alive");
			}else{
				$scope.yourTeamDeath.push("dead");
			}
		});
		_.map($scope.theirTeam, function(champion){
			if(champion.health > 0){
				$scope.theirTeamDeath.push("alive");
			}else{
				$scope.theirTeamDeath.push("dead");
			}
		});

		if(_.contains($scope.yourTeamDeath, "alive") === false){
			$scope.isGameOver = true;
			$scope.winner = lobbyService.opponentName;
		}

		if(_.contains($scope.theirTeamDeath, "alive") === false){
			$scope.isGameOver = true;
			$scope.winner = lobbyService.yourName;
		}

		//Change Turns
		if($scope.isTurn === true && $scope.newRound === false){
			$scope.isTurn = false;
			$scope.newRound = true;
		}else if($scope.isTurn === false && $scope.newRound === false) {
			$scope.isTurn = true;
			$scope.newRound = true;
		}else {
			if($scope.playerChampion.speed > $scope.opponentChampion.speed){
				$scope.isTurn = true;
			} else if($scope.playerChampion.speed === $scope.opponentChampion.speed) {
				if($scope.isTurn === true){
					$scope.isTurn = false;
				}else {
					$scope.isTurn = true;
				}
			} else {
				$scope.isTurn = false;
			}
			$scope.newRound = false;
		}

		removeStatusEffects();

		if($scope.playerChampion.health <= 0){
			if($scope.pickChampionShown === false){
				$scope.openPickChampionModal();
			}
		}
		


	});

	socket.on('selectChampion', function(data){
		$scope.timer = 40;
		//Means player just took turn
		if(data.sender === socket.io.engine.id) {
			$scope.playerChampion = $scope.yourTeam[data.playerChampionId];
			lobbyService.playerChampion  = $scope.playerChampion;

			if(opponentChampionPickFirst != false && $scope.firstChampionPicked === "tentative") {
				$scope.opponentChampion = opponentChampionPickFirst;
				lobbyService.opponentChampion = opponentChampionPickFirst;
				$scope.firstChampionPicked = true;
			}
		}else if(data.sender != socket.io.engine.id && $scope.firstChampionPicked === false){
			opponentChampionPickFirst = $scope.theirTeam[data.playerChampionId];
		}else {
			$scope.opponentChampion = $scope.theirTeam[data.playerChampionId];
			lobbyService.opponentChampion = $scope.opponentChampion;
		}

		// TBD if this needs to be here
		if($scope.playerChampion.speed > $scope.opponentChampion.speed && $scope.firstChampionPicked != false){
			$scope.isTurn = true;
			$scope.newRound = false;
		}else if($scope.playerChampion.speed === $scope.opponentChampion.speed) {
			//If speed is the same the host gets the turn (its bad...)
			if(lobbyService.sessionID === socket.io.engine.id){
				$scope.isTurn = true;
			}else {
				$scope.isTurn = false;
			}
			$scope.newRound = false;
		} else {
			$scope.isTurn = false;
			$scope.newRound = false;
		}

		// To hide first champion picked till both players picked
		if($scope.firstChampionPicked === false) {
			$scope.firstChampionPicked = "tentative";
		}

	});


	var removeStatusEffects = function () {
		//////// Removed status effects /////////////
		
		//// Unattackable remove! ////
		if (_.contains($scope.playerChampion.defenseStatus, "unattackable") && $scope.isTurn === true) { 
			console.log("Removing players unattackable status");
			$scope.playerChampion.defenseBonus -= 1;
			$scope.playerChampion.defenseStatus = _.without($scope.playerChampion.defenseStatus, "unattackable");

			gameAnimation.playerFade("return");
		}
		if (_.contains($scope.opponentChampion.defenseStatus, "unattackable") && $scope.isTurn === false) { 
			console.log("Removing opponents unattackable status");
			$scope.opponentChampion.defenseBonus -= 1;
			$scope.opponentChampion.defenseStatus = _.without($scope.opponentChampion.defenseStatus, "unattackable");

			gameAnimation.opponentFade("return");
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
			gameAnimation.opponentDarken("return");
		}
		if(_.contains($scope.playerChampion.attackStatus, "blind") && $scope.isTurn === false) {
			console.log("Removing players blind effect!");
			var attackStatusCount = _.countBy($scope.playerChampion.attackStatus);
			//Re adds attack boosts
			if(attackStatusCount.attackBoost != undefined) { 
				$scope.playerChampion.attackBonus += 1 + (0.25 * attackStatusCount.attackBoost);
			} else {
				$scope.playerChampion.attackBonus += 1;
			}
			$scope.playerChampion.attackStatus = _.without($scope.playerChampion.attackStatus, "blind");
			gameAnimation.playerDarken("return");
		}

		//// Defense Boost ////
		if(_.contains($scope.playerChampion.defenseStatus, "defenseBoost") && $scope.isTurn === true){
			console.log("Apply defense boost to player")
			var defenseBoost = _.findWhere($scope.playerChampion.defenseStatus, "defenseBoost");
			$scope.playerChampion.defenseStatus.splice(_.indexOf($scope.playerChampion.defenseStatus, defenseBoost), 1)
			//Check if that was last boost if so remove bonus
			if(_.contains($scope.playerChampion.defenseStatus, "defenseBoost") == false) {
				$scope.playerChampion.defenseBonus -= 0.25;
			}
		} 
		if(_.contains($scope.opponentChampion.defenseStatus, "defenseBoost") && $scope.isTurn === false){
			console.log("Apply defense boost to opponent");
			var defenseBoost = _.findWhere($scope.opponentChampion.defenseStatus, "defenseBoost");
			$scope.opponentChampion.defenseStatus.splice(_.indexOf($scope.opponentChampion.defenseStatus, defenseBoost), 1)
			//Check if that was last boost if so remove bonus
			if(_.contains($scope.opponentChampion.defenseStatus, "defenseBoost") == false) {
				$scope.opponentChampion.defenseBonus -= 0.25;
			}
		} 

		//// Poison ////
		var playerPoisonCheck = _.findWhere($scope.playerChampion.environmentalStatus, {type : "poison"});
		var opponentPoisonCheck = _.findWhere($scope.opponentChampion.environmentalStatus, {type : "poison"})
		if(playerPoisonCheck != undefined && $scope.isTurn === true) { 
			console.log("Apply poison damage to player!");
			$scope.playerChampion.health -= playerPoisonCheck.damage;
			$scope.playerPoisonDamage = playerPoisonCheck.damage;
			gameAnimation.playerPoison();
			combatLog.poison(lobbyService.playerChampion.name, playerPoisonCheck.damage, false, true);
			
		}
		if(opponentPoisonCheck != undefined && $scope.isTurn === false) {
			console.log("Apply Poison damage to opponent");
			$scope.opponentChampion.health -= opponentPoisonCheck.damage;
			$scope.opponentPoisonDamage = opponentPoisonCheck.damage;
			gameAnimation.opponentPoison();
			combatLog.poison(lobbyService.opponentChampion.name, opponentPoisonCheck.damage, false, false);
		}

		//// Bleed ////
		var playerBleedCheck = _.findWhere($scope.playerChampion.environmentalStatus, {type : "bleed"});
		var opponentBleedCheck = _.findWhere($scope.opponentChampion.environmentalStatus, {type : "bleed"})
		if(playerBleedCheck != undefined && $scope.isTurn === true) { 
			console.log("Apply Bleed damage to player!");
			$scope.playerChampion.health -= playerBleedCheck.damage;
		}
		if(opponentBleedCheck != undefined && $scope.isTurn === false) {
			console.log("Apply Bleed damage to opponent");
			$scope.opponentChampion.health -= opponentBleedCheck.damage;
		}

		//// Rebirth ////
		if(_.contains($scope.playerChampion.defenseStatus, "rebirth") && $scope.playerChampion.health <= 0) {
			$scope.playerChampion.health = $scope.playerChampion.maxHealth;
			$scope.playerChampion.cost = $scope.playerChampion.costSize;
			$scope.playerChampion.defenseStatus = _.without($scope.playerChampion.defenseStatus, "rebirth");
		}
		if(_.contains($scope.opponentChampion.defenseStatus, "rebirth") && $scope.opponentChampion.health <= 0) {
			$scope.opponentChampion.health = $scope.opponentChampion.maxHealth;
			$scope.opponentChampion.cost = $scope.opponentChampion.costSize;
			$scope.opponentChampion.defenseStatus = _.without($scope.opponentChampion.defenseStatus, "rebirth");
		}

	}


});

