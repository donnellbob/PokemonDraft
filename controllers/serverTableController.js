app.controller('serverTableController', function($scope, $http, $modal, $location) {
	// server list
	$scope.hostedGames = [];
	$scope.usersID;
    $scope.openModal = function(item) {
         var modalInstance = $modal.open({
             templateUrl: 'views/joinGame.html',
             backdrop: 'static',
             controller: function($scope, $modalInstance, $sce, item) {
                 $scope.item = item;
                 $scope.close = function() {
                     $modalInstance.dismiss('cancel');
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

        // Gets users socket ID
        $scope.usersID = socket.io.engine.id
    });


	$scope.joinGame = function(id){
		socket.emit('joinGame', id);
		console.log("Joining room ID: " + id);
        $scope.close();
	}


	socket.on('message', function(data) {
	   console.log('Success:', data);
	});

	$http.get("/routes/serverTable").then(function(response) {
        $scope.hostedGames = response.data;
    });

    $scope.refreshServerTable = function(){
    	$http.get("/routes/serverTable").then(function(response) {
	        $scope.hostedGames = response.data;
	    });
    }

    $scope.createGame = function(id, gameName, name, password){
    	var newGame = {name: gameName, hostName: name, players: 1, private: "No", id: id};
	   $http.post("/routes/serverTableUpdate", newGame)
	    .success(
        function(success){
            console.log(success)
        })
   		.error(
        function(error){
            console.log(error)
        });

   	}

});

