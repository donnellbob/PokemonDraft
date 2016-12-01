var app = angular.module('pokemonDraft', ['ui.bootstrap.modal', 'ui.bootstrap.tpls', 'ngRoute', 'luegg.directives', 'underscore']);
var socket = io.connect();
// configure our routes
app.config(function($routeProvider) {
    $routeProvider

        // route for the lobby table page
        .when('/', {
            templateUrl : 'views/serverTable.html',
            controller  : 'serverTableController'
        })

        //champSelect
        .when('/champSelect', {
            templateUrl : 'views/champSelect.html',
            controller  : 'champSelectController'
        })

        // route for the room page
        .when('/room', {
            templateUrl : 'views/room.html',
            controller  : 'lobbyRoomController'
        })

        //Game route 
        .when('/game', {
            templateUrl : 'views/game.html',
            controller  : 'gameController'
        });
});
