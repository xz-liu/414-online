"use strict";
require('./globals');
var gameRules = require('./gamerules');
var Player = require('./player').Player;
var config = require('./config');
// var realConns=[];
global.connNxt = 0;
var timeoutObj;
config.wsServer.on('request', function (request) {
    var connection;
    connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');
    var connIndex = connNxt++;
    console.log(connIndex);

    timeoutObj=setTimeout(function(){
        config.heartbeatCheck(connIndex);
    },config.heartbeatInterval);
    // name
    // type:"success"
    // type:"failed"
    connection.on('message', function (message) {
        debug(message);
        debug('sent from conn#' + connIndex);
        if (message.type === 'utf8') {
            var msg = JSON.parse(message.utf8Data);
            if (msg) {
                if (msg.type === 'name') {
                    if (msg.data) {
                        let playerName = escapeHtml(msg.data);
                        if (playerName.length > 20) {
                            config.sendMessage(connection, {
                                'type': 'failed', 'data':
                                    { 'code': errors._NAME_TOO_LONG }
                            });
                        } else if (!config.playerExists(playerName)) {
                            var newPlayer = new Player(playerName,timeoutObj, connIndex);
                            let token = config.addPlayer(playerName,timeoutObj, newPlayer, connIndex);
                            newPlayer.sendMessage({ 'type': 'success', 'data': { 'name': playerName, 'token': token } });
                        } else {
                            config.sendMessage(connection, {
                                'type': 'failed', 'data':
                                    { 'code': errors._NAME_ALREADY_EXISTS }
                            });
                        }
                    }
                } else if (msg.type === types.DTYPE_HEARTBEAT) {
                    if (msg.data) {
                        config.heartbeatReset(connection, connIndex, msg.data);
                    } else config.heartbeatReset(connection, connIndex);
                } else {
                    if (config.getPlayerByConn(connIndex)) {
                        config.getPlayerByConn(connIndex).handleMessage(msg);
                    }
                }
                config.heartbeatReset(connection,timeoutObj, connIndex);
            }
        }
    });
    connection.on('close', function (connection) {
        if (config.getPlayerByConn(connIndex)) {
            config.getPlayerByConn(connIndex).playerQuit();
            config.deleteConnection(connIndex);
        }
    });
});