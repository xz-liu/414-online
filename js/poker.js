    var isMouseDown,
    mobilePokerManager = null;
    

    document.onmousedown = function(){
        isMouseDown = true;
    }
    document.onmouseup = function(){
        isMouseDown = false;
    }
    function getPokerClass(str){
        switch (str){
            case '1':return "pok_diamond";
            case '2':return "pok_club";
            case '3':return "pok_heart";
            case '4':return "pok_spade";
            case 'J':return "pok_joker";
            default:return "wrong";
        }
    }
    function createPokerDom(type, val){
         var dom = document.createElement("div"),
         leftUp = document.createElement("span"),
         rightDown = document.createElement("span");
 
         switch (val){
             case "B":
                dom.classList.add("pok_big");
                val = "JOKER";
                break;
             case "S":
                dom.classList.add("pok_small");
                val = "JOKER";
                break;
             case "X":
                val = "10";
                break;
         }
         leftUp.innerHTML = val;
         rightDown.innerHTML = val;
 
         dom.classList.add(type);
         dom.classList.add("user_poker");
         dom.classList.add("poker");
         if(!isM){
            dom.classList.add("user_poker_anim");
         }else{
            dom.classList.add("user_poker_trans");
         }
         
         
         leftUp.classList.add("poker_lu");
         rightDown.classList.add("poker_rd");
         dom.appendChild(leftUp);
         dom.appendChild(rightDown);
         return dom;
    }
     function clickPoker(dom){
         if(dom.classList.contains("poker_selected")){
             dom.classList.remove("poker_selected");
         }else{
             dom.classList.add("poker_selected");
         }
     }
 
    function toDrawArea(pokerDOM,i){
        pokerDOM.style.top = drawInfo.y + "px";
        pokerDOM.style.left = drawInfo.x + i*drawInfo.interval+ "px";
    }
     function test_bringOut(pokers){
         var pokerSelected = pokers,
         pokerDoms = [],
         len = pokerSelected.length,
         rectArr = [],
         i = 0,
         poker,
         rect;
         for(; i < len; i++){
             poker = pokerSelected[i];
             rectArr[i] = poker.getBoundingClientRect();
         }
         for(i = 0; i < len; i++){
             poker = pokerSelected[i];
             pokerDoms[i] = poker;
             rect = rectArr[i];
             userPokerArea.removeChild(poker);
             poker.classList.remove("user_poker");
             poker.classList.remove("user_poker_anim");
             poker.classList.remove("poker_selected");
             if(isM && (!isFull)){
                poker.style.top = (window.innerWidth - rect.right) + "px";
                poker.style.left = rect.top + "px";
             }else{
                poker.style.top = rect.top + "px";
                poker.style.left = rect.left + "px";
             }
             
             poker.classList.add("poker_out");
             gameScreen.appendChild(poker);
         }
         setTimeout(function(){
            for(var i = 0; i < pokerDoms.length; i++){
                toDrawArea(pokerDoms[i],i);
            }
             
         },300);
     }
    if(!isM){
        userPokerArea.addEventListener("click", function(ev){
            if(ev.target){
                var dom = ev.target; 
                if(dom.nodeName.toUpperCase() === "SPAN"){
                    dom = dom.parentNode;
                }
                if(dom.classList.contains("user_poker")){
                    clickPoker(dom);
                }
            }
        });
        userPokerArea.addEventListener("mouseover", function(ev){
            if(ev.target){
                var dom = ev.target;
                if(dom.nodeName.toUpperCase() === "SPAN"){
                    dom = dom.parentNode;
                }
                if(dom.classList.contains("user_poker")){
                    //console.log(isMouseDown);
                    if(isMouseDown){
                        //console.log("mouseover" + isMouseDown);
                        clickPoker(dom);
                    }
                }
            }
        });
        
    }else{
        document.ontouchmove = function(ev){
            if(ev && ev.touches){

                var x = ev.touches[0].clientX,
                y = ev.touches[0].clientY;

                if(mobilePokerManager){
                    mobilePokerManager.handle(x, y)
                }
            }
        }
        document.ontouchstart = function(ev){
            if(ev && ev.target && mobilePokerManager){
                var dom = ev.target;
                if(dom.nodeName.toUpperCase() === "SPAN"){
                    dom = dom.parentNode;
                }
                if(dom.classList.contains("user_poker")){
                    mobilePokerManager.click(dom);
                }
            }
        }
        document.ontouchend = function(){
            //console.log("up");
            if(mobilePokerManager){
                mobilePokerManager.touchUp();
            }
        }
    }
    
    gameScreen.ondragstart = function(){
        return false;
    }
    
    