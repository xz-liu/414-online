(function(){
    var socket = new ClientSocket();
    var socket,
        pCode,
        pName,
        thisGame;
    function getQueryString(name) {// game.html?pass=DDDDDD
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
           return unescape(r[2]);
        }
        return null;
    }

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

    // create room
    document.getElementById("create_room_button").onclick = function(){
        resetInput();
        enterWaitInput();
        socket.send("create");
    }
    // host start game
    document.getElementById("start_game_button").onclick = function(){
        console.log("begin button clicked!!!!!!!!!!");
        if(thisGame){
            if(thisGame.isRoomHost()){
                socket.send("begin")
            }
        }
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

    // fail
    function fail(json){
        console.log("FAILL!!!!!!");
        //console.log(json)
        if(json){
            if(json.reason){
                switch (json.reason){
                    case "enterRoomFail":enterRoomFail();break;
                    default:break;
                }
            }
        }else{ // no data , set name fail
            setNameFail();
        }
    }
    // menu
    function setNameSuccess(){
        resetInput();
        enterRoomInput();
    }
    function setNameFail(){
        resetInput();
        enterErrorInput();
        setTimeout(function(){
            resetInput();
            enterNameInput();
        },1000);
    }
    function enterRoomFail(){
        resetInput();
        enterErrorInput();
        setTimeout(function(){
            resetInput();
            enterRoomInput();
        },1000);
    }

    // room
    function createRoomSuccess(json){
        var passCode = json.passcode;
        thisGame = new Game(socket, passCode, pName, true);
    }
    function otherEnter(json){
        console.log(json.name + " enter!!");
    }
    function otherLeave(json){
        console.log(json.name + " leave!!");
    }
    function enterSuccess(json){
        thisGame = new Game(socket, pCode, pName, false);
    }


    // game
    function dealPoker(json){
        if(thisGame){
            thisGame.open();
            thisGame.dealPoker(json.cards);
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
            thisGame.otherGo(json.name, json.card);
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



    function test(){
        document.getElementById("menu_screen").style.display = "none";
        document.getElementById("game_screen").style.display = "block";
    }

    (function(){
        enterNameInput();
    })()
    
    
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
    socket.set("round",round);
    socket.set("endround",endRound);

    
})()