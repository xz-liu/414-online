require('./globals');
var config = require('./config');
var cardOps = require('./cards');

var filePlayer = require('./player');
var rules = require('./gamerules');
var Player = filePlayer.Player;
// const types=filePlayer.types;
// console.log('check!'+types.STYPE_ENTERSUCCESS);
class GameRoom {
    constructor(player) {
        this.players = [player];
        this.interval = 30000;
        var passCode;
        do {
            passCode = config.getRandomPasscode();
        } while (config.allRooms[passCode]);
        this.passCode = passCode;
        // console.log(types.STYPE_CREATESUCCESS);
        // player.sendMessage({'type':types.STYPE_CREATESUCCESS});
        player.sendMsgWithType(types.STYPE_CREATESUCCESS, {
            'passcode': passCode
        });
        config.allRooms[passCode] = this;
        this.msgBoxHistory = [];
        this.gaming = false;
    }
    playerInRoomCheck(player) {
        return player && this.players.includes(player);
    }
    msgPlayerSend(player, msg) {
        if (this.playerInRoomCheck(player)) {
            msg = escapeHtml(msg);
            let newMsg = [player.name, new Date(), msg];
            this.msgBoxHistory.push(newMsg);
            this.sendToAllPlayer(msgBox.S_NEWMSG, newMsg);
        } else {
            if (player) player.sendMsgWithType(msgBox.S_SENDFAIL);
        }
    }
    msgSendHistory(player) {
        if (this.playerInRoomCheck(player)) {
            player.sendMsgWithType(msgBox.S_HISTORY, this.msgBoxHistory);
        }
    }
    drawNext(nbComb, drawType, cards, player) {
        var good = true;
        if (this.lastNBString) {
            var virtualLast = this.lastNBString;
            if (drawType === DRAW_CHA) {
                good = (cards.length === 2 && cards[0][0] === cards[1][0]
                    && cards[0][0] === this.lastNBString[0]);
            }
            if (drawType === DRAW_GO) {
                good = this.lastType == DRAW_CHA &&
                    (cards.length === 1 && cards[0][0] === this.lastNBString[0]);
                if (good) virtualLast = nbTypes.VIRTUAL_CHA;
            }
            debug_raw('draw next!!!' + drawType);
            debug_raw('last_NBSTRING:' + this.lastNBString + " " + good);
            // if(drawType === DRAW_BEGIN)drawType
            if (good && rules.combCmp(nbComb, virtualLast)) {
                this.sendToAllPlayer(drawType,
                    { 'name': player.name, 'cards': cards }
                );
                var combtype = rules.getNBType(nbComb);
                player.sendMsgWithType(types.STYPE_DRAWSUCCEED,
                    { 'combtype': combtype }
                );
                switch (drawType) {
                    case types.STYPE_PLAYERCHA:
                    case types.STYPE_PLAYERGO:
                        if (this.roundNow[DRAW_NEXT]) {
                            this.roundNow[DRAW_NEXT].sendMsgWithType
                                (types.STYPE_ROUNDENDS);
                        }
                        break;
                    case types.STYPE_PLAYERDRAW:
                        if (this.roundNow[DRAW_CHA]) {
                            this.roundNow[DRAW_CHA].sendMsgWithType
                                (types.STYPE_ROUNDENDS);
                        }
                        if (this.roundNow[DRAW_GO]) {
                            this.roundNow[DRAW_GO].sendMsgWithType
                                (types.STYPE_ROUNDENDS);
                        }

                }
                this.lastPlayer = player;
                this.lastReal = player;
                this.lastType = drawType;
                return true;
            }
        }
        return false;
    }

    playerDrawCards(player, cards, drawType) {
        var nbComb = cardOps.cardsToNBString(cards);
        if (rules.validComb(nbComb)) {
            debug_raw('==player draw cards:' + player.name);
            debug(cards);
            debug_raw(drawType);
            switch (drawType) {
                case DRAW_BEGIN:
                    this.sendToAllPlayer(types.STYPE_PLAYERDRAW,
                        { 'name': player.name, 'cards': cards }
                    );
                    var combtype = rules.getNBType(nbComb);
                    player.sendMsgWithType(types.STYPE_DRAWSUCCEED,
                        { 'combtype': combtype }
                    );
                    this.beginNotRespond = null;

                    this.lastPlayer = player;
                    this.lastReal = player;
                    this.lastType = DRAW_BEGIN;
                    return true;
                case DRAW_CHA:
                    return this.drawNext(nbTypes.VIRTUAL_CHA,
                        types.STYPE_PLAYERCHA, cards, player);
                case DRAW_GO:
                    return this.drawNext(nbTypes.VIRTUAL_GO,
                        types.STYPE_PLAYERGO, cards, player);
                case DRAW_NEXT:
                    if (this.drawNext(nbComb,
                        types.STYPE_PLAYERDRAW, cards, player)) {
                        this.nextNotRespond = null;
                        return true;
                    }

            }
        }
        return false;
    }
    sendToAllPlayer(type, msg) {
        // debug('actually sending!');
        for (var i in this.players) {
            this.players[i].sendMsgWithType(type, msg);
        }
    }
    resetLast(player, cards, drawType) {
        debug('check cards after draw');
        var nbS = cardOps.cardsToNBString(cards);
        var type = rules.getNBType(nbS);
        // var ret;
        this.roundNow = [];
        if (drawType === DRAW_CHA) {//go
            for (var i in this.players) {
                if (this.players[i].haveGo(cards[0])) {
                    this.roundNow[nbTypes.NBT_GO] = this.players[i];
                }
            }
        } else if (type === nbTypes.NBT_SINGLE &&
            (drawType === DRAW_BEGIN || drawType === DRAW_NEXT)) {//cha check
            for (var i in this.players) {
                if (this.players[i].haveCha(cards[0])) {
                    this.roundNow[nbTypes.NBT_CHA] = this.players[i];
                }
            }
        }
        this.lastNBString = nbS;
        this.nextPlayer();
        // return ret;
    }
    playerAlmostWin(player,cnt){
        if(this.playerInRoomCheck(player)){
            this.sendToAllPlayer(types.STYPE_PLAYERALMOSTWIN,
                {'name':player.name,'cardsCnt':cnt}
            );
        }
    }
    playerWins(player) {
        if (!this.wins.includes(player)) {
            this.wins.push(player);
            if (this.wins.length >= this.players.length - 1) {
                var lost = this.getNxtNotWonPlayer(player);
                lost.sendMsgWithType(types.STYPE_LOSE);
                this.endGame();
            }
            this.sendToAllPlayer(types.STYPE_WINS, {
                'name': player.name
            });
            this.msgPlayerSend(player, 'Ohhhhhhhhhh! I Won!!!');
            if (this.lastPlayer)
                this.lastPlayer = this.getNxtNotWonPlayer(this.lastPlayer);
            if (this.lastReal)
                this.lastReal = this.getNxtNotWonPlayer(this.lastReal);
        }

    }
    getNxtNotWonPlayer(nxtPlayer) {
        var playerIndex = this.players.indexOf(nxtPlayer);
        // var nxtPlayer = this.players[nowPlayer];
        do {
            debug('loop');
            nxtPlayer = this.players[(playerIndex + 1) % this.players.length];
        } while (this.wins.includes(nxtPlayer));
        debug("select " + nxtPlayer);
        return nxtPlayer;
    }
    nextPlayer() {
        debug('goto nxt player');
        debug(this.lastReal.name);
        this.roundNow[DRAW_BEGIN] =
            this.roundNow[DRAW_NEXT] = null;
        var nxtPlayer = this.getNxtNotWonPlayer(this.lastReal);
        if (nxtPlayer === this.lastPlayer) {
            this.roundNow[DRAW_BEGIN] = nxtPlayer;
        } else {
            this.roundNow[DRAW_NEXT] = nxtPlayer;
        }
        this.roundSendAuto();
    }
    roundSendAuto() {
        var begin = this.roundNow[DRAW_BEGIN],
            next = this.roundNow[DRAW_NEXT],
            cha = this.roundNow[DRAW_CHA],
            go = this.roundNow[DRAW_GO];
        this.roundSendMsg(begin, next, cha, go);
    }
    passThisRound(player) {
        this.lastReal = player;
        this.sendToAllPlayer(types.STYPE_PLAYERPASS,
            { 'name': player.name }
        );
        this.nextPlayer();
    }

    addNewPlayer(player, passCode) {
        if (passCode !== this.passCode) {
            player.sendFailMessage(errros._PASSCODE_INCORRECT);
            return false;
        }
        var names = [];
        this.sendToAllPlayer(types.STYPE_ENTERS,
            { 'name': player.name }
        );
        for (var i in this.players) {
            names.push(this.players[i].name);
        }
        player.sendMsgWithType(types.STYPE_ENTERSUCCESS,
            { 'names': names }
        );
        this.players.push(player);
        this.msgSendHistory(player);
        player.sendMsgBox('Hello Everyone!');
        return true;
    }
    playerLeaves(player) {
        this.players.splice(this.players.indexOf(player), 1);
        this.sendToAllPlayer(types.STYPE_LEAVES, { 'name': player.name });
        this.endGame();
    }
    endGame() {
        if (this.gaming) {
            this.sendToAllPlayer(types.STYPE_GAMEENDS);
            this.lastNBString = undefined;
        }
    }
    beginAuto() {
        if (this.beginNotRespond) {
            this.beginNotRespond.autoDraw();
        }
    }
    nextAuto() {
        if (this.nextNotRespond) {
            this.nextNotRespond.autoPass();
        }
    }
    roundSendMsg(begin, nxt, cha, go) {
        var msg = {
            'begin': begin ? begin.name : null,
            'next': nxt ? nxt.name : null,
            'cha': cha ? cha.name : null,
            'go': go ? go.name : null
        };

        for (var i in this.roundNow) {
            debug('draw type: ' + i + ', val:' + this.roundNow[i]);
            if (this.roundNow[i])
                this.roundNow[i].drawType = [];
        }
        for (var i in this.roundNow) {
            if (this.roundNow[i])
                this.roundNow[i].drawType.push(i);
        }

        if (begin) {
            this.beginNotRespond = begin;
            setTimeout(this.beginAuto, this.interval);
        }
        if (nxt) {
            this.nextNotRespond = nxt;
            setTimeout(this.nextAuto, this.interval);
        }
        // debug('sending!');
        this.sendToAllPlayer(types.STYPE_PLAYERROUND, msg);
    }

    beginGame(player) {
        if (player) {
            if (this.gaming) {
                if (this.players.length >= 2) {
                    if (player.name === this.players[0].name) {
                        //game begins
                        var cardsForEach = cardOps.distributeCards(this.players.length);
                        for (var i in cardsForEach) {
                            this.players[i].cards = cardsForEach[i];
                            this.players[i].sendMsgWithType('card', { 'cards': cardsForEach[i] });
                        }

                        var startWith = Math.floor(Math.random() * 1000) % this.players.length;
                        this.lastNBString = undefined;
                        this.lastPlayer = undefined;
                        this.lastType = undefined;
                        this.lastReal = undefined;
                        this.roundNow = [];
                        this.wins = [];
                        this.roundNow[DRAW_BEGIN] = this.players[startWith];
                        this.roundSendMsg(this.players[startWith]);
                        this.gaming = true;
                        return true;
                    }
                    else player.sendFailMessage(errors._ONLY_HOST_CAN_START);
                } else player.sendFailMessage(errros._ROOM_MEMBER_NOT_ENOUGH);
            } else player.sendFailMessage(errors._ROOM_PLAYING);
        }
        return false;
    }
}
module.exports = {
    GameRoom: GameRoom,
    getRoom: function (code) {
        return config.allRooms[code];
    }
};