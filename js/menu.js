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
function getContentHeight(dom){
    console.log(dom.getBoundingClientRect());
    if(!isM){
        
        return dom.getBoundingClientRect().height;
    }else{
        return dom.getBoundingClientRect().width;
    }
}
function getContentWidth(dom){
    //console.log(dom.getBoundingClientRect());
    if(!isM){
        return dom.getBoundingClientRect().width;
    }else{
        return dom.getBoundingClientRect().height;
    }
}
function enterInput(dom){
    dom.style.display = "block";
}
function enterNameInput(){
    resetInput()
    menuName.style.display = "block";
    menuInput.style.height = getContentHeight(menuName) + getContentWidth(menuInput)*0.1 +"px";
    
    curInput = menuName;
}
function enterWaitInput(){
    resetInput()
    var menuWait = document.getElementById("menu_wait");
    menuWait.style.display = "block";
    curInput = menuWait;
    menuInput.style.height = getContentHeight(menuWait) + getContentWidth(menuInput)*0.1 +"px";
}
function enterErrorInput(str){
    str = str || "";
    resetInput()
    var menuError = document.getElementById("menu_error");
    menuError.style.display = "block";
    menuError.innerHTML = "<p>ERROR: " + str + "</p>";
    menuInput.style.height = getContentHeight(menuError) + getContentWidth(menuInput)*0.1 +"px";
    curInput = menuError;
}
function enterNoticeInput(){
    resetInput()
    menuName.style.display = "block";
    menuInput.style.height = getContentHeight(menuWait) + getContentWidth(menuInput)*0.1 +"px";
}
function enterRoomInput(){
    resetInput()
    menuRoom.style.display = "block";
    menuInput.style.height = getContentHeight(menuRoom) + getContentWidth(menuInput)*0.1 +"px";
    curInput = menuRoom;
}