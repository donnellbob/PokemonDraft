var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var _ = require('underscore');
var passwordhasher = require('password-hasher')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname + '/'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});


require('./routes/serverSelect')(app, io, _, passwordhasher);
require('./routes/socket')(app, io);
require('./routes/chatService')(app, io);



server.listen(80); 