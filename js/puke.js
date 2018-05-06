var doc = document,
    gameScreen = doc.getElementsByClassName("game_screen")[0],
    userPokerArea = gameScreen.getElementsByClassName("user_poker_area")[0],
    bringOutButton = gameScreen.getElementsByClassName("bring_out_button")[0];
    //doc.body.style.setProperty("--height",window.innerHeight + "px");

    var testGetPoker = ["A1","A2","A3","A4","JB","JS","A1","A1","A1","A1","A1","A1","JB","JB","JB","JB","JB","JB"];
    // alert(testGetPoker.length);
     
     function getPokerClass(str){
         switch (str){
             case '1':return "pok_diamond";
             case '2':return "pok_club";
             case '3':return "pok_heart";
             case '4':return "pok_spade";
             case 'B':return "pok_big";
             case 'S':return "pok_small";
             default:return "wrong";
         }
     }
     function createPokerDom(type, val){
         var dom = document.createElement("div"),
         leftUp = document.createElement("span"),
         rightDown = document.createElement("span");
 
         if(val !== 'J'){
             leftUp.innerHTML = val;
             rightDown.innerHTML = val;
         }else{
             leftUp.innerHTML = "JOKER";
             rightDown.innerHTML = "JOKER";
             dom.classList.add("pok_joker");
         }
         val = (val !== 'J')?val:"JOKER";
 
         dom.classList.add(type);
         dom.classList.add("user_poker");
         dom.classList.add("poker");
         
         
         leftUp.classList.add("poker_lu");
         rightDown.classList.add("poker_rd");
         dom.appendChild(leftUp);
         dom.appendChild(rightDown);
         return dom;
     }
     function createUserPoker(json){
         var curClass = "",
         i = 0,
         newPokerDom;
         for(; i < json.length; i++){
             curClass = getPokerClass((json[i])[1]);
             if(curClass !== "wrong"){
                 newPokerDom = createPokerDom(curClass,(json[i])[0]);
                 userPokerArea.appendChild(newPokerDom);
             }else{
 
             }
         }
     }
     function resetFirstPoker(){
         var pokers = userPokerArea.getElementsByClassName("user_poker");
         if(pokers.length > 0){
             pokers[0].style.marginLeft = "0%";
         }
     }
     function resetPokerMargin(){
         var len = userPokerArea.getElementsByClassName("user_poker").length;
         if(len > 0){
             doc.body.style.setProperty("--pokerMargin",75 + "px");
         }
     }
 
     function startAnim(){
 
     }
     function startGame(json){
         startAnim();
         createUserPoker(json);
     }
     function clickPoker(dom){
         if(dom.classList.contains("poker_selected")){
             dom.classList.remove("poker_selected");
         }else{
             dom.classList.add("poker_selected");
         }
     }
     function clickBringOut(){
 
     }
     function bringOut(json){
 
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
             poker = pokerSelected[0];
             pokerDoms[i] = poker;
             rect = rectArr[i];
             userPokerArea.removeChild(poker);
             poker.classList.remove("user_poker");
             poker.classList.remove("poker_selected");
             
             poker.style.top = rect.top + "px";
             poker.style.left = rect.left + "px";
             poker.classList.add("poker_out");
             gameScreen.appendChild(poker);
         }
         setTimeout(function(){
             for(var i = 0; i < pokerDoms.length; i++){
                 pokerDoms[i].style.top = 250 + "px";
                 pokerDoms[i].style.left = 450 + i*30+ "px";
             }
         },500);
     }
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
     //createUserPoker(testGetPoker);
 