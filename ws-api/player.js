"use strict";
var status={
   PLAYING:1,
   NOT_PLAYING:2
};
class Player{
    constructor(name) {
        this.name=name;
        this.status=status.NOT_PLAYING;
    }
    getCards(cards){
        this.status=status.PLAYING;
        this.cards=cards;
    }
    haveCha(card){

    }
    haveGo(card){

    }
    canDrawCards(cards){
        
    }
    drawCards(cards){

    }
}

module.exports={
    status,Player
};