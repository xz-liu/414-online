(function(){
    var isM = isMobile();
    function isMobile(){
        var UA = navigator.userAgent,
        agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPhone"],
        i = 0;
        for(; i < agents.length; i++){
            if(UA.indexOf(agents[i]) > 0){
                alert(agents[i]);
                return true;
            }
        }
        return false;
    }
    //reStyle();
    function fullScreen(elem){
        if(elem.requestFullscreen){
            elem.requestFullscreen();
        }else if(elem.mozRequestFullscreen){
            elem.mozRequestFullScreen();alert("1");
        }else if(elem.msRequestFullscreen){
            elem.msRequestFullscreen();alert("2");
        } else if(elem.webkitRequestFullscreen) {
            elem.webkitRequestFullScreen();alert("3");
        }
    }
    function reStyle(){
        if(isM){
            MobileStyle();
        }else{
            PCStyle();
        }
    }
    
    /*gameScreen.addEventListener("click",function(){
        fullScreen(gameScreen);
        setTimeout(reStyle,500);
        //PCStyle();
        //alert(window.innerHeight);
    });*/

    function PCStyle(){
        
        fullScreen(document);
        var cssVars = document.body.style,
        width = window.innerWidth,//1536
        height = window.innerHeight;//759
        cssVars.setProperty("--height",window.innerHeight + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(150*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-75*height/759) + "px");
    }
    function MobileStyle(){
        fullScreen(document);
        var cssVars = document.body.style,
        height = window.innerWidth,//1536
        width = window.innerHeight;//759
        doc.body.classList.add("horizontal");
        cssVars.width = width + "px";
        cssVars.height = height + "px";
        cssVars.setProperty("--height",window.innerHeight + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(150*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-75*height/759) + "px");
    }
    reStyle();
})()