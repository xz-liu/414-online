
"use strict";
var webSocketsServerPort=443;
var thisServer=http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
  });
thisServer.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port "
     + webSocketsServerPort);
});
var _websocketServer=require('websocket').server;
var _wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info 
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: thisServer
  });
var idNow=0;
module.exports={
    port:webSocketsServerPort,
    webSocketServer:_websocketServer,
    wsServer:_wsServer,
    http:require('http'),
    server :thisServer,
    idDistribute:function(){
        return ++idNow;
    },

}