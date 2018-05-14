var Notice = {
    block : document.getElementById("notice_block"),
    exitRoomNoticeDOM : document.getElementsByClassName("exit_room_notice")[0],
    noOperNoticeDOM : document.getElementById("no_oper_notice"),
    noOperNotcieContentDOM : document.getElementById("no_oper_notice_content"),
    showBlock : function(){
        this.block.style.display = "block";
    },
    hiddenBlock : function(){
        this.block.style.display = "none";
    },
    exitRoomEnter : function(){

    },
    exitRoomCancel : function(){

    },
    // 需确认的
    exitRoom : function(){
        this.showBlock();
        setTimeout(function(){
            Notice.exitRoomNoticeDOM.classList.add("exit_room_notice_display");
        },10);
        
        
    },
    exitRoomBack : function(){
        this.hiddenBlock();
        this.exitRoomNoticeDOM.classList.remove("exit_room_notice_display");

    },

    // 无需确认的
    noOperNotice : function(str, time){
        time = time || 1200;
        this.noOperNotcieContentDOM.innerHTML = str;
        this.noOperNoticeDOM.classList.add("no_oper_notice_display");
        setTimeout(function(){
            Notice.noOperNoticeDOM.classList.remove("no_oper_notice_display");
        },time);
    },
    memberNotEnough : function(){
        this.noOperNotice("人数不足，无法开始游戏");
    },
    otherEnter : function(playerName){
        this.noOperNotice("玩家" + playerName + "加入游戏");
    },
    otherLeave : function(playerName){
        this.noOperNotice("玩家" + playerName + "离开");
    },
    roundBegin : function(){
        this.noOperNotice("你的回合", 400);
    },
    gameEnd : function(){
        this.noOperNotice("游戏结束");
    },
    lose : function(){
        this.noOperNotice("you lose");
    },
    win : function(){
        this.noOperNotice("you defeat");
    },
    initEvent : function(){
        document.getElementById("exit_room_enter_button").onclick = function(){
            Notice.exitRoomEnter();
            Notice.exitRoomBack();
        }
        document.getElementById("exit_room_cancel_button").onclick = function(){
            Notice.exitRoomCancel();
            Notice.exitRoomBack();
        }
    }
};
Notice.initEvent();