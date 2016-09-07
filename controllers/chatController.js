app.controller('chatController', function($scope, $http, lobbyService) {
	
	// var socket = io();
	// [{text : "Test text", own : "mine"}, {text : " second test text", own : "their"} ]
	$scope.messages =[];
	$scope.sendMessage = function(message){

		// Add message to chat box
		$scope.messages.push({text : message, own : "mine"});

		//Send message to socket
		socket.emit('sendMessage', message, lobbyService.sessionID);


		//Clear message input after message is sent
		messageField = document.getElementById("messageField");
		messageField.value = "";
	}

	socket.on('recieveMessage', function(message) {
		$scope.messages.push({text : message, own : "their"});
		$scope.$apply();
	    console.log("message recieved: " + message);
	});
});

