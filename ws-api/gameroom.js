var Player=require('./player').Player;
var config=require('./config');
class GameRoom{
    constructor(player,roomNumber,passCode) {
        this.number=roomNumber;
        this.players=[player];
        this.passCode=passCode;
    }
    addNewPlayer(player,passCode){
        if(passCode!==this.passCode)return false;
        this.players.push(player);
        return true;
    }
    beginGame()
}
module.exports={
    GameRoom
};