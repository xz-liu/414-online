"use strict";
var cardOps = require('./cards');
var rules = require('./gamerules');
var websocket = require('./config');
var status = {
    PLAYING: 1,
    NOT_PLAYING: 2
};
const DTYPE_ADDTOROOM = 'room',
    DTYPE_BEGIN = 'begin',
    DTYPE_DRAWCARDS = 'draw',
    DTYPE_PASS = 'pass',
    DTYPE_CREATEROOM = 'create';
class Player {
    constructor(name, connection) {
        this.name = name;
        this.status = status.NOT_PLAYING;
        this.room = null;
        this.connection = connection;
        this.connection.on('message', function (msg) {
            if (msg.type === 'utf8') {
                var data = JSON.parse(msg.utf8Data);
                switch (data.type) {
                    case DTYPE_ADDTOROOM:
                    case DTYPE_BEGIN:
                    case DTYPE_CREATEROOM:
                    case DTYPE_DRAWCARDS:
                    case DTYPE_PASS:
                }
            }
        });
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