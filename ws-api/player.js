"use strict";
var cardOps = require('./cards');
var rules = require('./gamerules');
var websocket = require('./config');

var status = {
    PLAYING: 1,
    WAITING: 2,
    WIN: 3,
};
const
    DTYPE_ENTERROOM = 'room',//{'roomId':id,'passcode':passCode}
    DTYPE_BEGIN = 'begin',//no data 
    DTYPE_DRAWCARDS = 'draw',//{'cards':[card1,card2,card3...]}
    DTYPE_PASS = 'pass',//no data
    DTYPE_CREATEROOM = 'create',//{'passcode':passcode}
    DTYPE_CHA = 'cha',//{'cards':[card1,card2]}
    DTYPE_GO = 'go';//{'card':card}
const
    STYPE_ENTERSUCCESS='enterSucc',//{'names':[names...]}
    STYPE_ENTERFAILED='enterFail',//{'reason':reason}
    STYPE_WINS = 'wins',//{'name':name} to all players
    STYPE_ENTERS = 'enters',//{'name':name} to all players
    STYPE_LEAVES = 'leaves',//{'name':name} to all players
    STYPE_PLAYERROUND = 'round',//{'begin':name,'next':name,'cha':name,'go':name}
    STYPE_DRAWSUCCEED = 'drawSucceed',//{'combtype':type }  to current player
    STYPE_DRAWFAILED = 'drawFailed',//no data , to current player
    STYPE_PLAYERDRAW = 'draw',//{'name':name,'cards':[cards...]}
    STYPE_PLAYERPASS = 'pass',//{'name':name} to all players
    STYPE_PLAYERCHA = 'cha',//{'name':name,'cards':[cards...]} to all players
    STYPE_PLAYERGO = 'go',//{'name':name,'card':card} to all players
    STYPE_GETCARD = 'card';//{'cards':[cards...]} 
class Player {
    constructor(name, connection) {
        this.name = name;
        this.status = status.WAITING;
        this.room = null;
        this.connection = connection;
        this.connection.on('message', function (msg) {
            if (msg.type === 'utf8') {
                var data = JSON.parse(msg.utf8Data);
                switch (data.type) {
                    case DTYPE_ENTERROOM:
                    case DTYPE_BEGIN:
                    case DTYPE_CREATEROOM:
                    case DTYPE_DRAWCARDS:
                    case DTYPE_PASS:
                }
            }
        });
    }

    sendMessage(msg) {
        this.connection.sendUTF(JSON.stringify(msg));
    }

    getCards(cards) {
        this.status = status.PLAYING;
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
        var nbComb = cardOps.cardsToNBString(cards);
        return rules.validComb(nbComb);
    }

    drawCards(cards) {
        if (this.canDrawCards(cards)) {
            for (var i in cards) {
                this.cards.splice(
                    this.cards.indexOf(cards[i]), 1
                );
            }
        }
    }
}

module.exports = {
    status, Player
};