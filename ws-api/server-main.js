"use strict";
var gameRules = require('./gamerules');
var Player = require('./player').Player;
var config = require('./config');
config.wsServer.on('request', function (request) {
    var connection;
    connection = request.accept(null, request.origin);
    // if(allUsers.length>0){
    //     connection.sendUTF(
    //         JSON.stringify({type:'allUsers',data:allUsers})
    //     );
    // }
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            var msg = JSON.parse(message.utf8Data);
            if (msg.type === 'name') {
                config.allPlayers[msg.data] = new Player(msg.data, connection);
            }
        }
    });
});