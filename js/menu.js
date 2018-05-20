function resetInput(){
    if(curInput){
        curInput.style.display = "none";
        menuInput.style.height = 0 + "";
    }
}
function getContentHeight(dom){
    if(!isM){ 
        return dom.getBoundingClientRect().height;
    }else{
        return dom.getBoundingClientRect().width;
    }
}
function getContentWidth(dom){
    if(!isM){
        return dom.getBoundingClientRect().width;
    }else{
        return dom.getBoundingClientRect().height;
    }
}
function enterInput(dom){
    dom.style.display = "block";
    curInput = dom;
    menuInput.style.height = getContentHeight(dom) + getContentWidth(menuInput)*0.1 +"px";
}
function enterNameInput(){
    resetInput();
    enterInput(menuName);
    document.getElementById("input_name").focus();
}
function enterWaitInput(){
    resetInput();
    enterInput(document.getElementById("menu_wait"));
}
function enterErrorInput(str){
    str = str || "";
    resetInput();
    var menuError = document.getElementById("menu_error");
    menuError.innerHTML = "<p>ERROR: " + str + "</p>";
    enterInput(menuError);
}
/*
function enterNoticeInput(){
    resetInput();

    menuName.style.display = "block";
    menuInput.style.height = getContentHeight(menuWait) + getContentWidth(menuInput)*0.1 +"px";
}
*/
function enterRoomInput(){
    resetInput();
    enterInput(menuRoom);
    document.getElementById("input_room").focus();
}