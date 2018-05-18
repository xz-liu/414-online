"use strict";
require('./globals');
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
        this.allPlayers[name] = player;
        this.allConns[connIndex] = name;
    },
    deletePlayer: function (name) {
        var ind = getKeyByVal(this.allPlayers,name);
        delete this.allPlayers[ind];
    },
    getPlayer: function (name) {
        return this.allPlayers[name];
    },
    playerExists: function (name) {
        return this.allPlayers[name] != undefined;
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
        delete this.allConns[connection];
    }, getPlayerByConn: function (connection) {
        return this.getPlayer
            (this.allConns[connection]);
    }
    , deleteRoom: function (room) {
        let i = getKeyByVal(this.allRooms,room);
        delete this.allRooms[i];
    }
};
