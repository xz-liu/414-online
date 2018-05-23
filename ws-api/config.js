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
    allRooms: [],//[code:string]=room:GameRoom
    allPlayers: [],//[name:string]=player:Player
    allConns: [],//[index:int]=name:string
    tokens: [],//[token:string]=index:int
    maxHeartbeatCheckTime: 5,
    heartbeatInterval: 15000,
    deleteUserCountDown: 120000,
    heartbeatTimeoutObjs: [],

    addPlayer: function (name, player, connIndex) {
        this.allPlayers[name] = player;
        this.allConns[connIndex] = name;
        // this.connLastCheck[connIndex] = 5;
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
        debug(msg);
        connection.sendUTF(JSON.stringify(msg));
    },
    sendTypeDataMsg: function (conn, type, data) {
        this.sendMessage(conn, { 'type': type, 'data': data });
    },
    getRandomToken: function () {
        return Math.random().toString(36).substr(2);
    },
    getIndexByToken: function (token) {
        return this.tokens[token];
    },
    deleteConnection: function (index) {
        this.deletePlayer(this.allConns[index]);
        delete this.allConns[index];
        // delete this.connLastCheck[index];
        let tk = getKeyByVal(index);
        delete this.tokens[tk];
    },
    getPlayerByConn: function (index) {
        return this.getPlayer(this.allConns[index]);
    },
    deleteRoom: function (room) {
        let i = getKeyByVal(this.allRooms, room);
        delete this.allRooms[i];
    },
    getConnByIndex: function (index) {
        if (this.getPlayerByConn(index))
            return this.getPlayerByConn(index).getConnection();
        return null;
    },

    heartbeatCheck: function (index, conn) {
        let defaultConn = this.getConnByIndex(index);
        if (defaultConn) conn = defaultConn;
        if (conn) {
            this.sendTypeDataMsg(conn, types.STYPE_HEARTBEAT);
            // this.connLastCheck[i]--;
            // debug_raw('Conn last check of #' + index + " = " + this.connLastCheck);
            this.heartbeatTimeoutObjs[index] = setTimeout(() => {
                this.checkDeleteUser(index);
            }, this.deleteUserCountDown);
        }
    }, checkDeleteUser: function (connIndex) {
        if (this.getPlayerByConn(connIndex)) {
            this.getPlayerByConn(connIndex).playerQuit();
            this.deleteConnection(connIndex);
        }
    },
    heartbeatReset: function (connection, index, token) {
        let newIndex = this.tokens[token];
        debug_raw(token + " -> " + newIndex);
        if (newIndex !== undefined && newIndex !== index) {
            // this.allConns[index];
            if (this.allConns[newIndex]) {
                if (this.heartbeatTimeoutObjs[newIndex])
                    clearTimeout(this.heartbeatTimeoutObjs[newIndex]);
                // if (this.getPlayerByConn(newIndex))
                this.allConns[index] = this.allConns[newIndex];
                delete this.allConns[newIndex];
                this.tokens[token] = index;
                this.getPlayerByConn(index).connectionRenewal(connection);
                // index = newIndex;
            } else {
                this.sendTypeDataMsg(connection, 'failed', errors._PLAYER_ALREADY_DELETED);
                // sendTypeDataMsg();
            }
        }
        // this.connLastCheck[index] = this.maxHeartbeatCheckTime;
        if (this.heartbeatTimeoutObjs[index]) {
            clearTimeout(this.heartbeatTimeoutObjs[index]);
        }
        setTimeout(() => {
            this.heartbeatCheck(index, connection);
        }, this.heartbeatInterval);
    }
};
