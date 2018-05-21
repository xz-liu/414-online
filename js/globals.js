var defaultServer = 'ws://127.0.0.1:3001',//
    menuName = document.getElementById("menu_name"),
    menuInput = document.getElementById("menu_input"),
    menuRoom = document.getElementById("menu_room"),
    menuLinkError = document.getElementById("menu_link_error"),
    menu = document.getElementById("menu"),
    curInput = null,
    doc = document,
    gameScreen = doc.getElementsByClassName("game_screen")[0],
    userPokerArea = gameScreen.getElementsByClassName("user_poker_area")[0],
    bringOutButton = gameScreen.getElementsByClassName("bring_out_button")[0],
    socket,
    pCode,
    pName,
    thisGame,
    thisChat,
    isInvited = false,
    isM = false,
    isFull = false,
    drawInfo = null,
    token = null;

    //javascript:alert(document.getElementById("full_screen_button").getBoundingClientRect().y);
    //alert(document.getElementById("full_screen_button").getBoundingClientRect().y);