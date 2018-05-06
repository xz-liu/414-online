"use strict";
var webSocketsServerPort = 1337;
var _webSocketServer = require('websocket').server;
var http = require('http');
var thisServer = http.createServer(function (request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});
thisServer.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
});
var _wsServer = new _webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info 
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: thisServer
});
// var idNow = 0;

module.exports = {
    port: webSocketsServerPort,
    webSocketServer: _webSocketServer,
    wsServer: _wsServer,
    http: http,
    server: thisServer,
    allRooms: [],
    allPlayers: [],
    allConns: [],
    addPlayer: function (name, player, connIndex) {
        module.exports.allPlayers[name] = player;
        module.exports.allConns[connIndex] = name;
    },
    deletePlayer: function (name) {
        var ind = module.exports.allPlayers.indexOf(name);
        if (ind >= 0) module.exports.allPlayers.splice(ind, 1);
        return ind >= 0;
    },
    getPlayer: function (name) {
        return module.exports.allPlayers[name];
    },
    playerExists: function (name) {
        return module.exports.allPlayers[name] != undefined;
    },
    getRandomPasscode: function () {
        return (Math.floor(Math.random() * 899999) + 100000).toString();
    },
    sendMessage: function (connection, msg) {
        connection.sendUTF(JSON.stringify(msg));
    },
    deleteConnection: function (connection) {
        this.deletePlayer
            (this.allConns[connection]);
        this.allConns.splice(connection, 1);
    }, getPlayerByConn: function (connection) {
        return this.getPlayer
            (this.allConns[connection]);
    }
};
