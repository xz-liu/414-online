
    var isM = isMobile(),
    doc = document;
    function isMobile(){
        var UA = navigator.userAgent,
        agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPhone"],
        i = 0;
        for(; i < agents.length; i++){
            if(UA.indexOf(agents[i]) > 0){
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
    if(isM){
        /*document.getElementById("menu_screen").addEventListener("click",function(){
            fullScreen(gameScreen);
            setTimeout(reStyle,500);
        });
        document.getElementById("game_screen").addEventListener("click",function(){
            fullScreen(gameScreen);
            setTimeout(reStyle,500);
        });*/
    }
    function reStyle(){
        if(isM){
            MobileStyle();
        }else{
            PCStyle();
        }
    }
    
    

    function PCStyle(){
        
        fullScreen(document);
        var cssVars = document.body.style,
        width = window.innerWidth,//1536
        height = window.innerHeight;//759
        cssVars.setProperty("--width",width + "px");
        cssVars.setProperty("--height",height + "px");
        // cssVars.setProperty("--userOperWidth",Math.floor(686*width/1920) + "px");
        // cssVars.setProperty("--userOperHeight",Math.floor(686*width/1920) + "px");
        cssVars.setProperty("--menuWidth",Math.floor(686*width/1920) + "px");
        cssVars.setProperty("--menuHeight",Math.floor(400*height/1080) + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(150*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-75*height/759) + "px");
    }
    function MobileStyle(){
        
        var cssVars = document.body.style,
        height = 414,//1536
        width = 736;//759
        
        cssVars.width = width + "px";
        cssVars.height = height + "px";
        cssVars.setProperty("--width",width + "px");
        cssVars.setProperty("--height",height + "px");
        cssVars.position = "absolute";
        cssVars.top = (width - height)/2 + "px";
        cssVars.setProperty("--menuWidth",Math.floor(686*width/1920) + "px");
        cssVars.setProperty("--menuHeight",Math.floor(400*height/1080) + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(150*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-75*height/759) + "px");
        cssVars.setProperty("--titleSize",Math.floor(90*height/759) + "px");

        document.getElementById("menu_screen").style.backgroundImage = "url(4.jpg)";

        doc.body.classList.add("horizontal");
        
    }
    reStyle();