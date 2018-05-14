
function OtherPlayer(name, classType){
    this.name = name;
    this.dom = this.createPlayerDom(classType);
    //this.area = null;
    this.area = document.getElementById("player_area");
    //this.area.appendChild(this.dom);
    this.enterArea();
    //this.cardCntSpan = null;
}
OtherPlayer.prototype = {
    createPlayerDom : function(classType){
        var dom = document.createElement("div"),
        nameSpan = document.createElement("p"),
        cardCntSpan = document.createElement("p");

        dom.classList.add("other_player");
        dom.classList.add(classType);

        nameSpan.innerHTML = this.name;
        dom.appendChild(nameSpan);

        cardCntSpan.innerHTML = "TEST";
        dom.appendChild(cardCntSpan);
        this.cardCntSpan = cardCntSpan;

        return dom;
    },
    leave : function(){
        this.area.removeChild(this.dom);
    },
    removeDom : function(){
        this.area.removeChild(this.dom);
    },
    enterArea : function(){
        var frontPlayers = this.area.getElementsByClassName("frontPlayer"),
        backPlayers = this.area.getElementsByClassName("backPlayer");
        if(frontPlayers.length !== 0){// 插在
            this.area.insertBefore(this.dom, frontPlayers[frontPlayers.length - 1]);
            this.area.insertBefore(frontPlayers[frontPlayers.length - 1], this.dom);
        }else if(backPlayers.length !== 0){
            this.area.insertBefore(this.dom, backPlayers[0]);
        }else{
            this.area.appendChild(this.dom);
        }
    },
    almostWin : function(cardsCnt){
        this.cardCntSpan.innerHTML = "剩余" + cardsCnt + "张牌";
        this.cardCntSpan.style.display = "block";
    }
};

function Game(socket, passcode, playerName, isHost){
    this.socket = socket;
    this.playerName = playerName;
    this.passcode = passcode;
    this.isHost = isHost;
    this.isOpen = false;

    // 房间里玩家列表，与服务器顺序相同
    this.playerList = [];
    if(isHost){
        this.playerList[0] = {
            name : playerName
        }
    }

    this.handPoker = null;

    this.pokerSelected = null;
    this.pokerSelectedDom = null;

    this.drawButton = document.getElementById("draw_button");
    this.goButton = document.getElementById("go_button");
    this.chaButton = document.getElementById("cha_button");
    this.passButton = document.getElementById("pass_button");

    this.init();
    
}
Game.prototype = {
    isRoomHost:function(){
        return this.isHost;
    },
    enterGameScreen : function(){
        var gameScreen = document.getElementById("game_screen"),
            menuScreen = document.getElementById("menu_screen");
        gameScreen.style.display = "block";
        menuScreen.style.display = "none";
    },
    init : function(){
        this.enterGameScreen();
        this.initGameScreen();
    },
    open : function(){
        document.getElementById("user_oper").style.display = "block";
        document.getElementById("start_game_button").style.display = "none";
        this.isOpen = true;
    },
    close : function(){
        document.getElementById("user_oper").style.display = "none";
        this.isOpen = false;
    },
    exitRoom : function(){
        for(var i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].name !== this.playerName){
                this.playerList[i].leave();
            }
        }

        this.chaButton.classList.remove("user_oper_button_enabled");
        this.goButton.classList.remove("user_oper_button_enabled");
        this.passButton.classList.remove("user_oper_button_enabled");
        this.drawButton.classList.remove("user_oper_button_enabled");
        this.chaButton.classList.add("user_oper_button_disabled");
        this.goButton.classList.add("user_oper_button_disabled");
        this.passButton.classList.add("user_oper_button_disabled");
        this.drawButton.classList.add("user_oper_button_disabled");

        document.getElementById("user_poker_area").innerHTML = "";

        this.cleanDrawArea();
        this.exitGameScreen();
    },
    enterRoom : function(names){
        for(var i = 0; i < names.length; i++){
            this.playerList[i] = new OtherPlayer(names[i],"frontPlayer");
            this.playerList[i].enterArea();
        }
        this.playerList[i] = {
            name : this.playerName
        }
        this.playerAreaAdjust();
    },
    otherEnter : function(name){
        var newPlayer = new OtherPlayer(name, "backPlayer");
        this.playerList[this.playerList.length] = newPlayer;
        newPlayer.enterArea();
        this.playerAreaAdjust();
    },
    otherLeave : function(name){

        // 若离开的人是房主，则按照顺序下一个人变成房主
        // 删除 playerList 中 name
        for(var i = 0; i < this.playerList.length; i++){
            if(name === this.playerList[i].name && this.playerList[i].name !== this.playerName){
                this.playerList[i].leave();
                if(i === 0 && this.playerList[1].name === this.playerName){
                    this.becomeHost();
                }
                this.playerList.splice(i, 1);
                
                break;
            }
        }

        this.playerAreaAdjust();
    },
    becomeHost : function(){
        this.isHost = true;
        if(!this.isOpen){
            document.getElementsByClassName("start_game_button")[0].style.display = "block";
        }
    },
    playerAreaAdjust : function(){
        var playerArea = document.getElementById("player_area"),
        len = this.playerList.length - 1,
        i = 0,
        player,
        margin,
        width;

        var windowWidth = (isM)?736:window.innerWidth;

        if(len < 6){
            margin = windowWidth*(8 - len)/8/(len + 1);
            width = windowWidth/8;
        }else{
            margin = windowWidth/20;
            width = (windowWidth - margin*(len + 1))/len;
        }
        document.body.style.setProperty("--playerMargin", margin + "px");
        document.body.style.setProperty("--playerWidth", width + "px");
    },
    initGameScreen : function(){
        document.getElementById("player_name").innerHTML = this.playerName;
        document.getElementById("invite_passcode").innerHTML = this.passcode;
        document.getElementById("clip").value = this.passcode;
        if(this.isHost){
            document.getElementsByClassName("start_game_button")[0].style.display = "block";
        }else{
            document.getElementsByClassName("start_game_button")[0].style.display = "none";
        }
    },
    exitGameScreen : function(){
        var gameScreen = document.getElementById("game_screen"),
            menuScreen = document.getElementById("menu_screen");
            
        gameScreen.style.display = "none";
        menuScreen.style.display = "block";
    },
    dealPoker : function(cards){
        var curClass = "",
        i = 0,
        newPokerDom;
        this.handPoker = cards;
        userPokerArea.innerHTML = "";
        for(; i < cards.length; i++){
            curClass = getPokerClass((cards[i])[1]);
            //console.log(curClass);
            if(curClass !== "wrong"){
                newPokerDom = createPokerDom(curClass,(cards[i])[0]);
                userPokerArea.appendChild(newPokerDom);
            }else{
    
            }
        }
    },
    domToPokerName : function(dom){
        if(!dom.classList.contains("pok_joker")){
            var pokerName = dom.getElementsByClassName("poker_lu")[0].innerHTML;
            if(pokerName === "10"){
                pokerName = "X";
            }
            if(dom.classList.contains("pok_diamond")){
                return pokerName + "1";
            }else if(dom.classList.contains("pok_club")){
                return pokerName + "2";
            }else if(dom.classList.contains("pok_heart")){
                return pokerName + "3";
            }else{
                return pokerName + "4";
            }
        }else{
            if(dom.classList.contains("pok_big")){
                return "BJ";
            }else{
                return "SJ";
            }
        }
    },
    getPokerSelected : function(){
        var pokerSelected = document.getElementById("user_poker_area").getElementsByClassName("poker_selected"),
        i = 0;
        this.pokerSelectedDom = [];
        this.pokerSelected = [];
        for(; i < pokerSelected.length; i++){
            this.pokerSelectedDom[i] = pokerSelected[i];
            this.pokerSelected[i] = this.domToPokerName(pokerSelected[i]);
        }
        //return this.pokerSelected.length;
    },
    draw : function(){
        this.getPokerSelected();
        if(this.pokerSelected.length > 0){
            return this.pokerSelected;
        }else{
            return false;
        }
        
    },
    cha : function(){
        this.getPokerSelected();
        if(this.pokerSelected.length === 2){
            return this.pokerSelected;
        }else if(this.pokerSelected.length === 0){
            return false;
        }else{
            return false;
        }
    },
    go : function(){
        this.getPokerSelected();
        if(this.pokerSelected.length === 1){
            return this.pokerSelected;
        }else if(this.pokerSelected.length === 0){
            return false;
        }else{
            return false;
        }
    },
    pass : function(){

    },
    round : function(begin, next, cha, go){
        var drawEn = false,
        goEn = false,
        passEn = false,
        chaEn = false;
        this.chaButton.classList.remove("user_oper_button_disabled");
        this.goButton.classList.remove("user_oper_button_disabled");
        this.passButton.classList.remove("user_oper_button_disabled");
        this.drawButton.classList.remove("user_oper_button_disabled");
        this.chaButton.classList.remove("user_oper_button_enabled");
        this.goButton.classList.remove("user_oper_button_enabled");
        this.passButton.classList.remove("user_oper_button_enabled");
        this.drawButton.classList.remove("user_oper_button_enabled");
    
        if(begin === this.playerName){
            Notice.roundBegin();
            drawEn = true;
            passEn = true;
        }
        if(next === this.playerName){
            drawEn = true;
            passEn = true;
        }
        if(cha === this.playerName){
            chaEn = true;
        }
        if(go === this.playerName){
            goEn = true;
        }
    
        if(drawEn){
            this.drawButton.classList.add("user_oper_button_enabled");
        }else{
            this.drawButton.classList.add("user_oper_button_disabled");
        }
        if(goEn){
            this.goButton.classList.add("user_oper_button_enabled");
        }else{
            this.goButton.classList.add("user_oper_button_disabled");
        }
        if(passEn){
            this.passButton.classList.add("user_oper_button_enabled");
        }else{
            this.passButton.classList.add("user_oper_button_disabled");
        }
        if(chaEn){
            this.chaButton.classList.add("user_oper_button_enabled");
        }else{
            this.chaButton.classList.add("user_oper_button_disabled");
        }
    
    },
    cleanDrawArea : function(){
        var gameScreen = document.getElementById("game_screen"),
        pokerOut = gameScreen.getElementsByClassName("poker_out"),
        len = pokerOut.length;
        for(var i = 0; i < len; i++){
            gameScreen.removeChild(pokerOut[0]);
        }
    },
    otherCha : function(name, cards){
        console.log(name + ": CHA!");
        console.log(cards);
        if(name !== this.playerName){
            this.otherBringOut(cards);
        }
        
    },
    otherBringOut : function(cards){
        var curClass = "",
        i = 0,
        gameScreen = document.getElementById("game_screen"),
        newPokerDom;

        this.cleanDrawArea();

        

        for(; i < cards.length; i++){
            curClass = getPokerClass((cards[i])[1]);
            if(curClass !== "wrong"){
                newPokerDom = createPokerDom(curClass,(cards[i])[0]);
                gameScreen.appendChild(newPokerDom);
                newPokerDom.classList.remove("user_poker");
                newPokerDom.classList.add("poker_out");

                newPokerDom.style.top = 250 + "px";
                newPokerDom.style.left = 450 + i*30+ "px";
            }else{
 
            }
        }
    },
    drawSuccess : function(combtype){
        console.log("comb!!: " + combtype);
        console.log(this.pokerSelected);
        this.cleanDrawArea();
        test_bringOut(this.pokerSelectedDom);
        this.pokerSelectedDom = null;
    },
    someoneAlmostWin : function(name, cardsCnt){
        if(name !== this.playerName){
            for(var i = 0; i < this.playerList.length; i++){
                if(name === this.playerList[i].name){
                    this.playerList[i].almostWin(cardsCnt);
                    break;
                }
            }
        }
    },
    someoneWin : function(name){
        if(name === this.playerName){
            this.win();
        }else{
            Notice.noOperNotice(name + "win");
        }
    },
    lose : function(){
        this.chaButton.classList.remove("user_oper_button_enabled");
        this.goButton.classList.remove("user_oper_button_enabled");
        this.passButton.classList.remove("user_oper_button_enabled");
        this.drawButton.classList.remove("user_oper_button_enabled");
        this.chaButton.classList.add("user_oper_button_disabled");
        this.goButton.classList.add("user_oper_button_disabled");
        this.passButton.classList.add("user_oper_button_disabled");
        this.drawButton.classList.add("user_oper_button_disabled");
    },
    win : function(){
        Notice.win();
        this.chaButton.classList.remove("user_oper_button_enabled");
        this.goButton.classList.remove("user_oper_button_enabled");
        this.passButton.classList.remove("user_oper_button_enabled");
        this.drawButton.classList.remove("user_oper_button_enabled");
        this.chaButton.classList.add("user_oper_button_disabled");
        this.goButton.classList.add("user_oper_button_disabled");
        this.passButton.classList.add("user_oper_button_disabled");
        this.drawButton.classList.add("user_oper_button_disabled");
    },
    gameEnds : function(){
        var mod = this;
        setTimeout(function(){
            mod.initGameScreen();
            document.getElementById("user_poker_area").innerHTML = "";
            mod.cleanDrawArea();
        },5000);
        
    }
};
Game.prototype.otherGo = function(name, card){
    console.log(name + ": GO!");
    console.log(card);
    if(name !== this.playerName){
        this.otherBringOut([card]);
    }
}
Game.prototype.otherDraw = function(name, cards){
    console.log(name + ": DRAW!");
    console.log(cards);
    if(name !== this.playerName){
        this.otherBringOut(cards);
    }
}
Game.prototype.otherPass = function(name){
    /*if(name !== this.playerName){
        this.otherBringOut(cards);
    }*/
    
}