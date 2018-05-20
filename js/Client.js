// var defaultServer = 'wss://414.joker.im:443/api';
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
    this.isTimeover = false;
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
        try{
            this.socket.send(JSON.stringify(((data)?{type:type, data:data}:{type:type})));
        }catch(e){
            console.log("send error");
        }
    },
    initSocket : function(arg){
        that = this;
        that.socket = new WebSocket(this.url),
        
        that.socket.onerror = arg.error || function(){
            console.log("socket error");
        }
        that.socket.onopen = arg.open || function(){
            console.log("socket open");
        }
    
        that.socket.onmessage = function(message){
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.log('Invalid JSON: ', message.data);
                return;
            }
            that.runJSONHander(json);
        }
        setInterval(function() {
            if (that.socket.readyState !== 1) {
                if(that.isTimeover === false){
                    that.isTimeover = true;
                    if(arg.timeover){
                        arg.timeover();
                    }else{
                        console.log("connect time over!");
                    }
                }
                
            }
        }, 3000);
        //this.socket = socket;
    }
};