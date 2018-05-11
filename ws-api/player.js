// "use strict";
require('./globals');
var cardOps = require('./cards');
var rules = require('./gamerules');
var websocket = require('./config');
var room = require('./gameroom');
module.exports.types = types;
// var
//     DTYPE_ENTERROOM = 'room',//
//     DTYPE_BEGIN = 'begin',//no data 
//     DTYPE_DRAWCARDS = 'draw',//{'cards':[card1,card2,card3...]}
//     DTYPE_PASS = 'pass',//no data
//     DTYPE_CREATEROOM = 'create',//{'passcode':passcode}
//     DTYPE_CHA = 'cha',//{'cards':[card1,card2]}
//     DTYPE_GO = 'go';//{'card':card}
// var
//     STYPE_CREATESUCCESS = 'create',//{'passcode':passCode}
//     STYPE_ENTERSUCCESS = 'enterSucc',//{'names':[names...]}
//     STYPE_ENTERFAILED = 'enterFail',//{'reason':reason}
//     STYPE_WINS = 'wins',//{'name':name} to all players
//     STYPE_ENTERS = 'enters',//{'name':name} to all players
//     STYPE_LEAVES = 'leaves',//{'name':name} to all players
//     STYPE_PLAYERROUND = 'round',//{'begin':name,'next':name,'cha':name,'go':name}
//     STYPE_ROUNDENDS = 'endround',//no data
//     STYPE_DRAWSUCCEED = 'drawSucceed',//{'combtype':type }  to current player
//     STYPE_DRAWFAILED = 'drawFailed',//no data , to current player
//     STYPE_PLAYERDRAW = 'draw',//{'name':name,'cards':[cards...]}
//     STYPE_PLAYERPASS = 'pass',//{'name':name} to all players
//     STYPE_PLAYERCHA = 'cha',//{'name':name,'cards':[cards...]} to all players
//     STYPE_PLAYERGO = 'go',//{'name':name,'card':card} to all players
//     STYPE_GETCARD = 'card',//{'cards':[cards...]} 
//     STYPE_LOSE='lose',
//     STYPE_GAMEENDS='gameEnds',
//     STYPE_MYROUND='myRound';//{'draw':bool} if is false then only pass
class Player {
    constructor(name, connection) {
        this.name = name;
        this.room = null;
        this.cards = [];
        this.connection = connection;
        this.drawType = [];
    }


    playerQuit(returnHome = false) {
        if (this.room) {
            this.room.sendToAllPlayer(types.STYPE_LEAVES, { 'name': this.name });
            this.room.endGame();
            this.room = undefined;
        } else {
            if (returnHome) this.sendFailMessage(errors._NOT_IN_ROOM);
        }
    }

    sendFailMessage(reason) {
        this.sendMsgWithType('failed', { 'code': reason });
    }

    handleMessage(data) {
        debug('handling data:'+ data);
        if (!data.type) return;
        switch (data.type) {
            case types.DTYPE_CREATEROOM: {
                if (this.room) {
                    this.sendFailMessage(errors._ALREADY_IN_ROOM);
                } else {
                    this.room = new room.GameRoom(this);
                }
            }
                break;
            case types.DTYPE_ENTERROOM:
                if (!data.data) return;
                if (data.data.passCode) {
                    var roomNow = room.getRoom(data.data.passCode);
                    if (!roomNow) this.sendFailMessage(errors._PASSCODE_INCORRECT);
                    else {
                        if (this.room) {
                            this.sendFailMessage(errors._ALREADY_IN_ROOM);
                        }
                        else {
                            if (roomNow && roomNow.addNewPlayer(this, data.data.passCode)) {
                                this.room = roomNow;
                            } else this.sendFailMessage(errors._PASSCODE_INCORRECT);
                        }
                    }
                } else {
                    this.sendFailMessage(errors._PASSCODE_INCORRECT);
                }
                break;
            case types.DTYPE_BEGIN:
                if (this.room) {
                    this.room.beginGame(this);
                }
                break;
            case types.DTYPE_DRAWCARDS:
                if (!data.data) return;
                if (data.data.cards) {
                    this.playerSelect = null;
                    this.drawCards(data.data.cards);
                }
                this.checkWin();
                break;
            case types.DTYPE_CHA:
                if (!data.data) return;
                if (data.data.cards) {
                    this.playerSelect = DRAW_CHA;
                    this.drawCards(data.data.cards);
                }
                this.checkWin();
                break;
            case types.DTYPE_GO:
                if (!data.data) return;
                if (data.data.cards) {
                    this.playerSelect = DRAW_GO;
                    this.drawCards(data.data.cards);
                }
                this.checkWin();
                break;
            case types.DTYPE_PASS:
                if (this.room) {
                    this.room.passThisRound(this);
                } break;
            case types.DTYPE_RETURNHOME:
                this.playerQuit(true);
        }
    }

    autoPass() {
        this.room.passThisRound(this);
    }

    autoDraw() {
        if (this.cards.length > 0) {
            this.drawCards([this.cards.shift()]);
        }
        this.checkWin();
    }

    checkWin() {
        if (this.cards.length === 0) {
            this.room.playerWins(this);
        }
    }

    sendMessage(msg) {
        // console.log("Msg :" + msg);
        debug('Send Message ' + JSON.stringify(msg));
        this.connection.sendUTF(JSON.stringify(msg));
    }
    sendMsgWithType(type, data) {
        // var msgX=[];
        // msgX['type']=type;
        // msgX['data']=data;
        // this.sendMessage(msgX);
        // console.log(type);
        // console.log(data);
        this.sendMessage({ 'type': type, 'data': data });
    }
    getCards(cards) {
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
        var drawTypeNow;
        if (this.playerSelect) {
            if (this.drawType.includes(this.playerSelect))
                drawTypeNow = this.playerSelect;
        } else {
            if (this.drawType.includes(DRAW_BEGIN))
                drawTypeNow = DRAW_BEGIN;
            if (this.drawType.includes(DRAW_NEXT))
                drawTypeNow = DRAW_NEXT;
        }
        if (drawTypeNow) {
            if (this.canDrawCards(cards)) {
                if (this.room.playerDrawCards(this, cards, drawTypeNow)) {
                    for (var i in cards) {
                        this.cards.splice(
                            this.cards.indexOf(cards[i]), 1
                        );
                    }
                    debug(this.cards);
                    this.room.checkCGAndResetLast(this, cards);
                } else this.sendFailMessage(errors._CARD_COMB_INVALID);
            }else this.sendFailMessage(errors._CARD_NOT_POSSESSED_EXISTS);
        } else this.sendFailMessage(errors._NOT_YOUR_ROUND);
    }
}

module.exports = {
    Player: Player,
    // types:Object.freeze({
    //     DTYPE_ENTERROOM: DTYPE_ENTERROOM ,//
    //     DTYPE_BEGIN:DTYPE_BEGIN ,//no data 
    //     DTYPE_DRAWCARDS:DTYPE_DRAWCARDS,//{'cards':[card1,card2,card3...]}
    //     DTYPE_PASS:DTYPE_PASS ,//no data
    //     DTYPE_CREATEROOM:DTYPE_CREATEROOM ,//{'passcode':passcode}
    //     DTYPE_CHA:DTYPE_CHA,//{'cards':[card1,card2]}
    //     DTYPE_GO:DTYPE_GO,//{'c
    //     STYPE_CREATESUCCESS:STYPE_CREATESUCCESS,//{'passcode':passCode}
    //     STYPE_ENTERSUCCESS:STYPE_ENTERSUCCESS,//{'names':[names...]}
    //     STYPE_ENTERFAILED:STYPE_ENTERFAILED ,//{'reason':reason}
    //     STYPE_WINS :STYPE_WINS,//{'name':name} to all players
    //     STYPE_ENTERS:STYPE_ENTERS,//{'name':name} to all players
    //     STYPE_LEAVES:STYPE_LEAVES,//{'name':name} to all players
    //     STYPE_PLAYERROUND :STYPE_PLAYERROUND,//{'begin':name,'next':name,'cha':name,'go':name}
    //     STYPE_ROUNDENDS:STYPE_ROUNDENDS,//no data
    //     STYPE_DRAWSUCCEED:STYPE_DRAWSUCCEED,//{'combtype':type }  to current player
    //     STYPE_DRAWFAILED:STYPE_DRAWFAILED,//no data , to current player
    //     STYPE_PLAYERDRAW:STYPE_PLAYERDRAW ,//{'name':name,'cards':[cards...]}
    //     STYPE_PLAYERPASS:STYPE_PLAYERPASS ,//{'name':name} to all players
    //     STYPE_PLAYERCHA:STYPE_PLAYERCHA,//{'name':name,'cards':[cards...]} to all players
    //     STYPE_PLAYERGO:STYPE_PLAYERGO,//{'name':name,'card':card} to all players
    //     STYPE_GETCARD:STYPE_GETCARD,
    //     STYPE_LOSE:STYPE_LOSE,
    //     STYPE_GAMEENDS:STYPE_GAMEENDS
    // })
};