app.factory('gameAnimation', function($timeout){
	return {
		playerBasicAttack : function() {
			document.getElementById("playerAnimate").style.left = 10 + "%";
			document.getElementById("playerAnimate").style.bottom = 8 + "%";

			$timeout(function() {
				document.getElementById("playerAnimate").style.left = 8 + "%";
				document.getElementById("playerAnimate").style.bottom = 6 + "%";
			}, 100);
		},
		opponentBasicAttack : function() {
			document.getElementById("opponentAnimate").style.top = 22 + "%";
			document.getElementById("opponentAnimate").style.right = 32 + "%";

			$timeout(function() {
				document.getElementById("opponentAnimate").style.top = 20 + "%";
				document.getElementById("opponentAnimate").style.right = 30 + "%";
			}, 100);
		},
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
		},
		playerFade : function(state) {
			if(state === "unattackable") {
				document.getElementById("playerImage").style.opacity = 0.2;
			}else if (state === "return") {
				document.getElementById("playerImage").style.opacity = 1;
			}

		},
		opponentFade : function(state) {
			if(state === "unattackable") {
				document.getElementById("opponentImage").style.opacity = 0.2;
			}else if (state === "return") {
				document.getElementById("opponentImage").style.opacity = 1;
			}

		}
	};
});