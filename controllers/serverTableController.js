var app = angular.module('pokemonDraft', []);
app.controller('serverTableController', function($scope, $http) {


    var socket = io.connect('http://localhost:4200');
    socket.on('connect', function(data) {
        socket.emit('join', 'Hello World from client');
    });

    

	// Testing array :)
	$scope.hostedGames = [
	{name: "Greg", hostName: "George", players: "1/4", private: "No"}, 
	{name: "Cool Game", hostName: "Jim", players: "1/2", private: "Yes"},
	{name: "Fun Game", hostName: "Tim", players: "1/3", private: "No"},
	{name: "Crazy Game", hostName: "Old'greg", players: "1/5", private: "Yes"},
	{name: "Interesting Game", hostName: "Jay", players: "1/4", private: "Yes"}
	];


	$scope.joinGame = function(){
		socket.emit('test', 'WHY HELLO THERE!');
		console.log("working");
	}
});

