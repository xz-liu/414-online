"use strict";
// X 10, S small, B big
var nbArray = '3456789XJQKA2SB';
var cardNBIndex = [];
(function () {
    for (var i in nbArray) {
        cardNBIndex[nbArray[i]] = i + 1;
    }
})();



const NBT_SINGLE = 'single',
    NBT_PAIR = 'pair',
    NBT_TRIAD = 'triad',
    NBT_TRIAD_W = 'triadW',
    NBT_CONT = 'cont',
    NBT_QUAD = 'quad',
    NBT_JOKER = 'joker',
    NBT_ROCKET = 'rocket',
    NBT_INVALID = 'invalid',
    NBT_HUI = 'hui',
    NBT_CHA = 'cha',
    NBT_GO = 'go';
const NBC_LESS = 0,
    NBC_EQUAL = 1,
    NBC_ABOVE = 2;
const NBI_TYPE = 0,
    NBI_NBVAL = 1,
    NBI_CONT_TYPE = 2,
    NBI_CONT_SIZE = 3,
    NBI_TRAW_TYPE = 2;




var INVALID = [NBT_INVALID];
function checkSame(cards) {
    if (cards.length < 2) return cards.length;
    else {
        var begin = cards[0];
        for (var i in cards) {
            if (cards[i] !== begin) return 0;
        }
        return cards.length;
    }
};

var calNB = [];
calNB[NBT_SINGLE] = function (cards) {
    if (checkSame(cards) === 1) {
        return [NBT_SINGLE, cardNBIndex[cards[0]]];
    } else return INVALID;
};

calNB[NBT_PAIR] = function (cards) {
    if (checkSame(cards) === 2) {
        return [NBT_SINGLE, cardNBIndex[cards[0]]];
    } else return INVALID;
};

calNB[NBT_TRIAD] = function (cards) {
    if (checkSame(cards) === 3) {
        return [NBT_SINGLE, cardNBIndex[cards[0]]];
    } else return INVALID;
};

calNB[NBT_QUAD] = function (cards) {
    if (checkSame(cards) === 4) {
        return [NBT_SINGLE, cardNBIndex[cards[0]]];
    } else return INVALID;
};
calNB[NBT_JOKER] = function (cards) {
    if (cards.length === 2) {
        if (cards.includes('S') && cards.includes('B')) {
            return [NBT_JOKER];
        }
    }
    return INVALID;
};

calNB[NBT_ROCKET] = function (cards) {
    if (cards.length === 3) {
        var cnt4 = 0, cntA = 0;
        for (var i in cards) {
            if (cards[i] === '4') cnt4++;
            if (cards[i] === 'A') cntA++;
        }
        if (cnt4 === 2 && cntA === 1) return [NBT_ROCKET];
    }
    return INVALID;
};

calNB[NBT_TRIAD_W] = function (cards) {
    if (cards.length < 6 && cards.length >= 4) {
        var char1 = cards[0], char2,
            cnt1 = 0, cnt2 = 0;
        for (var i in cards) {
            if (cards[i] === char1) cnt1++;
            else {
                if (char2) {
                    if (char2 === cards[i])
                        cnt2++;
                    else return INVALID;
                } else char2 = cards[i];
            }
        }
        if (cnt1 === 3) {
            return [NBT_TRIAD_W, cardNBIndex[char1], cnt2];
        }
        if (cnt2 === 3) {
            return [NBT_TRIAD_W, cardNBIndex[char2], cnt2];
        }
    }
    return INVALID;
};

function getNxtChar(nowChar) {
    var ind = nbArray.indexOf(nowChar);
    if (ind < 0 || ind >= nbArray.length - 1) {
        return null;
    }
    return nbArray[ind + 1];
};

calNB[NBT_CONT] = function (cards, hui) {
    if (!cards.includes('2')) {
        if (!(hui && cards.includes(hui))) {
            if (cards.length >= 3) {
                var begin = cards[0], beginCnt = 0, nowCnt = 0, nowChar = begin;
                for (var i in cards) {
                    if (cards[i] === begin) beginCnt++;
                    if (cards[i] === nowChar) nowCnt++;
                    else if (getNxtChar(nowChar) === cards[i]) {
                        if (nowCnt != beginCnt) return INVALID;
                        nowChar = cards[i];
                        nowCnt = 1;
                    } else return INVALID;
                }
                if (cards.length % beginCnt) return INVALID;
                var repTimes = cards.length / beginCnt;
                if (repTimes < 3) return INVALID;
                return [NBT_CONT, cardNBIndex[begin], beginCnt, repTimes];
            }
        }
    }
    return INVALID;
};

calNB[NBT_INVALID] = function (cards) {
    return INVALID;
};

function calCombNBIndex(cards, hui) {
    for (var i in calNB) {
        var res = calNB[i](cards, hui);
        if (res != INVALID) return res;
    }
    return INVALID;
}
//1 is cur , 2 is prev
//less is cannot, above is can, equal needs more compare
function combNBTypeCompare(nb1, nb2) {
    if (nb1[NBI_TYPE] === nb2[NBI_TYPE]) {
        switch (nb1[NBI_TYPE]) {
            case NBT_TRIAD_W:
                if (nb1[NBI_TRAW_TYPE] === nb2[NBI_TRAW_TYPE])
                    return NBC_EQUAL;
                else return NBC_LESS;
            case NBT_CONT:
                if (nb1[NBI_CONT_TYPE] === nb2[NBI_CONT_TYPE]
                    && nb1[NBI_CONT_SIZE] == nb2[NBI_CONT_SIZE])
                    return NBC_EQUAL;
                else return NBC_LESS;
            case NBT_CHA:
            case NBT_GO:
            case NBT_HUI:
                return NBC_LESS;
            default:
                return NBC_EQUAL;
        }
    }
    switch (nb1[NBI_TYPE]) {
        case NBT_CONT:
            return NBC_LESS;
        case NBT_PAIR:
        case NBT_TRIAD_W:
        case NBT_SINGLE:
            return NBC_LESS;
        case NBT_QUAD:
            switch (nb2[NBI_TYPE]) {
                case NBT_TRIAD:
                case NBT_PAIR:
                case NBT_SINGLE:
                case NBT_CHA:
                case NBT_HUI:
                    return NBC_ABOVE;
                case NBT_CONT:
                    if (nb2[NBI_CONT_TYPE] < 4)
                        return NBC_ABOVE;
                    else return NBC_LESS;
                default:
                    return NBC_LESS;
            }
        case NBT_TRIAD:
            switch (nb2[NBI_TYPE]) {
                case NBT_PAIR:
                case NBT_SINGLE:
                case NBT_CHA:
                case NBT_HUI:
                case NBT_GO:
                    return NBC_ABOVE;
                case NBT_CONT:
                    if (nb2[NBI_CONT_TYPE] < 3)
                        return NBC_ABOVE;
                    else return NBC_LESS;
                default:
                    return NBC_LESS;
            }
        case NBT_CHA:
            return nb2[NBI_TYPE] == NBT_SINGLE ? NBC_ABOVE : NBC_LESS;
        case NBT_GO:
            return nb2[NBI_TYPE] == NBT_CHA ? NBC_ABOVE : NBC_LESS;
        case NBT_JOKER:
            return nb2[NBI_TYPE] == NBT_ROCKET ? NBC_LESS : NBC_ABOVE;
        case NBT_ROCKET:
            return NBC_ABOVE;
    }
}

function validComb(cards) {
    return calCombNBIndex(cards) !== INVALID;
}

function combNBIndexCompare(cards1, cards2, hui) {
    var nb1 = calCombNBIndex(cards1, hui);
    var nb2 = calCombNBIndex(cards2, hui);
    var cmpType = combNBTypeCompare(nb1, nb2);
    if (cmpType !== NBC_EQUAL) return cmpType;

    return nb1[NBI_NBVAL] > nb2[NBI_NBVAL];
}

module.exports = {
    validComb: validComb,
    combCmp: combNBIndexCompare,
    allCards: nbArray,
    getNBType: function (cards) {
        return calCombNBIndex(cards)[0];
    },
    types: {
        NBT_SINGLE: 'single',
        NBT_PAIR: 'pair',
        NBT_TRIAD: 'triad',
        NBT_TRIAD_W: 'triadW',
        NBT_CONT: 'cont',
        NBT_QUAD: 'quad',
        NBT_JOKER: 'joker',
        NBT_ROCKET: 'rocket',
        NBT_INVALID: 'invalid',
        NBT_HUI: 'hui',
        NBT_CHA: 'cha',
        NBT_GO: 'go',
        VIRTUAL_HUI: ['hui'],
        VIRTUAL_CHA: ['cha'],
        VIRTUAL_GO: ['go']
    },
};



