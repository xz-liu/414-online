"use strict";
require('./globals');
var webSocketsServerPort = 3001;
var _webSocketServer = require('websocket').server;
var http = require('http');
var thisServer = http.createServer(function (request, response) {

});
thisServer.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
});
var _wsServer = new _webSocketServer({
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
    connLastCheck: [],
    tokens: [],
    maxHeartbeatCheckTime: 5,
    heartbeatInterval: 15000,
    addPlayer: function (name, player, connIndex) {
        this.allPlayers[name] = player;
        this.allConns[connIndex] = name;
        this.connLastCheck[connIndex] = 5;
        var tkNow;
        do {
            tkNow = this.getRandomToken();
        } while (this.tokens[tkNow]);
        this.tokens[tkNow] = connIndex;
        return tkNow;
    },
    deletePlayer: function (name) {
        // var ind = getKeyByVal(this.allPlayers,name);
        delete this.allPlayers[name];
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
    sendTypeDataMsg: function (conn, type, data) {
        this.sendMessage(conn, { 'type': type, 'data': data });
    }, getRandomToken: function () {
        return Math.random().toString(36).substr(2);
    }, getIndexByToken: function (token) {
        return this.tokens[token];
    },
    deleteConnection: function (index) {
        this.deletePlayer(this.allConns[index]);
        delete this.allConns[index];
        delete this.connLastCheck[index];
        let tk = getKeyByVal(index);
        delete this.tokens[tk];
    }, getPlayerByConn: function (index) {
        return this.getPlayer(this.allConns[index]);
    }
    , deleteRoom: function (room) {
        let i = getKeyByVal(this.allRooms, room);
        delete this.allRooms[i];
    }
    , heartbeatCheck: function (index) {
        this.sendTypeDataMsg(this.allConns[index], types.STYPE_HEARTBEAT);
        // this.connLastCheck[i]--;
        if (this.connLastCheck[index]-- === 0) {
            this.deleteConnection(index);
        }
    }, heartbeatReset: function (connection, timeoutObj, index, token) {
        let newIndex = this.tokens[token];
        if (newIndex && newIndex !== index) {

            this.allConns[index];
            if (this.allConns[newIndex]) {
                // if (this.getPlayerByConn(newIndex))
                this.getPlayerByConn(newIndex).connectionRenewal(connection);
                this.allConns[index] = this.allConns[newIndex];
                delete this.allConns[newIndex];
                index = newIndex;
            } else {
                connection.sendTypeDataMsg('failed', errors._PLAYER_ALREADY_DELETED);
            }
        }
        this.connLastCheck[index] = this.maxHeartbeatCheckTime;
        if (timeoutObj) clearTimeout(timeoutObj);
        this.heartbeatCheck(index);
    }
};
