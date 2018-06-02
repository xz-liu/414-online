function Chat(pName){
    this.chatList = document.getElementById("chat_list");
    this.chatRoom = gameScreen.getElementsByClassName("chat_room")[0];
    this.pName = pName;
    this.init();
}
Chat.prototype = {
    init : function(){
        if(isM){
            this.chatOpen = document.getElementById("chat_room_open");
            this.newMsgNumDOM = this.chatOpen.getElementsByClassName("chat_new_num")[0];
            this.newMsgNumDOM.innerHTML = "0";
            this.newMsgNum = 0;
            this.isChatOpen = false;
        }
    },
    isTouch : function(x, y){
        return this.isChatOpen && x > this.chatRoom.getBoundingClientRect().x;
    },
    cleanHistory : function(){
        this.chatList.innerHTML = "";
    },
    showHistory : function(msgArr){
        for (var i = 0; i < msgArr.length; i++) {
            this.addMsg(msgArr[i][0], msgArr[i][2], msgArr[i][1]);
        }
        
    },
    addMsg : function(name, msg, date){
        
        var msgDOM = document.createElement("li"),
        ncDOM = document.createElement('div'),
        nameDOM = document.createElement('p'),
        content = document.createElement('p'),
        timeDOM = document.createElement('p');

        nameDOM.classList.add("chat_name");
        nameDOM.innerHTML=name;
        content.classList.add('chat_content');
        content.innerHTML=msg;
        timeDOM.classList.add('chat_time');
        timeDOM.innerHTML=date;

        if (this.pName === name) {
            document.getElementById("chat_input").value = "";
            nameDOM.classList.add('chat_self');
            content.classList.add('chat_self');
        }
        ncDOM.classList.add("chat_nc");
        ncDOM.appendChild(nameDOM);
        ncDOM.appendChild(content);
        msgDOM.appendChild(ncDOM);
        msgDOM.appendChild(timeDOM);
        this.chatList.appendChild(msgDOM);
        if(isM){
            this.addMsgForM();
        }
        //this.scrollToBottom();
    },
    addMsgForM : function(){
        if(!this.isChatOpen){
            this.newMsgNum++;
            this.newMsgNumDOM.innerHTML = "" + this.newMsgNum;
            this.newMsgNumDOM.style.display = "inline";
        }
    },
    displayRoom : function(){
        if(this.isChatOpen){
            this.chatRoom.classList.remove("chat_room_display");
            this.isChatOpen = false;
            //this.newMsgNumDOM.style.display = "inline";
        }else{
            this.chatRoom.classList.add("chat_room_display");
            this.isChatOpen = true;
            this.newMsgNumDOM.style.display = "none";
            this.newMsgNumDOM.innerHTML = "0";
            this.newMsgNum = 0;
        }
    },
    scrollToBottom : function(){
        this.chatList.scrollTop = this.chatList.scrollHeight;
        //this.chatList.scrollTo(0,this.chatList.scrollHeight)
    }
};

if(isM){
    document.getElementById("chat_room_open").onclick = function(){
        if(thisChat){
            thisChat.displayRoom();
        }
    }
}