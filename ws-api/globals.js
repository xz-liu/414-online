global.types ={
    DTYPE_ENTERROOM : 'room',//
    DTYPE_BEGIN : 'begin',//no data 
    DTYPE_DRAWCARDS : 'draw',//{'cards':[card1,card2,card3...]}
    DTYPE_PASS : 'pass',//no data
    DTYPE_CREATEROOM : 'create',//{'passcode':passcode}
    DTYPE_CHA : 'cha',//{'cards':[card1,card2]}
    DTYPE_GO : 'go',//{'cards':[card1]}
    DTYPE_RETURNHOME:'home',//return to homepage(leave current room)
    STYPE_CREATESUCCESS : 'create',//{'passcode':passCode}
    STYPE_ENTERSUCCESS : 'enterSucc',//{'names':[names...]}
    STYPE_ENTERFAILED : 'failed',//{'reason':reason}
    STYPE_WINS : 'wins',//{'name':name} to all players
    STYPE_ENTERS : 'enters',//{'name':name} to all players
    STYPE_LEAVES : 'leaves',//{'name':name} to all players
    STYPE_PLAYERROUND : 'round',//{'begin':name,'next':name,'cha':name,'go':name}
    STYPE_ROUNDENDS : 'endround',//no data
    STYPE_DRAWSUCCEED : 'drawSucceed',//{'combtype':type }  to current player
    STYPE_DRAWFAILED : 'failed',//no data , to current player
    STYPE_PLAYERDRAW : 'draw',//{'name':name,'cards':[cards...]}
    STYPE_PLAYERPASS : 'pass',//{'name':name} to all players
    STYPE_PLAYERCHA : 'cha',//{'name':name,'cards':[cards...]} to all players
    STYPE_PLAYERGO : 'go',//{'name':name,'card':card} to all players
    STYPE_GETCARD : 'card',//{'cards':[cards...]} 
    STYPE_LOSE:'lose',
    STYPE_GAMEENDS:'gameEnds',
    STYPE_MYROUND:'myRound'
};
global.nbTypes=  {
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