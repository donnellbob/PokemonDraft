app.factory('championAbilities', function(lobbyService, gameAnimation, combatLog){
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
		combatLog.basicAttack(attacker.name, damage, attacker.abilities[id].type,  checkCounter(attacker.abilities[id].type, defender.type), defender.name, isTurn)
	}

	function basicAttack(isTurn, id) {
		var damage = 0;
		if(isTurn === true) {
			var defender = lobbyService.opponentChampion;
			var attacker = lobbyService.playerChampion;
			// Animation
			gameAnimation.playerBasicAttack();
		}else {
			var attacker = lobbyService.opponentChampion;
			var defender = lobbyService.playerChampion;
			// Animation
			gameAnimation.opponentBasicAttack();
		}
		if(checkCounter(attacker.abilities[id].type, defender.type) === true) {
			damage = ((attacker.abilities[id].damage * typeCounterDamage) * attacker.attackBonus);	
		} else {
			damage = (attacker.abilities[id].damage * attacker.attackBonus);
		}
		console.log(attacker.name + " dealt " + damage + " damage with a " + attacker.attackBonus + " attack boost");
		//Check if opponent has defense else attack
		if(defender.defenseBonus != 0){
			damage = (damage - (damage * defender.defenseBonus));
			defender.health -= damage;
		} else { 
			defender.health -= damage;
		}
		// Update combat log!
		combatLog.basicAttack(attacker.name, damage, attacker.abilities[id].type,  checkCounter(attacker.abilities[id].type, defender.type), defender.name, isTurn);
	}

	return {
		basicAttack : function(isTurn, id){
			basicAttack(isTurn, id)
		},
		heal : function(isTurn) { 
			if (isTurn === true) {
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "heal"});
				lobbyService.playerChampion.health += championAbility.damage;
				//Cap health to the max
				if (lobbyService.playerChampion.health > lobbyService.playerChampion.maxHealth) { 
					lobbyService.playerChampion.health = lobbyService.playerChampion.maxHealth;
				}
				combatLog.heal(lobbyService.playerChampion.name, championAbility.damage, true);
			} else { 
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "heal"});
				lobbyService.opponentChampion.health += championAbility.damage;
				//Cap health to the max
				if (lobbyService.opponentChampion.health > lobbyService.opponentChampion.maxHealth) { 
					lobbyService.opponentChampion.health = lobbyService.opponentChampion.maxHealth;
				}
				combatLog.heal(lobbyService.opponentChampion.name, championAbility.damage, true);
			}
		},
		unattackable : function (isTurn) {
			if (isTurn === true) { 
				lobbyService.playerChampion.defenseBonus = 1;
				lobbyService.playerChampion.defenseStatus.push("unattackable");
				gameAnimation.playerFade("unattackable");
				combatLog.unattackable(lobbyService.playerChampion.name, isTurn);
			} else { 
				lobbyService.opponentChampion.defenseBonus = 1;
				lobbyService.opponentChampion.defenseStatus.push("unattackable");
				gameAnimation.opponentFade("unattackable");
				combatLog.unattackable(lobbyService.opponentChampion.name, isTurn);
			}
		},
		blind : function(isTurn) { 
			if(isTurn === true){
				lobbyService.opponentChampion.attackBonus = 0;
				lobbyService.opponentChampion.attackStatus.push("blind");
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "blind"});
				specialAttack(true, championAbility.damage);
				combatLog.blind(lobbyService.opponentChampion.name, isTurn);
			} else {
				lobbyService.playerChampion.attackBonus = 0;
				lobbyService.playerChampion.attackStatus.push("blind");
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "blind"});
				specialAttack(false, championAbility.damage);
				combatLog.blind(lobbyService.playerChampion.name, isTurn);
			}
		},
		attackBoost : function(isTurn) {
			// Hard coded + 25% damage unchangeable
			if(isTurn === true) {
				lobbyService.playerChampion.attackBonus += 0.25;
				lobbyService.playerChampion.attackStatus.push("attackBoost");

				combatLog.boost(lobbyService.playerChampion.name, "attack", 25, isTurn);
			}else {
				lobbyService.opponentChampion.attackBonus += 0.25;
				lobbyService.opponentChampion.attackStatus.push("attackBoost");
				combatLog.boost(lobbyService.opponentChampion.name, "attack", 25, isTurn);
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
				combatLog.boost(lobbyService.playerChampion.name, "defense", 25, isTurn);
			}else { 
				if(_.contains(lobbyService.opponentChampion.defenseStatus, "defenseBoost")){
					lobbyService.opponentChampion.defenseStatus = _.without(lobbyService.opponentChampion.defenseStatus, "defenseBoost");
					lobbyService.opponentChampion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
				}else{
					lobbyService.opponentChampion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
					lobbyService.opponentChampion.defenseBonus += 0.25;
				}
				combatLog.boost(lobbyService.opponentChampion.name, "defense", 25, isTurn);
			}
		},
		poison : function(isTurn) { 
			if(isTurn === true) { 
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "poison"});
				var poison = {type: "poison", damage : championAbility.damage};
				var checkPoison = _.findWhere(lobbyService.opponentChampion.environmentalStatus, {type : "poison"});
				if(checkPoison === undefined) { 
					lobbyService.opponentChampion.environmentalStatus.push(poison);
				} else {
					//Check if new poison deals more damage;
					if (championAbility.damage > checkPoison.damage) {
						lobbyService.opponentChampion.environmentalStatus = _.without(lobbyService.opponentChampion.environmentalStatus , checkPoison);
						// Push new damage
						lobbyService.opponentChampion.environmentalStatus.push(poison);
					}
				}
				combatLog.poison(lobbyService.opponentChampion.name, poison.damage, true, true);
			} else {
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "poison"});
				var poison = {type: "poison", damage : championAbility.damage};
				var checkPoison = _.findWhere(lobbyService.playerChampion.environmentalStatus, {type : "poison"});
				if(checkPoison === undefined) { 
					lobbyService.playerChampion.environmentalStatus.push(poison);
				} else {
					//Check if new poison deals more damage;
					if (championAbility.damage > checkPoison.damage) {
						lobbyService.playerChampion.environmentalStatus = _.without(lobbyService.playerChampion.environmentalStatus , checkPoison);
						// Push new damage
						lobbyService.playerChampion.environmentalStatus.push(poison);
					}
				}
				combatLog.poison(lobbyService.playerChampion.name, poison.damage, true, true);
			}
		},
		bleed : function(isTurn) {
			if(isTurn === true) { 
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "bleed"});
				var bleed = {type: "bleed", damage : championAbility.damage};
				var checkBleed = _.findWhere(lobbyService.opponentChampion.environmentalStatus, {type : "bleed"});
				if(checkBleed === undefined) { 
					lobbyService.opponentChampion.environmentalStatus.push(bleed);
				} else {
					//Check if new bleed deals more damage;
					if (championAbility.damage > checkBleed.damage) {
						lobbyService.opponentChampion.environmentalStatus = _.without(lobbyService.opponentChampion.environmentalStatus , checkBleed);
						// Push new damage
						lobbyService.opponentChampion.environmentalStatus.push(bleed);
					}
				}
			} else {
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "bleed"});
				var bleed = {type: "bleed", damage : championAbility.damage};
				var checkBleed = _.findWhere(lobbyService.playerChampion.environmentalStatus, {type : "bleed"});
				if(checkBleed === undefined) { 
					lobbyService.playerChampion.environmentalStatus.push(bleed);
				} else {
					//Check if new bleed deals more damage;
					if (championAbility.damage > checkBleed.damage) {
						lobbyService.playerChampion.environmentalStatus = _.without(lobbyService.playerChampion.environmentalStatus , checkBleed);
						// Push new damage
						lobbyService.playerChampion.environmentalStatus.push(bleed);
					}
				}
			}
		},
		speedBoost : function(isTurn) {
			if(isTurn === true) {
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "speedBoost"});
				lobbyService.playerChampion.speed = (lobbyService.playerChampion.speed * championAbility.damage) + lobbyService.playerChampion.speed;
				combatLog.boost(lobbyService.playerChampion.name, "speed", (championAbility.damage * 100), isTurn);
			} else {
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "speedBoost"});
				lobbyService.opponentChampion.speed = (lobbyService.opponentChampion.speed * championAbility.damage) + lobbyService.opponentChampion.speed;
				combatLog.boost(lobbyService.opponentChampion.name, "speed", (championAbility.damage * 100), isTurn);
			}
		},
		speedAttack : function(isTurn) {
			if(isTurn === true) { 
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "speedAttack"});
				lobbyService.opponentChampion.speed = lobbyService.opponentChampion.speed - (lobbyService.opponentChampion.speed * championAbility.damage);
				if(lobbyService.opponentChampion.speed < 0){
					lobbyService.opponentChampion.speed = 0;
				}
				combatLog.statAttack(lobbyService.opponentChampion.name, "speed", (championAbility.damage * 100), true);
			}else{
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "speedAttack"});
				lobbyService.playerChampion.speed = lobbyService.playerChampion.speed - (lobbyService.playerChampion.speed * championAbility.damage);
				if(lobbyService.playerChampion.speed < 0){
					lobbyService.playerChampion.speed = 0;
				}
				combatLog.statAttack(lobbyService.playerChampion.name, "speed", (championAbility.damage * 100), false);		
			}
		},
		groupHeal : function(isTurn) {
			if(isTurn === true) {
				var championAbility = _.findWhere(lobbyService.playerChampion.abilities, {special: "groupHeal"});
				_.map(lobbyService.yourTeam, function(champion){
					//Check they are not already dead
					if(champion.health > 0) {
						champion.health += championAbility.damage;
					}
					if(champion.health > champion.maxHealth) {
						champion.health = champion.maxHealth;
					}
				});
				combatLog.heal("Your team", championAbility.damage, true);
			} else {
				var championAbility = _.findWhere(lobbyService.opponentChampion.abilities, {special: "groupHeal"});
				_.map(lobbyService.theirTeam, function(champion){
					//Check they are not already dead
					if(champion.health <= 0) {
						champion.health += championAbility.damage;
					}
					if(champion.health > champion.maxHealth) {
						champion.health = champion.maxHealth;
					}
				});
				combatLog.heal("Their team", championAbility.damage, false);	
			}
			
		},
		groupCleanse : function(isTurn) {
			if(isTurn === true) {
				_.map(lobbyService.yourTeam, function(champion){
					champion.environmentalStatus = [];
				});
				combatLog.cleanse("Your team", isTurn);
			} else {
				_.map(lobbyService.theirTeam, function(champion){
					champion.environmentalStatus = [];
				});
				combatLog.cleanse("Their team", isTurn);
			}
		},
		groupDefenseBoost : function(isTurn) {
			if(isTurn === true){
				_.map(lobbyService.yourTeam, function(champion){
					if(_.contains(champion.defenseStatus, "defenseBoost")){
						champion.defenseStatus = _.without(champion.defenseStatus, "defenseBoost");
						champion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
					}else{
						champion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
						champion.defenseBonus += 0.25;
					}
				});

				combatLog.boost("Your teams", "defense", 25, isTurn);
			}else { 
				_.map(lobbyService.theirTeam, function(champion){
					if(_.contains(champion.defenseStatus, "defenseBoost")){
						champion.defenseStatus = _.without(champion.defenseStatus, "defenseBoost");
						champion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
					}else{
						champion.defenseStatus.push("defenseBoost", "defenseBoost", "defenseBoost");
						champion.defenseBonus += 0.25;
					}
				});
				combatLog.boost("Their teams", "defense", 25, isTurn);
			}
		},
		cleanse : function(isTurn) {
			if(isTurn === true){
				lobbyService.playerChampion.environmentalStatus = [];
				combatLog.cleanse(lobbyService.playerChampion.name, isTurn);
			}else{
				lobbyService.opponentChampion.environmentalStatus = [];
				combatLog.cleanse(lobbyService.opponentChampion.name, isTurn);
			}
		},
		rebirth : function(isTurn) {

		}
	};
});