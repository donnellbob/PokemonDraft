app.controller('serverTableController', function($scope, $http, $modal, $location, lobbyService) {
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

    $scope.openCreateGameModal = function(item) {
         var modalInstance = $modal.open({
             templateUrl: 'views/createGame.html',
             backdrop: 'static',
             controller: function($scope, $modalInstance, $sce, item) {
                 $scope.item = item;
                 $scope.close = function() {
                     $modalInstance.dismiss('cancel');
                 };
             },
             resolve: {
                 item: function() {
                     return item;
                 }
             }
         });
     }

    $scope.roomIsFullModal = function(item) {
         var modalInstance = $modal.open({
             templateUrl: 'views/roomIsFull.html',
             backdrop: 'static',
             controller: function($scope, $modalInstance, $sce, item) {
                 $scope.item = item;
                 $scope.close = function() {
                     $modalInstance.dismiss('cancel');
                 };
             },
             resolve: {
                 item: function() {
                     return item;
                 }
             }
         });
     }

    $scope.roomIsPrivateModal = function(item) {
         var modalInstance = $modal.open({
             templateUrl: 'views/roomIsPrivate.html',
             backdrop: 'static',
             controller: function($scope, $modalInstance, $sce, item) {
                 $scope.item = item;
                 $scope.close = function() {
                     $modalInstance.dismiss('cancel');
                 };
             },
             resolve: {
                 item: function() {
                     return item;
                 }
             }
         });
     }






    socket.on('connect', function(data) {
    	// default namespace/room (its a lobby)
        socket.emit('initialConnection', 'New client has joined :)');

        // Gets users socket ID
        $scope.usersID = socket.io.engine.id
    });


	$scope.joinGame = function(id){
        var roomDetails = {id: id, opponentName: $scope.usersName};
        $http.post("/routes/updateRoomDetails", roomDetails)
            .success(
            function(success){
                if(success.roomHasSpace === true && success.roomIsPrivate === "No"){
                    lobbyService.hostName = success.hostName;

                    //Link to room lobby
                    window.location.replace(window.location.href + "room");

                    socket.emit('joinGame', id);
                    lobbyService.sessionID = id;
                    lobbyService.opponentName = $scope.usersName;
                    $scope.close();

                }else if(success.roomHasSpace === true && success.roomIsPrivate === "Yes"){
                    $scope.close();
                    $scope.roomIsPrivateModal();
                    lobbyService.sessionID = id;
                    lobbyService.opponentName = $scope.usersName;

                }
                else{ //Else means room was full
                    $scope.close();
                    $scope.roomIsFullModal();
                    $scope.refreshServerTable();
                }
                
            })
            .error(
            function(error){
                console.log(error)
        });

	}

    $scope.joinPrivateGame = function(){
        var roomDetails = {id: lobbyService.sessionID, opponentName: lobbyService.opponentName, password : $scope.password}
        $http.post("/routes/updateRoomDetails", roomDetails)
        .success(
        function(success){
            if(success.roomHasSpace === true){
                lobbyService.hostName = success.hostName;
                //Link to room lobby
                window.location.replace(window.location.href + "room");

                socket.emit('joinGame', lobbyService.sessionID);
                $scope.close();
            }else if (success.passwordCheck === false){
                // needs new modal!
                console.log("password entered was incorrect")
            }else{ //Else means room was full
                $scope.close();
                $scope.roomIsFullModal();
                $scope.refreshServerTable();
            }
            
        })
        .error(
        function(error){
            console.log(error)
        });

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

    $scope.createGame = function(gameName, name, password){
    	var newGame = {name: gameName, hostName: name, players: 1, private: "No", id: socket.io.engine.id, opponentName : "", password: password};
        lobbyService.hostName = name;
        lobbyService.sessionID = socket.io.engine.id;
        lobbyService.opponentName = "";
	   $http.post("/routes/serverTableUpdate", newGame)
	    .success(
        function(success){
            console.log(success)
        })
   		.error(
        function(error){
            console.log(error)
        });

        //Join socket
        socket.emit('joinGame', socket.io.engine.id);

        //close modal
        $scope.close();
   	}


});

