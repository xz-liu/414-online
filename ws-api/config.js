
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
var allConns=[];

function addPlayer(name,player){
    allPlayers[name]=player;
    allConns[player.connection]=name;
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

function getRandomPasscode(){
    return (Math.floor(Math.random()*899999)+100000).toString();
}

function sendMessage(connection,msg){
    connection.sendUTF(JSON.stringify(msg));
}


module.exports = {
    port: webSocketsServerPort,
    webSocketServer: _webSocketServer,
    wsServer: _wsServer,
    http: http,
    server: thisServer,
    allPlayers: allPlayers,
    allRooms: allRooms,
    allConns:allConns,
    addPlayer:addPlayer,
    deletePlayer:deletePlayer,
    getPlayer:getPlayer,
    playerExists:playerExists,
    getRandomPasscode:getRandomPasscode,
    sendMessage:sendMessage,
    deleteConnection:function (connection){
        deletePlayer(allConns[connection]);
    },getPlayerByConn:function(connection){
        return getPlayer(allConns[connection]);
    }
};