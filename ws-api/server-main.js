"use strict";
require('./globals');
var gameRules = require('./gamerules');
var Player = require('./player').Player;
var config = require('./config');
// var realConns=[];
global.connNxt = 0;
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
config.wsServer.on('request', function (request) {
    var connection;
    connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');
    var connIndex = connNxt++;
    console.log(connIndex);
    // name
    // type:"success"
    // type:"failed"
    connection.on('message', function (message) {
        debug(message);
        debug('sent from conn#' + connIndex);
        if (message.type === 'utf8') {
            var msg = JSON.parse(message.utf8Data);
            if (msg && msg.type === 'name') {
                if (msg.data) {
                    let playerName = escapeHtml(msg.data);
                    if (!config.playerExists(playerName)) {
                        var newPlayer = new Player(playerName, connection);
                        config.addPlayer(playerName, newPlayer, connIndex);
                        newPlayer.sendMessage({ 'type': 'success' });
                    } else {
                        config.sendMessage(connection, {
                            'type': 'failed', 'data':
                                { 'code': errors._NAME_ALREADY_EXISTS }
                        });
                    }
                }
            } else {
                if (config.getPlayerByConn(connIndex)) {
                    config.getPlayerByConn(connIndex).handleMessage(msg);
                }
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