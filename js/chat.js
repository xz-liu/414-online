var chatList = document.getElementById("chat_list");
function Chat(pName){
    this.chatList = document.getElementById("chat_list");
    this.pName = pName;
}
Chat.prototype = {
    cleanHistory : function(){
        this.chatList.innerHTML = "";
    },
    showHistory : function(msgArr){
        for (var i = 0; i < msgArr.length; i++) {
            this.addMsg(msgArr[i][0], msgArr[i][2], msgArr[i][1]);
        }
    },
    addMsg : function(name, msg, date){
        
        // var msgDom = document.createElement("li");
        var nameDom=document.createElement('li');
        var content=document.createElement('li');
        var timeDom=document.createElement('li');
        nameDom.classList.add("chat_name");
        nameDom.innerHTML=name;
        content.classList.add('chat_content');
        content.innerHTML=msg;
        timeDom.classList.add('chat_time');
        timeDom.innerHTML=date;
        if (this.pName === name) {
            document.getElementById("chat_input").value = "";
            nameDom.classList.add('chat_self');
            content.classList.add('chat_self');
        }
        chatList.appendChild(nameDom);
        chatList.appendChild(content);
        chatList.appendChild(timeDom);
        // 
        var msgBreak = document.createElement('li');
        msgBreak.classList.add('chat_break');
        chatList.appendChild(msgBreak);
        // 
    }
};