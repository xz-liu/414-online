    enterWaitInput();
    
    if(isSupportSocket()){
        var roomIDUrl = getQueryString("room");
        if(roomIDUrl && roomIDUrl.length > 0){
            isInvited = true;
            pCode = roomIDUrl;
        }
        socket = new ClientSocket({
            open:enterNameInput,
            error:enterErrorInput,
            timeover:linkError
            /*open:test,
            error:test*/
        });
    }else{
        enterErrorInput("浏览器不支持WebSocket");
    }



    function getQueryString(name) {// game.html?pass=DDDDDD
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
           return unescape(r[2]);
        }
        return null;
    }

    // fail
    function fail(data){
        console.log("FAILL!!!!!!");
        if(data){
            if(data.code){
                switch (data.code){
                    case 1:setNameFail();break;
                    case 4:passcodeNotExist();break;
                    case 5:drawInvalid();break;
                    case 9:memberNotEnough();break;
                    case 10:enterErrorInput("此房间正在进行游戏");break;
                    default:break;
                }
            }
        }else{ // no data
        }
    }
    //
    function linkError(){
        if(thisChat){
            thisChat.cleanHistory();
            thisChat = null;
        }
        if(thisGame){
            thisGame.exitRoom();
            thisGame = null;
        }
        enterErrorInput("连接中断，请刷新重进");
    }
    // menu
    function setNameSuccess(){
        if(isInvited){
            socket.send("room",{passCode:pCode});
            isInvited = false;
        }else{
            enterRoomInput();
        }
        
    }
    function setNameFail(){
        enterErrorInput("名字已经存在");
        setTimeout(function(){
            enterNameInput();
        },1000);
    }
    function passcodeNotExist(){
        enterErrorInput("邀请码不存在");
        setTimeout(function(){
            enterRoomInput();
        },1000);
    }

    // room
    function createRoomSuccess(json){
        var passCode = json.passcode;
        thisGame = new Game(socket, passCode, pName, true);
        thisChat = new Chat(pName);
        
    }
    function otherEnter(json){
        console.log(json.name + " enter!!");
        Notice.otherEnter(json.name);
        if(thisGame){
            thisGame.otherEnter(json.name);
        }
    }
    function otherLeave(json){
        Notice.otherLeave(json.name);
        console.log(json.name + " leave!!");
        if(thisGame){
            thisGame.otherLeave(json.name);
        }
    }
    function enterSuccess(json){
        thisGame = new Game(socket, pCode, pName, false);

        thisGame.enterRoom(json.names);
        thisChat = new Chat(pName);
    }
    function memberNotEnough(){
        Notice.memberNotEnough();
        document.getElementById("start_game_button").style.display = "block";
    }


    // game
    function dealPoker(json){
        if(thisGame){
            thisGame.open();
            thisGame.dealPoker(json.cards);
        }
        if(isM){
            mobilePokerManager = new MobilePokerManager();
        }
    }
    function round(json){
        if(thisGame){
            thisGame.round(json.begin, json.next, json.cha, json.go);
        }
    }
    function endRound(json){
    }
    function otherCha(json){
        if(thisGame){
            thisGame.otherCha(json.name, json.cards);
        }
    }
    function otherGo(json){
        if(thisGame){
            thisGame.otherGo(json.name, json.cards);
        }
    }
    function drawSuccess(json){
        if(thisGame){
            thisGame.drawSuccess(json.combtype);
        }
    }
    function otherDraw(json){
        if(thisGame){
            thisGame.otherDraw(json.name, json.cards);
        }
    }
    function otherPass(json){
        if(thisGame){
            thisGame.otherPass(json.name);
        }
    }
    function soWins(json){
        if(thisGame){
            thisGame.someoneWin(json.name);
        }
    }
    function lose(){
        Notice.lose();
        if(thisGame){
            thisGame.lose();
        }
    }
    function gameEnds(){
        Notice.noOperNotice("游戏结束");
        if(thisGame){
            thisGame.gameEnds();
        }
    }
    function soAlmostWin(json){
        if(thisGame){
            thisGame.someoneAlmostWin(json.name, json.cardsCnt);
        }
    }
    function drawInvalid(){
        Notice.noOperNotice("无效的出牌");
    }


    // chat
    function showMsgHistory(json){
        if(thisChat){
            thisChat.showHistory(json);
        }
    }
    function showNewMsg(json){
        if(thisChat){
            thisChat.addMsg(json[0], json[2], json[1]);
        }
        
    }
    function msgSendFail(json){
        /*if(thisChat){
            thisChat.showHistory(json);
        }*/
    }



    function test(){
        document.getElementById("menu_screen").style.display = "none";
        document.getElementById("game_screen").style.display = "block";
    }

    
    
    
    // name
    socket.set("success",setNameSuccess);
    socket.set("failed",fail);

    // room
    socket.set("create",createRoomSuccess);
    socket.set("enters",otherEnter);
    socket.set("leaves",otherLeave);
    socket.set("enterSucc",enterSuccess);
    socket.set("enetrFail",fail);
    
    // game
    socket.set("card",dealPoker);
    socket.set("drawSucceed",drawSuccess);
    socket.set("draw",otherDraw);
    socket.set("cha",otherCha);
    socket.set("go",otherGo);
    socket.set("pass",otherPass);
    socket.set("round",round);
    socket.set("endround",endRound);
    socket.set("wins",soWins);
    socket.set("lose",lose);
    socket.set("gameEnds",gameEnds);
    socket.set("almostWin",soAlmostWin);

    // chat
    socket.set("msgNew",showNewMsg);
    socket.set("msgHistory",showMsgHistory);
    socket.set("msgSendFailed",msgSendFail);

    // create name
    document.getElementById("input_name").onkeydown = function(ev){
        if(ev && ev.keyCode === 13){
            if(this.value.length !== 0){
                resetInput();
                enterWaitInput();
                pName = this.value;
                socket.send("name",this.value);
            }
        }
    }
    document.getElementById("input_name_button").onclick = function(){
        var input = document.getElementById("input_name");
        if(input.value.length !== 0){
            resetInput();
            enterWaitInput();
            pName = input.value;
            socket.send("name",input.value);
        }
    }


    // enter room
    document.getElementById("input_room").onkeydown = function(ev){
        if(ev && ev.keyCode === 13){
            if(this.value.length !== 0){
                resetInput();
                enterWaitInput();
                pCode = this.value;
                socket.send("room",{passCode:this.value});
            }
        }
    }
    document.getElementById("input_room_button").onclick = function(){
        var input = document.getElementById("input_room");
        if(input.value.length !== 0){
            resetInput();
            enterWaitInput();
            pCode = input.value;
            socket.send("room",{passCode:input.value});
        }
    }

    // create room
    document.getElementById("create_room_button").onclick = function(){
        resetInput();
        enterWaitInput();
        socket.send("create");
    }

    // exit room
    document.getElementById("exit_game_button").onclick = function(){
        Notice.exitRoom();
    }
    
    // host start game
    document.getElementById("start_game_button").onclick = function(){
        console.log("begin button clicked!!!!!!!!!!");
        if(thisGame){
            if(thisGame.isRoomHost()){
                this.style.display = "none";
                socket.send("begin");
            }
        }
    }
    // invite
    document.getElementById("room_passcode").onclick = function(){
        Notice.inviteNotice(document.getElementById("invite_passcode").innerHTML);

    }

    // user oper
    document.getElementsByClassName("bring_out_button")[0].onclick = function(){
        if(thisGame){
            var pokers = thisGame.draw();
            if(pokers){
                socket.send("draw",{cards:pokers});
            }
            
        }
    }
    document.getElementsByClassName("cha_button")[0].onclick = function(){
        if(thisGame){
            var pokers = thisGame.cha();
            if(pokers){
                socket.send("cha",{cards:pokers});
            }
            
        }
    }
    document.getElementsByClassName("go_button")[0].onclick = function(){
        if(thisGame){
            var pokers = thisGame.go();
            if(pokers){
                socket.send("go",{cards:pokers});
            }
            
        }
    }
    document.getElementsByClassName("pass_button")[0].onclick = function(){
        if(thisGame){
            /*var pokers = thisGame.pass();
            if(pokers){
                socket.send("pass");
            }*/
            thisGame.pass();
            socket.send("pass");
        }
    }

    // chat
    document.getElementById("chat_input_button").onclick = function(){
        var msgInput = document.getElementById("chat_input");
        if(msgInput.value.length !== 0){
            socket.send("msgSendNew",msgInput.value);
        }
    }
    document.getElementById("chat_input").onkeydown = function(e){
        if(e.keyCode === 13){
            if(this.value.length !== 0){
                socket.send("msgSendNew",this.value);
            }
        }
    }

    // notice
    Notice.exitRoomEnter = function(){
        if(thisGame){
            thisGame.exitRoom();
            
            thisGame = null;
            socket.send("home");
            thisChat.cleanHistory();
            thisChat = null;
            enterRoomInput();
        }
    }