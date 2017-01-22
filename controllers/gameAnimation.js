app.factory('gameAnimation', function($timeout, $interval){
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

		},
		playerDarken : function(state) {
			if(state === "blinded") {
				var darkness = 100;
				var reset = false;
				playerDarkenInterval = $interval(function() {
					if(reset === false) {
						darkness--;
					} else{
						darkness++;
					}
					if(darkness === 75 && reset === true){
						reset = false;
					}
					if(darkness === 25 && reset === false){
						reset = true;
					}

					document.getElementById("playerImage").style.filter = "brightness(" + darkness + "%)";
		
		        }, 50);
				
			}else if (state === "return") {
				$interval.cancel(playerDarkenInterval);
			}
		},
		opponentDarken : function(state) {
			if(state === "blinded") {
				var darkness = 100;
				var reset = false;
				opponentDarkenInterval = $interval(function() {
					if(reset === false) {
						darkness--;
					} else{
						darkness++;
					}
					if(darkness === 75 && reset === true){
						reset = false;
					}
					if(darkness === 25 && reset === false){
						reset = true;
					}

					document.getElementById("opponentImage").style.filter = "brightness(" + darkness + "%)";
		
		        }, 50);
				
			}else if (state === "return") {
				$interval.cancel(opponentDarkenInterval);
			}
		}
	};
});