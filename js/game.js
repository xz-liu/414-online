function Game(socket, passcode, playerName, isHost){
    this.socket = socket;
    this.playerName = playerName;
    this.passcode = passcode;
    this.isHost = isHost;
    this.playerList

    this.handPoker = null;


    this.init();
    
}
Game.prototype.isRoomHost = function(){
    return this.isHost;
}
Game.prototype.enterGameScreen = function(){
    var gameScreen = document.getElementById("game_screen"),
        menuScreen = document.getElementById("menu_screen");
    gameScreen.style.display = "block";
    menuScreen.style.display = "none";
}
Game.prototype.addPlayer = function(){

}
Game.prototype.playerLeave = function(){

}
Game.prototype.init = function(){
    this.enterGameScreen();
    this.initGameScreen();
}
Game.prototype.open = function(){
    document.getElementById("user_oper").style.display = "block";
}
Game.prototype.close = function(){
    document.getElementById("user_oper").style.display = "none";
}
Game.prototype.initGameScreen = function(){
    document.getElementById("player_name").innerHTML = this.playerName;
    document.getElementById("room_passcode").innerHTML = "邀请码: " + this.passcode;
    if(this.isHost){
        document.getElementsByClassName("start_game_button")[0].style.display = "block";
    }else{
        document.getElementsByClassName("start_game_button")[0].style.display = "none";
    }
}
Game.prototype.exitGameScreen = function(){
    var gameScreen = document.getElementById("game_screen"),
        menuScreen = document.getElementById("menu_screen");
    gameScreen.style.display = "none";
    menuScreen.style.display = "block";
}
Game.prototype.dealPoker = function(cards){
    var curClass = "",
    i = 0,
    newPokerDom;
    this.handPoker = cards;
    userPokerArea.innerHTML = "";
    for(; i < cards.length; i++){
        curClass = getPokerClass((cards[i])[1]);
        console.log(curClass);
        if(curClass !== "wrong"){
            newPokerDom = createPokerDom(curClass,(cards[i])[0]);
            userPokerArea.appendChild(newPokerDom);
        }else{

        }
    }
}
Game.prototype.otherCha = function(name, cards){
    console.log(name + ": CHA!");
    console.log(cards);
}
Game.prototype.otherGo = function(name, card){
    console.log(name + ": GO!");
    console.log(card);
}
Game.prototype.otherDraw = function(name, cards){
    console.log(name + ": DRAW!");
    console.log(cards);
}
Game.prototype.otherPass = function(name){
    console.log(name + ": PASS!");
}
Game.prototype.drawSuccess = function(combtype){
    console.log("comb!!: " + combtype);
}
Game.prototype.domToPokerName = function(dom){
    if(!dom.classist.contains("pok_joker")){
        var first = dom.getElementsByClassName("poker_lu").innerHTML[0];
        if(dom.classist.contains("pok_diamond")){
            return first + "1";
        }else if(dom.classist.contains("pok_club")){
            return first + "2";
        }else if(dom.classist.contains("pok_heart")){
            return first + "3";
        }else{
            return first + "4";
        }
    }else{
        if(dom.classist.contains("pok_big")){
            return "JB";
        }else{
            return "JS";
        }
    }
}
Game.prototype.bringOut = function(){
    var pokerSelected = document.getElementById("user_poker_area").getElementsByClassName("poker_selected"),
    retArr = [],
    i = 0;
    for(; i < pokerSelected.length; i++){
        retArr[i] = this.domToPokerName(pokerSelected[i]);
    }
    test_bringOut(pokerSelected);
    return retArr;
}
Game.prototype.draw = function(){
    var pokerSelected = document.getElementById("user_poker_area").getElementsByClassName("poker_selected"),
    retArr = [],
    i = 0;
    for(; i < pokerSelected.length; i++){
        retArr[i] = this.domToPokerName(pokerSelected[i]);
    }
    test_bringOut(pokerSelected);
    return retArr;
}
Game.prototype.cha = function(){

}


