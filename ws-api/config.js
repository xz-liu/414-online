
"use strict";
var webSocketsServerPort = 443;
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
var idNow = 0;
var allRooms = [];
var allPlayers = [];


function addPlayer(name,player){
    allPlayers[name]=player;
}
function deletePlayer(name){
    var ind=allPlayers.indexOf(name);
    if(ind>=0)allPlayers.splice(ind,1);
    return ind>=0;
}
function playerExists(name){
    return allPlayers[name]!=undefined;
}
function getPlayer(name){
    return allPlayers[name];
}



module.exports = {
    port: webSocketsServerPort,
    webSocketServer: _webSocketServer,
    wsServer: _wsServer,
    http: http,
    server: thisServer,
    idDistribute: function () {
        return ++idNow;
    },
    allPlayers: allPlayers,
    allRooms: allRooms,
    addPlayer:addPlayer,
    deletePlayer:deletePlayer,
    getPlayer:getPlayer,
    playerExists:playerExists
};