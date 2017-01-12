app.factory('combatLog', function(){
	var log = [];
	var attackWords = ["deals", "dealt", "attacks dealing", "strikes dealing", "attacks flawlessly dealing", "strikes seamlessly dealing", "swiftly deals", "delivers", "doles out", "inflicts", "serves", "dispensed", ];
	var healWords = ["restores", "rejuvenates", "renews", "recovers", "revitalizes", "recalls", "refreshes", "repairs", "heals", "medicates", "cures", "mends", "replaces"]
	return {
		combatLog : log,

		basicAttack : function(playerName, damage, type, counter, opponentName, isTurn) {
			if(counter != true) {
				log.unshift({name : playerName, text : " " + _.sample(attackWords) + " " + damage + " " + type + " damage.", type : "basic", turn : isTurn})
			}else {
				log.unshift({name : playerName, text : " counters " + opponentName + " and " + _.sample(attackWords) + " " + damage + " " + type + " damage.", type : "basic", turn : isTurn})
			}
		},
		heal : function(playerName, heal, isTurn) {
			log.unshift({name : playerName, text : " " + _.sample(healWords) + " " + heal + " health.", type : "basic", turn : isTurn})
		},
		blind : function(name, isTurn) {
			log.unshift({name : name, text : " has been blinded!", type : "blind", turn : isTurn});
		},
		unattackable : function(name, isTurn) {
			log.unshift({name : name, text : " has become unattackable!", type : "unattackable", turn : isTurn});
		},
		boost : function(name, type, amount, isTurn) {
			log.unshift({name : name, text : " " + type + " has been boosted by " + amount + "%.", type : "boost", turn : isTurn});
		},
		poison : function(name, damage, initial, isTurn) {
			if(initial === true) {
				log.unshift({name : name, text : " has been poisoned! Ticking " + damage + " damage.", type : "poison", turn : isTurn});
			}else {
				log.unshift({name : name, text : "'s poison has ticked for " + damage + " damage.", type : "poison", turn : isTurn});
			}
		},
		statAttack : function(name, stat, reduction, isTurn) {
			log.unshift({name : name, text : "'s " + stat + " has been reduced by " + reduction + "%.", type : "statAttack", turn : isTurn});
		},
		cleanse : function(name, isTurn) {
			log.unshift({name : name, text : " has been cleansed of all negative effects!", type: "cleanse", turn : isTurn});
		}
	};
});