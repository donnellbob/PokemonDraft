app.controller('champSelectController', function($scope, $http, lobbyService, $interval, championService, _) {
	$scope.timer = 40;
	$scope.selectedChampion = championService.champions[0];
	$scope.listOfChampions = [];
	$scope.yourChampions = [];
	$scope.theirChampions = [];
	$scope.isTurn;
	$scope.gameStart = false;

	$scope.$on('$routeChangeSuccess', function(){
		var count = 0;
		var totalCount = 0;
		var subChampionList = [];
		_.map(championService.champions, function(champ){
			count++;
			totalCount++;
			champ.id = totalCount;
			subChampionList.push(champ);
			if(count === 10 || totalCount === championService.champions.length){
				$scope.listOfChampions.push(subChampionList);
				subChampionList = [];
				count = 0;
			}
		});


		//Check who takes first turn on route load (host takes first turn)
		if(socket.io.engine.id === lobbyService.sessionID){
			$scope.isTurn = true;
			$scope.yourName = lobbyService.hostName;
			$scope.theirName = lobbyService.opponentName;
			document.getElementById("leftPlayer").style.background = "#FF8800";
		}else{
			$scope.isTurn = false;
			$scope.yourName = lobbyService.opponentName;
			$scope.theirName = lobbyService.hostName;
			document.getElementById("rightPlayer").style.background = "#FF8800";
		}
	});

	function selectRandomChampion(){
		var randomChampion = _.random(championService.champions.length - 1);
		if(_.findWhere($scope.yourChampions, {id: randomChampion.id}) === undefined 
			&& _.findWhere($scope.theirChampions, {id: randomChampion.id}) === undefined){
			$scope.selectedChampion = championService.champions[randomChampion];
		}else{
			selectRandomChampion();
		}
	}


	$scope.selectChampion = function(id){	
		document.getElementById($scope.selectedChampion.id).style.background = "none";
		document.getElementById(id).style.background = "#F89406";
		$scope.selectedChampion = championService.champions[id-1];
		// Mouse over
		document.getElementById($scope.selectedChampion.id).onmouseover = function() {
		    this.style.background = "#F89406";
		}
		//Mouse out
		document.getElementById($scope.selectedChampion.id).onmouseout = function() {
		    if(id != $scope.selectedChampion.id){
		    	this.style.background = "none";	
		    }
		    // this.style.background = "none";
	
		}

	}

	$scope.lockInChampion = function(){
		// Checks champion isn't already picked
		if(_.findWhere($scope.yourChampions, {id: $scope.selectedChampion.id}) === undefined 
			&& _.findWhere($scope.theirChampions, {id: $scope.selectedChampion.id}) === undefined){

			var lockedChampion = jQuery.extend({}, $scope.selectedChampion)
			$scope.yourChampions.push(lockedChampion);

			document.getElementById("leftPlayer").style.background = "none";
			document.getElementById("rightPlayer").style.background = "#FF8800";

			changeTurns(lockedChampion);		
		}
	}

	function beginGame(){
		socket.emit('beginGame', lobbyService.sessionID);
	}

	function changeTurns(lockedChampion){
		if(socket.io.engine.id === lobbyService.sessionID){
			var details = {host : lobbyService.sessionID, turn: "opponent", champion : lockedChampion}
		}else{
			var details = {host : lobbyService.sessionID, turn: "host", champion : lockedChampion}
		}

		socket.emit('changeTurn', details);
		$scope.isTurn = false;
	
	}



	$interval(function(){
		$scope.timer--;
		if($scope.timer === 0 && $scope.gameStart === true){
			lobbyService.yourTeam = $scope.yourChampions;
			lobbyService.theirTeam = $scope.theirChampions;

			window.location.replace(location.protocol + '//' + location.host + '/#/game');
		}else if($scope.timer === 0 && $scope.gameStart === false && $scope.isTurn === true){
			selectRandomChampion();
			$scope.lockInChampion();
		}

	},1000,0);



	// Socket Listeners
	socket.on('turnChange', function(data){
		if(data.turn === "host" && socket.io.engine.id === lobbyService.sessionID){
			$scope.isTurn = true;
			$scope.theirChampions.push(data.champion);
			document.getElementById("leftPlayer").style.background = "#FF8800";
			document.getElementById("rightPlayer").style.background = "none";


		}else if(data.turn === "opponent" && socket.io.engine.id != lobbyService.sessionID){
			$scope.isTurn = true;
			$scope.theirChampions.push(data.champion);
			document.getElementById("leftPlayer").style.background = "#FF8800";
			document.getElementById("rightPlayer").style.background = "none";
		}

		if($scope.yourChampions.length === 5 && $scope.theirChampions.length === 5){
			$scope.isTurn = false;
			beginGame();
		}

		document.getElementById(data.champion.id).style.background = "black";
		document.getElementById(data.champion.id).style.opacity = 0.2;
		document.getElementById(data.champion.id).disabled = true;
		$scope.timer = 40;
	});

	socket.on('beginGame', function(data){
		$scope.turn = false;
		$scope.gameStart = true;
		$scope.timer = 15;
		document.getElementById("leftPlayer").style.background = "#FF8800";
		document.getElementById("rightPlayer").style.background = "#FF8800";
	});

});

