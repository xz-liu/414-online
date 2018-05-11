function Game(socket, passcode, playerName, isHost){
    this.socket = socket;
    this.playerName = playerName;
    this.passcode = passcode;
    this.isHost = isHost;
    this.playerList = [];

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
    },
    close : function(){
        document.getElementById("user_oper").style.display = "none";
    },
    initGameScreen : function(){
        document.getElementById("player_name").innerHTML = this.playerName;
        document.getElementById("room_passcode").innerHTML = "邀请码: " + this.passcode;
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
    
    }
};

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
    console.log(this.pokerSelected);
    test_bringOut(this.pokerSelectedDom);
}