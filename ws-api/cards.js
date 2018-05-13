//var rules=require('./gamerules');

var allCards = [
    'A1', 'A2', 'A3', 'A4',
    '21', '22', '23', '24',
    '31', '32', '33', '34',
    '41', '42', '43', '44',
    '51', '52', '53', '54',
    '61', '62', '63', '64',
    '71', '72', '73', '74',
    '81', '82', '83', '84',
    '91', '92', '93', '94',
    'X1', 'X2', 'X3', 'X4',
    'J1', 'J2', 'J3', 'J4',
    'Q1', 'Q2', 'Q3', 'Q4',
    'K1', 'K2', 'K3', 'K4',
    'SJ', 'BJ'
];
function shuffleCards(a) {
    for (var i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function cardsSortComp(carda, cardb) {
    const nbString = '3456789XJQKA2SB';
    var indA = nbString.indexOf(carda[0]),
        indB = nbString.indexOf(cardb[0]);
    if (indA === indB) {
        return Math.sign(carda[1] - cardb[1]);
    } else return Math.sign(indA - indB);
}

function distributeCards(playerCnt) {
    var cardsPerm = shuffleCards(allCards);
    var eachPlayer = Math.floor(cardsPerm.length / playerCnt);
    var ret = [];
    for (var i = 0; i < playerCnt; i++) {
        ret[i] = cardsPerm.slice(i * eachPlayer, (i + 1) * eachPlayer);
    }
    var mod = cardsPerm.length % playerCnt;
    for (var i = 0; i < mod; i++) {
        ret[i].push(cardsPerm[cardsPerm.length - 1 - i]);
    }
    for (var i in ret) {
        ret[i].sort(cardsSortComp);
    }
    return ret;
}

function cardsToNBString(cards) {
    var nbString = '';
    for (var i in cards) {
        nbString += cards[i][0];
    }
    return nbString;
}

module.exports = {
    distributeCards: distributeCards,
    cardsToNBString: cardsToNBString
};