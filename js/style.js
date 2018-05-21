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
    
    function fullScreen(elem){
        if(elem.requestFullscreen){
            elem.requestFullscreen();
        }else if(elem.mozRequestFullscreen){
            elem.mozRequestFullScreen();
        }else if(elem.msRequestFullscreen){
            elem.msRequestFullscreen();
        } else if(elem.webkitRequestFullscreen) {
            elem.webkitRequestFullScreen();
        }
    }
    function exitScreen(elem){
        if(elem.exitFullscreen){
            elem.exitFullscreen();
        }else if(elem.mozCancelFullscreen){
            elem.mozCancelFullScreen();
        }else if(elem.msExitFullscreen){
            elem.msExitFullscreen();
        } else if(elem.webkitExitFullscreen) {
            elem.webkitExitFullScreen();
        }
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
        cssVars.setProperty("--menuWidth",Math.floor(686*width/1920) + "px");
        cssVars.setProperty("--menuHeight",Math.floor(400*height/1080) + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(150*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-75*height/759) + "px");
        cssVars.setProperty("--inputHeight",Math.floor(30*height/759) + "px");
        cssVars.setProperty("--UPALeft",Math.floor(width*0.25) + "px");

        drawInfo = {
            x : 450*width/1536,
            y : 250*height/759,
            interval : 30*width/1536
        };
    }
    function loadStyleSheet(url){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    }
    function MobileFullStyle(){
        var cssVars = document.body.style,
        height = window.innerHeight,//1536
        width = window.innerWidth;//759


        cssVars.width = width + "px";
        cssVars.height = height + "px";
        cssVars.setProperty("--width",width + "px");
        cssVars.setProperty("--height",height + "px");
        cssVars.position = "absolute";

        cssVars.left = 0 + "px";
        cssVars.setProperty("--menuWidth",Math.floor(686*width/1920) + "px");
        cssVars.setProperty("--menuHeight",Math.floor(350*height/1080) + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(210*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-80*height/759) + "px");
        cssVars.setProperty("--titleSize",Math.floor(90*height/759) + "px");
        cssVars.setProperty("--inputHeight",Math.floor(40*height/759) + "px");
        cssVars.setProperty("--UPALeft",Math.floor(width*0.04) + "px");

        doc.body.classList.remove("horizontal");

        var exitRoom = document.getElementById("exit_game_button");
        exitRoom.parentNode.removeChild(exitRoom);
        gameScreen.appendChild(exitRoom);

        drawInfo = {
            x : 450*width/1536,
            y : 220*height/759,
            interval : 30*width/1536
        };
        
    }
    function MobileStyle(){
        var cssVars = document.body.style,
        height = window.innerWidth,//1536
        width = window.innerHeight;//759

        cssVars.width = width + "px";
        cssVars.height = height + "px";
        cssVars.setProperty("--width",width + "px");
        cssVars.setProperty("--height",height + "px");
        cssVars.position = "absolute";

        cssVars.left = height + "px";
        cssVars.setProperty("--menuWidth",Math.floor(686*width/1920) + "px");
        cssVars.setProperty("--menuHeight",Math.floor(350*height/1080) + "px");
        cssVars.setProperty("--pokerHeight",Math.floor(210*width/1536) + "px");
        cssVars.setProperty("--pokerMargin",Math.floor(-80*height/759) + "px");
        cssVars.setProperty("--titleSize",Math.floor(90*height/759) + "px");
        cssVars.setProperty("--inputHeight",Math.floor(40*height/759) + "px");
        cssVars.setProperty("--UPALeft",Math.floor(width*0.04) + "px");

        doc.body.classList.add("horizontal");


        var exitRoom = document.getElementById("exit_game_button");
        exitRoom.parentNode.removeChild(exitRoom);
        gameScreen.appendChild(exitRoom);

        loadStyleSheet("css/mobile.css");
        drawInfo = {
            x : 450*width/1536,
            y : 220*height/759,
            interval : 30*width/1536
        };
        
    }
    function adjustPokerMargin(){
        var len = userPokerArea.getElementsByClassName("user_poker"),
        areaWidth = userPokerArea.getBoundingClientRect().width,
        width = isM?window.innerHeight:window.innerWidth,
        height = isM?window.innerWidth:window.innerHeight;
        if(isM){
            cssVars.setProperty("--pokerMargin",Math.floor(-80*height/759) + "px");
        }else{
            cssVars.setProperty("--pokerMargin",Math.floor(-75*height/759) + "px");
        }
    }

    isM = isMobile();
    reStyle();