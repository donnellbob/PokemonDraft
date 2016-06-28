var app = angular.module('pokemonDraft', ['ui.bootstrap.modal', 'ui.bootstrap.tpls']);
app.controller('serverTableController', function($scope, $http, $modal) {
    $scope.openModal = function(item) {
        var modalInstance = $modal.open({
            templateUrl: 'views/joinGame.html',
            backdrop: 'static',
            controller: function($scope, $modalInstance, $sce, item) {
                var clone = {};
                angular.copy(item, clone);
                $scope.clone = clone;
                $scope.close = function() {
                    $modalInstance.dismiss('cancel');
                };
                $scope.save = function() {
                  angular.extend(item, clone);
                  $modalInstance.close();
                };

                $scope.joinGame = function(id){
                	console.log(id);
                }
            },
            resolve: {
                item: function() {
                    return item;
                }
            }
        });

        console.log(item);

    }


    var socket = io.connect('http://localhost:4200');
    socket.on('connect', function(data) {
    	// default namespace/room (its a lobby)
        socket.emit('initialConnection', 'New client has joined :)');
    });


    //USED WHEN CREATING GAME :) THIS IS THE CLIENTS ID
    var id = socket.io.engine.id
	console.log(id); // returns undefined as its called before socket connection

	// Testing array :)
	$scope.hostedGames = [
	{name: "Greg", hostName: "George", players: "1/4", private: "No", id: '1'}, 
	{name: "Cool Game", hostName: "Jim", players: "1/2", private: "Yes", id: '2'},
	{name: "Fun Game", hostName: "Tim", players: "1/3", private: "No", id: '3'},
	{name: "Crazy Game", hostName: "Old'greg", players: "1/5", private: "Yes", id: '4'},
	{name: "Interesting Game", hostName: "Jay", players: "1/4", private: "Yes", id: '5'}
	];


	$scope.joinGame = function(id){
		console.log("REACHED");
		socket.emit('joinGame', id);
		console.log(id);
	}

	socket.on('message', function(data) {
	   console.log('Success:', data);
	});

});

