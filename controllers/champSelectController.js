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
		$scope.selectedChampion = championService.champions[randomChampion];
	}


	$scope.selectChampion = function(id){
		document.getElementById($scope.selectedChampion.id).style.background = "none";
		document.getElementById(id).style.background = "#F89406";
		$scope.selectedChampion = championService.champions[id-1];
	}

	$scope.lockInChampion = function(){
		var lockedChampion = jQuery.extend({}, $scope.selectedChampion)
		$scope.yourChampions.push(lockedChampion);

		document.getElementById("leftPlayer").style.background = "none";
		document.getElementById("rightPlayer").style.background = "#FF8800";

		changeTurns(lockedChampion);
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
		if($scope.yourChampions.length === 5 && $scope.theirChampions.length === 5){
			$scope.isTurn = false;
			beginGame();
		}else{
			socket.emit('changeTurn', details);
			$scope.isTurn = false;
		}
	}

	$interval(function(){
		$scope.timer--;
		if($scope.timer === 0 && $scope.gameStart === true){
			console.log("Game has started add redirect code here!")
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

		$scope.timer = 40;
	});

	socket.on('beginGame', function(data){
		$scope.turn = false;
		$scope.gameStart = true;
		$scope.timer = 40;
	});

});

