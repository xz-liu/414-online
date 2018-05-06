var menuName = document.getElementById("menu_name"),
    menuInput = document.getElementById("menu_input"),
    menuRoom = document.getElementById("menu_room"),
    menu = document.getElementById("menu"),
    curInput = null;
function resetInput(){
    if(curInput){
        curInput.style.display = "none";
        menuInput.style.height = 0 + "";
    }
}
function enterInput(dom){
    dom.style.display = "block";
}
function enterNameInput(){
    menuName.style.display = "block";
    menuInput.style.height = menuName.getBoundingClientRect().height + 50 +"px";
    curInput = menuName;
}
function enterWaitInput(){
    var menuWait = document.getElementById("menu_wait");
    menuWait.style.display = "block";
    curInput = menuWait;
    menuInput.style.height = menuWait.getBoundingClientRect().height + 50 +"px";
}
function enterErrorInput(){
    var menuError = document.getElementById("menu_error");
    menuError.style.display = "block";
    menuInput.style.height = menuError.getBoundingClientRect().height + 50 +"px";
    curInput = menuError;
}
function enterNoticeInput(){
    menuName.style.display = "block";
    menuInput.style.height = menuName.getBoundingClientRect().height + 50 +"px";
}
function enterRoomInput(){
    menuRoom.style.display = "block";
    menuInput.style.height = menuRoom.getBoundingClientRect().height + 50 +"px";
    curInput = menuRoom;
}