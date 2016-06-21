var app = angular.module('pokemonDraft', []);
app.controller('serverTableController', function($scope, $http) {


	// Testing array :)
	$scope.hostedGames = [
	{name: "Greg", hostName: "George", players: "1/4", private: "No"}, 
	{name: "Cool Game", hostName: "Jim", players: "1/2", private: "Yes"},
	{name: "Fun Game", hostName: "Tim", players: "1/3", private: "No"},
	{name: "Crazy Game", hostName: "Old'greg", players: "1/5", private: "Yes"},
	{name: "Interesting Game", hostName: "Jay", players: "1/4", private: "Yes"}
	];
});