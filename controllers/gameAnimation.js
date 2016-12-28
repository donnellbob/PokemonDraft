app.factory('gameAnimation', function($timeout){
	return {
		playerPoison : function() {
			document.getElementById("playerPoison").style.visibility = 'visible';
			$timeout(function() {
				document.getElementById("playerPoison").style.visibility = 'hidden';
			}, 3000);
		},
		opponentPoison : function() {
			document.getElementById("opponentPoison").style.visibility = 'visible';
			$timeout(function() {
				document.getElementById("opponentPoison").style.visibility = 'hidden';
			}, 3000);
		}
	};
});