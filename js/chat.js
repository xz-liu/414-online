var chatList = document.getElementById("chat_list");

function cleanHistory(){

}
function showHistory(msgArr){
    for(var i = 0; i < msgArr.length; i++){
        addMsg(msgArr[i].name, msgArr[i].msg, msgArr[i].date);
    }
}
function addMsg(name, msg, date){
    var msgDom = document.createElement("li");
    msgDom.innerHTML = name + " : " + msg + "----" + date;
    chatList.appendChild(msgDom);
}