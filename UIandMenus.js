var topW = [];
var botW = [];
var en = []

var True = true;
var state = 0;
var ent = 0;

class GameStatethings {
    constructor() {
        this.state = gameStates.inthemenus;
    }
}

var gameStates = {
    inGame: 1,
    inthemenus: 2,
    bonus: 3
}


function drawMenus() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = 'white'
    ctx.font = '48px consolas';
    ctx.fillText("AQLSLB THE GAME", 200, 100);
    ctx.fillText("> PLAY", 285, 400);
    ctx.restore();
    return 0;
}

function menu() {
    evts();
    drawMenus()
    if(True){
        requestAnimationFrame(menu);
    }
    else {
        GUI.state = gameStates.inGame;
        requestAnimationFrame(GodObject.launchGame);
    }
}

function evts() {
    if (!playing && musicquiSeBalade.readyState == 4) {
        musicquiSeBalade.play();
        playing = musicquiSeBalade.played.length == 1;
    }
    if (keyboard.isPressed('Enter')) {
        True = false;
    }
}