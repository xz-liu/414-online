// "use strict";
require('./globals');
var cardOps = require('./cards');
var rules = require('./gamerules');
var websocket = require('./config');
var room = require('./gameroom');
// module.exports.types = types;
class Player {
    constructor(name, connection) {
        this.name = name;
        this.room = null;
        this.cards = [];
        this.connection = connection;
        this.drawType = [];
    }

    sendMsgBox(data) {
        if (this.room) {
            this.room.msgPlayerSend(this, data);
        }
    }
    playerQuit(returnHome = false) {
        if (this.room) {
            this.sendMsgBox('I QUIT!!!');
            this.room.playerLeaves(this);
            this.room = undefined;
        } else {
            if (returnHome) this.sendFailMessage(errors._NOT_IN_ROOM);
        }
    }

    sendFailMessage(reason) {
        this.sendMsgWithType('failed', { 'code': reason });
    }

    handleMessage(data) {
        debug('handling data:' + data);
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
                break;
            case types.DTYPE_CHA:
                if (!data.data) return;
                if (data.data.cards) {
                    this.playerSelect = DRAW_CHA;
                    this.drawCards(data.data.cards);
                }
                break;
            case types.DTYPE_GO:
                if (!data.data) return;
                if (data.data.cards) {
                    this.playerSelect = DRAW_GO;
                    this.drawCards(data.data.cards);
                }
                break;
            case types.DTYPE_PASS:
                if (this.room) {
                    this.room.passThisRound(this);
                } break;
            case types.DTYPE_RETURNHOME:
                this.playerQuit(true);
                break;
            case msgBox.D_SEND:
                if (data.data) this.sendMsgBox(data.data);
                break;
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
        } else if (this.cards.length <= 3) {
            this.room.playerAlmostWin(this, this.cards.length);
        }
    }

    getCardsCount() {
        if (this.cards.length > 3) return 4;
        return this.cards.length;
    }

    connectionRenewal(conn) {
        this.connection = conn;
        let inRoom = playerStatus.IN_MENU;
        let data = {};
        if (this.room && this.room.playerInRoomCheck(this)) {
            inRoom = playerStatus.IN_ROOM;
            let players=this.room.getAllPlayers();
            data.players=players[0];
            if (this.room.roomPlaying()){
                inRoom = playerStatus.IN_GAME;
                data.cardsCnt=players[1];
                data.roundInfo=this.room.getRoundInfo();
            }
        }
        data.state = inRoom;
        this.sendMsgWithType(types.STYPE_RENEWALSUCC, data);
        if (this.room){
            this.room.msgSendHistory(this);
        }
    }

    getConnection() {
        return this.connection;
    }

    sendMessage(msg) {
        // console.log("Msg :" + msg);
        debug('Send Message ' + JSON.stringify(msg));
        websocket.sendMessage(this.connection, msg);
        // this.connection.sendUTF(JSON.stringify(msg));
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
                    this.room.resetLast(this, cards, drawTypeNow);
                    this.checkWin();
                } else this.sendFailMessage(errors._CARD_COMB_INVALID);
            } else this.sendFailMessage(errors._CARD_NOT_POSSESSED_EXISTS);
        } else this.sendFailMessage(errors._NOT_YOUR_ROUND);
    }
}

module.exports = {
    Player: Player,
};