function MobilePokerManager(){
    this.UPARect = null;
    this.pokerRects = [];
    this.curPoker = null;
    this.init();
}
MobilePokerManager.prototype = {
    init : function(){
        this.UPARect = userPokerArea.getBoundingClientRect();
        var pokers = userPokerArea.getElementsByClassName("user_poker"),
        len = pokers.length,
        i = 0,
        rect;
        if(!isFull){
            for(; i < len; i++){
                rect = pokers[i].getBoundingClientRect();
                this.pokerRects[i] = {
                    top : rect.top,
                    bottom : rect.bottom
                }
            }
        }else{
            for(; i < len; i++){
                rect = pokers[i].getBoundingClientRect();
                this.pokerRects[i] = {
                    left : rect.left,
                    right : rect.right
                }
            }
        }
        
    },
    touchedDOM : function(x, y){
        var pokers = userPokerArea.getElementsByClassName("user_poker"),
        len = pokers.length,
        i = len - 1;
        if(isM && thisChat && thisChat.isTouch(x, y)){
            return null;
        }
        if(!isFull){
            for(; i >= 0; i--){
                if(y > this.pokerRects[i].top && y < this.pokerRects[i].bottom){
                    return pokers[i];
                }
            }
        }else{
            for(; i >= 0; i--){
                if(x > this.pokerRects[i].left && x < this.pokerRects[i].right){
                    return pokers[i];
                }
            }
        }
        
        return null;
    },
    isTouchArea : function(x, y){
        return (x > this.UPARect.left)&&(x < this.UPARect.right)&&(y > this.UPARect.top)&&(y < this.UPARect.bottom);
    },
    handle : function(x, y){
        if(this.isTouchArea(x, y)){
            var poker = this.touchedDOM(x, y);
            if(poker && this.curPoker !== poker){
                this.curPoker = poker;
                clickPoker(poker);
            }
        }
    },
    click : function(DOM){
        this.curPoker = DOM;
        clickPoker(DOM);
    },
    touchUp : function(){
        this.curPoker = null;
    }
};