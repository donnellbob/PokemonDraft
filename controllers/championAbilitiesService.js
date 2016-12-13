app.factory('championAbilities', function(lobbyService){
	var typeCounterDamage = 1.25;

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

	function specialAttack(isTurn, damage) {
		var damage = damage;
		console.log(damage);
		console.log(isTurn);
		if(isTurn === true) {
			var defender = lobbyService.opponentChampion;
			var attacker = lobbyService.playerChampion;
		}else {
			var attacker = lobbyService.opponentChampion;
			var defender = lobbyService.playerChampion;
		}
		if(checkCounter(attacker.type, defender.type) === true) {
			damage = (damage * typeCounterDamage) * attacker.attackBonus;	
		} else {
			damage = damage * attacker.attackBonus;
		}
		//Check if opponent has defense else attack
		if(defender.defenseBonus != 0){
			defender.health -= (damage - (damage * defender.defenseBonus));
		} else { 
			defender.health -= damage;
		}
	}

	function basicAttack(isTurn, id) {
		var damage = 0;
		if(isTurn === true) {
			var defender = lobbyService.opponentChampion;
			var attacker = lobbyService.playerChampion;
		}else {
			var attacker = lobbyService.opponentChampion;
			var defender = lobbyService.playerChampion;
		}
		if(checkCounter(attacker.abilities[id].type, defender.type) === true) {
			damage = ((attacker.abilities[id].damage * typeCounterDamage) * attacker.attackBonus);	
		} else {
			damage = (attacker.abilities[id].damage * attacker.attackBonus);
		}
		console.log(attacker.attackBonus + " THOS" + damage);
		//Check if opponent has defense else attack
		if(defender.defenseBonus != 0){
			defender.health -= (damage - (damage * defender.defenseBonus));
		} else { 
			defender.health -= damage;
		}
	}

	return {
		basicAttack : function(isTurn, id){
			basicAttack(isTurn, id)
		},
		unattackable : function (isTurn) {
			if (isTurn === true) { 
				lobbyService.playerChampion.defenseBonus = 1;
				lobbyService.playerChampion.defenseStatus.push("unattackable");
			} else { 
				lobbyService.opponentChampion.defenseBonus = 1;
				lobbyService.opponentChampion.defenseStatus.push("unattackable");
			}
		},
		blind : function(isTurn) { 
			if(isTurn === true){
				lobbyService.opponentChampion.attackBonus = 0;
				lobbyService.opponentChampion.attackStatus.push("blind");
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "blind"});
				specialAttack(true, championAbility.damage);
			} else {
				lobbyService.playerChampion.attackBonus = 0;
				lobbyService.playerChampion.attackStatus.push("blind");
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "blind"});
				specialAttack(false, championAbility.damage);
			}
		},
		attackBoost : function(isTurn) {
			// Hard coded + 25% damage unchangeable
			if(isTurn === true) {
				lobbyService.playerChampion.attackBonus += 0.25;
				lobbyService.playerChampion.attackStatus.push("attackBoost");
			}else {
				lobbyService.opponentChampion.attackBonus += 0.25;
				lobbyService.opponentChampion.attackStatus.push("attackBoost");
			}
		},
		costAttack : function(isTurn) { 
			if(isTurn === true) { 
				specialAttack(true, lobbyService.playerChampion.cost);
				lobbyService.playerChampion.cost = 0;
			}else{
				specialAttack(false, lobbyService.opponentChampion.cost);
				lobbyService.opponentChampion.cost = 0;
			}
		},
		defenseBoost : function(isTurn) {
			//Ensures the bonus is not stackable (Currently hardcoded to give bonus for 3 rounds)
			if(isTurn === true){
				if(_.contains(lobbyService.playerChampion.defenseStatus, "defenseBoost")){
					lobbyService.playerChampion.defenseStatus = _.without(lobbyService.playerChampion.defenseStatus, "defenseBoost");
					lobbyService.playerChampion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
				}else{
					lobbyService.playerChampion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
					lobbyService.playerChampion.defenseBonus += 0.25;
				}

			}else { 
				if(_.contains(lobbyService.opponentChampion.defenseStatus, "defenseBoost")){
					lobbyService.opponentChampion.defenseStatus = _.without(lobbyService.opponentChampion.defenseStatus, "defenseBoost");
					lobbyService.opponentChampion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
				}else{
					lobbyService.opponentChampion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
					lobbyService.opponentChampion.defenseBonus += 0.25;
				}

			}
		}
	};
});