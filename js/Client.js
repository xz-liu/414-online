// var defaultServer = 'wss://414.joker.im:443/api';
var testArg = {
    url:"",
    open:function(){},
    error:function(){},
    timeover:function(){},
    reSuccess:function(){}
};

function isSupportSocket(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    return window.WebSocket;
}


function ClientSocket(arg){
    this.arg = arg || {};
    this.url = arg.url || defaultServer;
    this.initJSONHandler();
    this.initSocket();
    this.isTimeover = false;
    this.token = null;
    this.isReconnect = false;
    this.isReconnecting = false;
}
ClientSocket.prototype = {
    initJSONHandler : function(){
        this.JSONHandlerList = {};
        var that = this;
        this.JSONHandlerList["hb"] = function(){
            if(!that.isReconnecting){
                that.socket.send(JSON.stringify({type : "hb"}));
            }else{
                that.isReconnecting = false;
                that.socket.send(JSON.stringify({type : "hb", data : that.token}));
            }
        };
        this.JSONHandlerList["renewalSucc"] = this.arg.reSuccess || function(){
            console.log("re succ");
        }
    },
    setToken : function(token){
        this.token = token;
    },
    reconnect : function(){
        this.initSocket();
        this.isReconnect = true;
        this.isReconnecting = true;
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
    initSocket : function(){
        var arg = this.arg;
        that = this;
        this.isTimeover = false;
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
        var timer = setInterval(function() {
            if (that.socket.readyState !== 1) {
                if(that.isTimeover === false){
                    that.isTimeover = true;
                    if(arg.timeover){
                        arg.timeover();
                    }else{
                        console.log("connect time over!");
                    }
                }else{
                    clearInterval(timer);
                    timer = null;
                }
                
            }
        }, 3000);
    }
};