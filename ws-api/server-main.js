"use strict";
var gameRules = require('./gamerules');
var Player = require('./player').Player;
var config = require('./config');

config.wsServer.on('request', function (request) {
    var connection;
    connection = request.accept(null, request.origin);
    // name
    // type:"success"
    // type:"failed"
    connection.on('message', function (message) {
        console.log(message);
        if (message.type === 'utf8') {
            var msg = JSON.parse(message.utf8Data);
            if (msg.type === 'name') {
                if (!config.playerExists(msg.data)) {
                    var newPlayer = new Player(msg.data, connection);
                    config.addPlayer(msg.data, newPlayer);
                    newPlayer.sendMessage({ 'type': 'success' });
                } else {
                    config.sendMessage(connection, { 'type': 'failed' });
                }
            } else {
                if (config.getPlayerByConn(connection)) {
                    config.getPlayerByConn(connection).handleMessage(msg);
                }
            }
        }
    });
    connection.on('close', function (connection) {
        config.getPlayerByConn(connection).playerQuit();
        config.deleteConnection(connection);
    });
});