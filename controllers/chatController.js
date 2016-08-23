app.controller('chatController', function($scope, $http) {
	console.log("chatController called");

	$scope.sendMessage = function(message){
		console.log("message sending");
		console.log(message);

		//Clear message input after message is sent
		messageField = document.getElementById("messageField");
		messageField.value = "";
	}
});

