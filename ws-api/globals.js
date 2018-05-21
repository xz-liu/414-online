global.types = {
    DTYPE_ENTERROOM: 'room',//
    DTYPE_BEGIN: 'begin',//no data 
    DTYPE_DRAWCARDS: 'draw',//{'cards':[card1,card2,card3...]}
    DTYPE_PASS: 'pass',//no data
    DTYPE_CREATEROOM: 'create',//{'passcode':passcode}
    DTYPE_CHA: 'cha',//{'cards':[card1,card2]}
    DTYPE_GO: 'go',//{'cards':[card1]}
    DTYPE_RETURNHOME: 'home',//return to homepage(leave current room)
    DTYPE_HEARTBEAT: 'hb',
    STYPE_CREATESUCCESS: 'create',//{'passcode':passCode}
    STYPE_ENTERSUCCESS: 'enterSucc',//{'names':[names...]}
    STYPE_ENTERFAILED: 'failed',//{'reason':reason}
    STYPE_WINS: 'wins',//{'name':name} to all players
    STYPE_ENTERS: 'enters',//{'name':name} to all players
    STYPE_LEAVES: 'leaves',//{'name':name} to all players
    STYPE_PLAYERROUND: 'round',//{'begin':name,'next':name,'cha':name,'go':name}
    STYPE_ROUNDENDS: 'endround',//no data
    STYPE_DRAWSUCCEED: 'drawSucceed',//{'combtype':type }  to current player
    STYPE_DRAWFAILED: 'failed',//no data , to current player
    STYPE_PLAYERDRAW: 'draw',//{'name':name,'cards':[cards...]}
    STYPE_PLAYERPASS: 'pass',//{'name':name} to all players
    STYPE_PLAYERCHA: 'cha',//{'name':name,'cards':[cards...]} to all players
    STYPE_PLAYERGO: 'go',//{'name':name,'card':card} to all players
    STYPE_GETCARD: 'card',//{'cards':[cards...]} 
    STYPE_LOSE: 'lose',//no data
    STYPE_GAMEENDS: 'gameEnds',//no data
    STYPE_PLAYERALMOSTWIN: 'almostWin',//{'name':name,'cardsCnt':cnt}
    STYPE_HEARTBEAT: 'hb',//
};
global.nbTypes = {
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
};

global.msgBox = {
    S_NEWMSG: 'msgNew',//[name,date,msg]
    S_HISTORY: 'msgHistory',//[[name1,date1,msg1],[name2,date2,msg2]....]
    S_SENDFAIL: 'msgSendFailed',//no data
    D_SEND: 'msgSendNew',//msg
}

global.DRAW_BEGIN = 'begin';
global.DRAW_NEXT = 'next';
global.DRAW_CHA = 'cha';
global.DRAW_GO = 'go';

global.errors = {
    _NAME_TOO_LONG: 0,
    _NAME_ALREADY_EXISTS: 1,
    _NOT_IN_ROOM: 2,
    _ALREADY_IN_ROOM: 3,
    _PASSCODE_INCORRECT: 4,
    _CARD_COMB_INVALID: 5,
    _CARD_NOT_POSSESSED_EXISTS: 6,
    _NOT_YOUR_ROUND: 7,
    _ONLY_HOST_CAN_START: 8,
    _ROOM_MEMBER_NOT_ENOUGH: 9,
    _ROOM_PLAYING: 10,
    _PLAYER_ALREADY_DELETED: 11,
};

global.debug = function (e) {
    console.log(JSON.stringify(e));
}
global.debug_raw = function (e) {
    console.log(e);
}
global.debug_array = function (e) {
    this.debug(e);
}
global.debug_players = function (e) {
    this.debug_raw(e.length + " {");
    for (var i in e) {
        this.debug_raw(e[i].name);
    }
    this.debug_raw("}");
}
global.escapeHtml = function (text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
global.getKeyByVal = function (arr, val) {
    for (var i in arr) {
        if (arr[i] === val) return i;
    }
    return null;
}