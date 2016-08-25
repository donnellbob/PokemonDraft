var app = angular.module('pokemonDraft', ['ui.bootstrap.modal', 'ui.bootstrap.tpls', 'ngRoute']);
var socket = io.connect();
// configure our routes
app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'views/serverTable.html',
            controller  : 'serverTableController'
        })

        // route for the about page
        .when('/room', {
            templateUrl : 'views/room.html',
            controller  : 'lobbyRoomController'
        });
});
