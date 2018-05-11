var defaultServer = 'ws://127.0.0.1:1337';

var testArg = {
    url:"",
    open:function(){},
    error:function(){},
    timeover:function(){}
};

function isSupportSocket(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    return window.WebSocket;
}


function ClientSocket(arg){
    arg = arg || {};
    this.url = arg.url || defaultServer;
    this.initJSONHandler();
    this.initSocket(arg);
}
ClientSocket.prototype = {
    initJSONHandler : function(){
        this.JSONHandlerList = {};
    },
    runJSONHander : function(json){
        console.log(json);
        this.JSONHandlerList[json.type](json.data);
    },
    set : function(type, callback){
        this.JSONHandlerList[type] = callback;
    },
    send : function(type, data){
        if(data){
            this.socket.send(JSON.stringify({
                type:type,
                data:data
            }));
        }else{
            this.socket.send(JSON.stringify({type:type}));
        }
        
    },
    initSocket : function(arg){
        var socket = new WebSocket(this.url),
        mod = this;
        socket.onerror = arg.error || function(){
            console.log("socket error");
        }
        socket.onopen = arg.open || function(){
            console.log("socket open");
        }
    
        socket.onmessage = function(message){
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.log('Invalid JSON: ', message.data);
                return;
            }
            mod.runJSONHander(json);
        }
          setInterval(function() {
            if (socket.readyState !== 1) {
                if(arg.timeover){
                    arg.timeover();
                }else{
                    console.log("connect time over!");
                }
            }
        }, 3000);
        this.socket = socket;
    }
};