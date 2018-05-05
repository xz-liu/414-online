"use strict";
var cardOps = require('./cards');
var rules = require('./gamerules');
var websocket = require('./config');
var room=require('./gameroom');
var status = {
    OUTSIDE: 1,
    WAITING: 2,
    WIN: 3,
};
const
    DTYPE_ENTERROOM = 'room',//
    DTYPE_BEGIN = 'begin',//no data 
    DTYPE_DRAWCARDS = 'draw',//{'cards':[card1,card2,card3...]}
    DTYPE_PASS = 'pass',//no data
    DTYPE_CREATEROOM = 'create',//{'passcode':passcode}
    DTYPE_CHA = 'cha',//{'cards':[card1,card2]}
    DTYPE_GO = 'go';//{'card':card}
const
    STYPE_CREATESUCCESS = 'create',//{'passcode':passCode}
    STYPE_ENTERSUCCESS = 'enterSucc',//{'names':[names...]}
    STYPE_ENTERFAILED = 'enterFail',//{'reason':reason}
    STYPE_WINS = 'wins',//{'name':name} to all players
    STYPE_ENTERS = 'enters',//{'name':name} to all players
    STYPE_LEAVES = 'leaves',//{'name':name} to all players
    STYPE_PLAYERROUND = 'round',//{'begin':name,'next':name,'cha':name,'go':name}
    STYPE_ROUNDENDS = 'endround',//no data
    STYPE_DRAWSUCCEED = 'drawSucceed',//{'combtype':type }  to current player
    STYPE_DRAWFAILED = 'drawFailed',//no data , to current player
    STYPE_PLAYERDRAW = 'draw',//{'name':name,'cards':[cards...]}
    STYPE_PLAYERPASS = 'pass',//{'name':name} to all players
    STYPE_PLAYERCHA = 'cha',//{'name':name,'cards':[cards...]} to all players
    STYPE_PLAYERGO = 'go',//{'name':name,'card':card} to all players
    STYPE_GETCARD = 'card',//{'cards':[cards...]} 
    STYPE_LOSE='lose',
    STYPE_GAMEENDS='gameEnds',
    STYPE_MYROUND='myRound';//{'draw':bool} if is false then only pass
class Player {
    constructor(name, connection) {
        this.name = name;
        this.status = status.WAITING;
        this.room = null;
        this.cards=[];
        this.connection = connection;
        this.drawType=undefined;
    }

    set cards(c){
        this.cards=c;
    }

    playerQuit(){
        if(this.room){
            this.room.endGame();
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case DTYPE_CREATEROOM:
                this.room=new room.GameRoom(this);
            break;
            case DTYPE_ENTERROOM:
                if(data.data.passCode){
                    var roomNow=room.getRoom(data.data.passCode);
                    if(roomNow.addNewPlayer(this,data.data.passCode)){
                        this.room=roomNow;
                    }
                }else{
                    this.sendMsgWithType(STYPE_ENTERFAILED,
                        {'reason':'Passcode Not Set'}
                    );
                }
            break;
            case DTYPE_BEGIN:
                if(this.room){
                    this.room.beginGame(this.name);
                }
            break;
            case DTYPE_DRAWCARDS:
            case DTYPE_CHA:
            case DTYPE_GO:
                if(data.data.cards){
                    this.drawCards(data.data.cards);
                }
                this.checkWin();
                break;
            case DTYPE_PASS:
                if(this.room){
                    this.room.passThisRound(this);
                }
        }
    }
    
    autoPass(){
        this.room.passThisRound(this);
    }

    autoDraw(){
        if(this.cards.length>0){
           this.drawCards([this.cards.shift()]);
        }
        this.checkWin();
    }

    checkWin(){
        if(this.cards.length===0){
            this.room.playerWins(this);
        }
    }

    sendMessage(msg) {
        this.connection.sendUTF(JSON.stringify(msg));
    }
    sendMsgWithType(type,data){
        this.sendMessage({'type':type,'data':data});
    }
    getCards(cards) {
        this.status = status.OUTSIDE;
        this.cards = cards;
    }
    haveCha(card) {
        var sameCnt = 0;
        for (var i in this.cards) {
            if (card[0] === this.cards[i][0]) {
                sameCnt++;
            }
        }
        return sameCnt >= 2;
    }
    haveGo(card) {
        var sameCnt = 0;
        for (var i in this.cards) {
            if (card[0] === this.cards[i][0]) {
                sameCnt++;
            }
        }
        return sameCnt >= 1;
    }
    canDrawCards(cards) {
        for (var i in cards) {
            if (!this.cards.includes(cards[i]))
                return false;
        }
        return true;
    }

    drawCards(cards) {
        if (this.canDrawCards(cards)) {
            if(this.room.playerDrawCards(this,cards,this.drawType)){
                for (var i in cards) {
                    this.cards.splice(
                        this.cards.indexOf(cards[i]), 1
                    );
                }
                this.room.checkCGAndResetLast(this,cards);
            }
        }
    }
}

module.exports = {
    status: status,
    Player: Player,

    DTYPE_ENTERROOM ,//
    DTYPE_BEGIN ,//no data 
    DTYPE_DRAWCARDS,//{'cards':[card1,card2,card3...]}
    DTYPE_PASS ,//no data
    DTYPE_CREATEROOM ,//{'passcode':passcode}
    DTYPE_CHA,//{'cards':[card1,card2]}
    DTYPE_GO,//{'c
    STYPE_CREATESUCCESS,//{'passcode':passCode}
    STYPE_ENTERSUCCESS,//{'names':[names...]}
    STYPE_ENTERFAILED ,//{'reason':reason}
    STYPE_WINS ,//{'name':name} to all players
    STYPE_ENTERS ,//{'name':name} to all players
    STYPE_LEAVES,//{'name':name} to all players
    STYPE_PLAYERROUND ,//{'begin':name,'next':name,'cha':name,'go':name}
    STYPE_ROUNDENDS,//no data
    STYPE_DRAWSUCCEED,//{'combtype':type }  to current player
    STYPE_DRAWFAILED,//no data , to current player
    STYPE_PLAYERDRAW ,//{'name':name,'cards':[cards...]}
    STYPE_PLAYERPASS ,//{'name':name} to all players
    STYPE_PLAYERCHA,//{'name':name,'cards':[cards...]} to all players
    STYPE_PLAYERGO,//{'name':name,'card':card} to all players
    STYPE_GETCARD,
    STYPE_LOSE,
    STYPE_GAMEENDS
};