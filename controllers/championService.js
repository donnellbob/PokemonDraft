app.factory('championService', function(){
	return {
		champions : [
			{
				name : "Vigold",
				asset : "res/vigold.png",
				health : 135,
				maxHealth: 135,
				speed : 5,
				cost : 200,
				costType : "mana",
				costSize : 200,
				type : "water",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Tentacle Slash",
						description : "Slash opponent with a tentacle dealing 33 composite damage to your opponent",
						type: "composite",
						cost : 0,
						damage : 33,
						special : false
					},
					{
						name : "Splash",
						description : "Splash water furiously at oppenting dealing 45 Water damage.",
						type: "water",
						cost: 25,
						damage : 45,
						special : false
					},
					{
						name : "Squirt Ink",
						description : "Squirt Ink towards foe and deal 40 Water damage and blinding target making them miss next attack",
						type: "water",
						cost : 65,
						damage : 40,
						special : "blind"
					},
					{
						name : "Consume Water",
						description : "Become one with the water Heal 55 health to your self",
						type: "restoration",
						cost : 50,
						damage : 55,
						special : "heal"
					}
				]

			},
			{
				name : "Aberraven",
				asset : "res/aberraven.png",
				health : 185,
				maxHealth: 185,
				speed : 3,
				cost: 125,
				costType : "composite",
				costSize : 125,
				type : "composite",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Bite",
						description : "Deal 28 Composite damage to your opponent",
						type: "composite",
						cost : 0,
						damage : 28,
						special : false
					},
					{
						name : "Undying Stare",
						description : "Stare at your opponent dealing 50 Composite damage",
						type: "composite",
						cost: 35,
						damage : 50,
						special : false
					},
					{
						name : "Wink",
						description : "Wink at your opponent dealing 38 Composite damage",
						type: "composite",
						cost : 20,
						damage : 38,
						special : false
					},
					{
						name : "Close eyes",
						description : "Rests eyes and goes into meditative state health healing 45 health",
						type: "restoration",
						cost : 0,
						damage : 45,
						special : "heal"
					}
				]

			},
			{
				name : "Kaeadan",
				asset : "res/kaeadan.png",
				health : 120,
				maxHealth: 120,
				speed : 10,
				cost : 200,
				costType : "energy",
				costSize : 200,
				type : "fire",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Attack",
						description : "Strike your opponent for 40 Composite damage",
						type: "fire",
						cost : 25,
						damage : 40,
						special : false
					},
					{
						name : "Quick Attack",
						description : "Quickly strike your opponent for Composite damage",
						type: "fire",
						cost: 50,
						damage : 55,
						special : false
					},
					{
						name : "Super Quick Attack",
						description : "With superior speed strike opponent dealing 70 damage",
						type: "fire",
						cost : 75,
						damage : 70,
						special : false
					},
					{
						name : "Extreme Attack",
						description : "With extreme force swiftly strike opponent dealing 85 damage",
						type: "fire",
						cost : 100,
						damage : 85,
						special : false
					}
				]

			},
			{
				name : "Miriald",
				asset : "res/miriald.png",
				health : 140,
				maxHealth: 140,
				speed: 4,
				cost : 200,
				costType : "mana",
				costSize : 200,
				type : "earth",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Kick",
						description : "Kick your foe dealing 38 Composite",
						type: "composite",
						cost : 0,
						damage : 38,
						special : false
					},
					{
						name : "Shoot Spines",
						description : "Flexes back muscles to launch spines towards enemy dealing 45 Earth damage",
						type: "earth",
						cost: 35,
						damage : 45,
						special : false
					},
					{
						name : "Scream",
						description : "Scream at the ground causing the earth to shake dealing 75 Earth damage to your opponent",
						type: "earth",
						cost : 95,
						damage : 75,
						special : false
					},
					{
						name : "Harden Core",
						description : "Miriald hardens his core causing all attacks against him to be 25% weaker for the next 3 turns *Does not stack*",
						type: "earth",
						cost : 15,
						damage : 25,
						special : "defenseBoost"
					}
				]

			},
			{
				name : "Pienna",
				asset : "res/pienna.png",
				health : 110,
				maxHealth: 110,
				speed : 6,
				cost : 100,
				costType : "energy",
				costSize : 100,
				type : "earth",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Lick",
						description : "Lick foe and deal 30 composite damage to your opponent",
						type: "composite",
						cost : 0,
						damage : 30,
						special : false
					},
					{
						name : "Thow Pebble",
						description : "Throw Pebble with pin point accuracy and deal 65 damage",
						type: "earth",
						cost: 50,
						damage : 65,
						special : false
					},
					{
						name : "Tail Whip",
						description : "Exert your remaining energy pool as damage to opponent",
						type: "earth",
						cost : 0,
						damage : 0,
						special : "costAttack"
					},
					{
						name : "Camouflage",
						description : "Blend into your surroundings and becoming unattackable for the next turn",
						type: "earth",
						cost : 0,
						damage : 0,
						special : "unattackable"
					}
				]

			},
			{
				name : "Thoron",
				asset : "res/thoron.png",
				health : 165,
				maxHealth: 165,
				speed : 5,
				cost : 200,
				costType : "mana",
				costSize : 200,
				type : "fire",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Slash",
						description : "Slashes claws towards target dealing 35 Composite damage",
						type: "composite",
						cost : 0,
						damage : 35,
						special : false
					},
					{
						name : "Tail Whip",
						description : "Swing tail smashing into opponent dealing 45 Composite damage",
						type: "composite",
						cost: 25,
						damage : 45,
						special : false
					},
					{
						name : "Breath Fire",
						description : "Take a deep breath and exhale fire upon your opponent for 75 Fire damage",
						type: "fire",
						cost : 135,
						damage : 75,
						special : false
					},
					{
						name : "Consume Fire",
						description : "Consume the fire from within and gain 25% attack bonus on all attacks",
						type: "fire",
						cost : 35,
						damage : 25,
						special : "attackBoost"
					}
				]

			},
			{
				name : "Skymolecule",
				asset : "res/skymolecule.png",
				health : 110,
				maxHealth: 110,
				speed: 7,
				cost : 100,
				costType : "energy",
				costSize : 100,
				type : "earth",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Vomit",
						description : "Vomit on your opponent causing them to lose 25 health every turn they are in play",
						type: "earth",
						cost : 0,
						damage : 25,
						special : "poison"
					},
					{
						name : "Accelerate",
						description : "Increase speed by 25%",
						type: "earth",
						cost: 25,
						damage : 25,
						special : "speedBoost"
					},
					{
						name : "Gust",
						description : "Flap your wings hastily at your opponent causing their speed to decrease by 25%",
						type: "earth",
						cost : 25,
						damage : 25,
						special : "speedAttack"
					},
					{
						name : "Fly",
						description : "Fly out of attack range of opponent becoming unattackable",
						type: "earth",
						cost : 25,
						damage : 0,
						special : "unattackable"
					}
				]

			},
			{
				name : "Golden Oink",
				asset : "res/goldenoink.png",
				health : 90,
				maxHealth: 90,
				speed : 1,
				cost : 300,
				costType : "mana",
				costSize : 300,
				type : "composite",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Barrel Roll",
						description : "Roll at top speed towards opponent dealing 25 Composite damage",
						type: "composite",
						cost : 0,
						damage : 25,
						special : false
					},
					{
						name : "Tranquillity",
						description : "Heal self and all alive champions in group for 45 Health",
						type: "composite",
						cost: 80,
						damage : 45,
						special : "groupHeal"
					},
					{
						name : "Harmonise",
						description : "Cleanse self and all alive champions of all negative status effects",
						type: "composite",
						cost : 80,
						damage : 0,
						special : "groupCleanse"
					},
					{
						name : "Stand Guard!",
						description : "Give self and all alive champions a 25% defence bonus towards their next recieved attack",
						type: "composite",
						cost : 80,
						damage : 0,
						special : "groupDefenseBonus"
					}
				]

			},
			{
				name : "Smeed",
				asset : "res/smeed.png",
				health : 140,
				maxHealth: 140,
				speed : 4,
				cost : 300,
				costType : "mana",
				costSize : 300,
				type : "composite",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Fire Blast",
						description : "Shoot a blast of Fire dealing 65 Fire damage",
						type: "fire",
						cost : 60,
						damage : 65,
						special : false
					},
					{
						name : "Water Blast",
						description : "Shoot a blast of Water dealing 65 Water damage",
						type: "water",
						cost: 60,
						damage : 65,
						special : false
					},
					{
						name : "Earth Blast",
						description : "Shoot a blast of Earth dealing 65 Earth damage",
						type: "earth",
						cost : 60,
						damage : 65,
						special : "groupCleanse"
					},
					{
						name : "Purify",
						description : "Cleanse self of all negative status effects",
						type: "composite",
						cost : 60,
						damage : 0,
						special : "cleanse"
					}
				]

			},
			{
				name : "Baby Phoenix",
				asset : "res/babyphoenix.png",
				health : 120,
				maxHealth: 120,
				speed : 6,
				cost : 250,
				costType : "mana",
				costSize : 250,
				type : "fire",
				defenseBonus : 0,
				attackBonus : 1,
				defenseStatus : [],
				attackStatus : [],
				environmentalStatus : [],
				abilities : [
					{
						name : "Peck",
						description : "Peck your opponent dealing 40 Composite damage",
						type: "composite",
						cost : 0,
						damage : 40,
						special : false
					},
					{
						name : "Fiery Feather",
						description : "Blast target with a Fiery Feather dealig 55 Fire damage",
						type: "fire",
						cost: 50,
						damage : 55,
						special : false
					},
					{
						name : "Flap Wings",
						description : "Flap wings decreasing opponents speed by 50%",
						type: "composite",
						cost : 50,
						damage : 50,
						special : "attackSpeed"
					},
					{
						name : "Rebirth",
						description : "Upon death automatically revive self with 100% Health & Mana",
						type: "passive",
						cost : 0,
						damage : 0,
						special : "rebirth"
					}
				]

			}
		]
	};
});