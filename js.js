window.onload = init;
var GUI = new GameStatethings();

//#region declarons des variables
let canvas, ctx;
let ennemis = [];
var mousepos = { x: 0, y: 0 };
var joueur;
var GodObject;
var keyboard = new Keyboard();

//debug shortcut
var g;
var phx;
var w;
//
//#endregion

//#region Init [creation des objets et lancement du jeu]
// DAMOY VS AQLSLB 
function init() {
    console.log("page chargee");
    //var audioContext = window.AudioContext || window.webkitAudioContext;
    audioInit();
  

    // 1 On recupere un pointeur sur le canvas
    canvas = document.querySelector("#myCanvas");
    // 2 On recupere le contexte graphique pour dessiner
    // dans le canvas
    ctx = canvas.getContext("2d");

    GodObject = {
        phx: null,
        draws: null,
        UI: [],
        ennemis: [],
        items: [],
        playors: [],
        evts: null,
        level: 1,
        death: 0,
        computeMoves: function (items, playors, ennemis) { },
        applyPhysics: function (phx, items, playors, ennemis) { },
        draw: function (ctx, items, playors, ennemis) { },
        rep: new Repere(0, 0),
        launchGame: function () {
            GodObject.evts(GodObject.playors, keyboard, GodObject.items);
            GodObject.applyPhysics(GodObject.phx, GodObject.items, GodObject.playors, GodObject.ennemis);
            GodObject.computeMoves(GodObject.items, GodObject.playors, GodObject.ennemis);
            if (GodObject.playors[0].mainProp.x > GodObject.items[0].size - GodObject.playors[0].mainProp.w) {
                nextLevel(++GodObject.level);
            }
            if (GodObject.playors[0] != null &&  GodObject.playors[0].mainProp.x - GodObject.rep.x > canvas.width * 0.6) {
                let offset = GodObject.playors[0].mainProp.x - GodObject.rep.x - canvas.width * 0.6;
                if (GodObject.rep.x < GodObject.items[0].size - 800) {
                    GodObject.rep.x += offset;
                    GodObject.items[0].forward(offset);
                }
            }
            else if (GodObject.playors[0] != null && GodObject.playors[0].mainProp.x - GodObject.rep.x < canvas.width * 0.2) {
                let offset = GodObject.playors[0].mainProp.x - GodObject.rep.x - canvas.width * 0.2;
                GodObject.rep.x += offset;
                if (GodObject.rep.x < 0) {
                    var vir = GodObject.rep.x;
                    GodObject.rep.x = 0;
                    GodObject.items[0].backward(-offset + vir);
                    
                } else {
                    GodObject.items[0].backward(-offset);
                }
            }
            GodObject.draw(ctx, GodObject.items, GodObject.playors, GodObject.ennemis, GodObject.rep);
            if (GUI.state == gameStates.inGame){
                requestAnimationFrame(GodObject.launchGame);
            }
            else if (GUI.state == gameStates.inthemenus){
                requestAnimationFrame(menu);
            }
            else if (GUI.state == gameStates.bonus) {
                requestAnimationFrame(bonus);
            }
        }
    }
    // 3 on dessine pour verifier que ca marche
    var player = [];
    player.push(new Joueur(100, 300, 30, 30, 0.1, 0.1, 'rgb(200,200,200)'));

    window.onkeydown = traiteKeydown;
    window.onkeyup = traiteKeyup;
    
    GodObject.items.push(createWalls(1));
    w = GodObject.items[0];
    GodObject.items.push(null);
    GodObject.ennemis = w.enemies;
    GodObject.playors = player;
    GodObject.computeMoves = moveElts;
    GodObject.applyPhysics = applyAll;
    GodObject.draw = drawAll;
    GodObject.evts = handleEvents;
    GodObject.phx = new physiqueMoteur(collide, ThingsToAplly);
    //debug shortcut
    g = GodObject
    phx = g.phx;
    joueur = g.playors[0];
    
    // on demarre l'animation
    resetlvl();
    GodObject.launchGame();
}

//#endregion 

//#region Move [make the game move] 
function moveElts(items, playors, ennemis) {
    playors.forEach((el) => {

        //console.log(el.mainProp.x);
        el.shadows.add(new ShadowELt(el.mainProp.x, el.mainProp.y, el.mainProp.w, el.mainProp.h, 0, 0, 'rgba(150,150,150,' + (getRandomInt(8) * 0.1) + ')', null, null));
        if (el.state == playerState.ONGRAB) {
            let speedOfGrab = el.speedX;
            let lol = (2 * Math.PI / 800) * speedOfGrab;
            let angleActuel = Math.atan2(el.inventory.activeItem.mainProp.y - el.mainProp.y, el.inventory.activeItem.mainProp.x - el.mainProp.x);
            angleActuel -= lol;
            el.mainProp.x = el.inventory.activeItem.mainProp.x - el.inventory.activeItem.dist * Math.cos(angleActuel);
            el.mainProp.y = el.inventory.activeItem.mainProp.y - el.inventory.activeItem.dist * Math.sin(angleActuel);
        }
        else {
            el.mainProp.x += el.speedX;
            el.mainProp.y += el.speedY;
        }

        if(el.inventory.isgrabLaunched()) {
            el.inventory.activeItem.dist += Math.abs(Math.sin(el.inventory.activeItem.angle) * el.inventory.activeItem.speed) +  Math.abs(Math.cos(el.inventory.activeItem.angle) * el.inventory.activeItem.speed);
            el.inventory.activeItem.mainProp.x += Math.cos(el.inventory.activeItem.angle) * el.inventory.activeItem.speed;
            el.inventory.activeItem.mainProp.y += Math.sin(el.inventory.activeItem.angle) * el.inventory.activeItem.speed;
            if (el.inventory.activeItem.dist > el.inventory.activeItem.maxDist && el.inventory.activeItem.activated) {
                el.inventory.activeItem.activated = false;
                el.state = playerState.RUNING;
                el.launchGrab = false;
            }
        }
    });

    ennemis.forEach((el) => {
        if (el.state == enemiesState.normal || el.state == enemiesState.inverted) {
            el.mainProp.x += el.speedX;
            el.mainProp.y += el.speedY;
        }
    });


    return 0;
}
//#endregion

//#region Physiques [ gravité collisions | interactions]

///region Physiques
function applyAll(phx, items, playors, ennemis) {
    phx.toApply(items, playors, ennemis, [phx.gravite]);
    phx.colision(items, playors, ennemis);
    return 0;
}


function physiqueMoteur(colision, PhysToApp) {
    this.gravite = 0.18;
    this.toApply = PhysToApp;
    this.colision = colision;
}

function ThingsToAplly(items, playors, ennemis, param) {
    playors.forEach((el) => {
        if (el.dir == ColisionEnum.NONE && el.state != playerState.ONGRAB)
            el.speedY += param[0];
    });
    ennemis.forEach((el) => {
        if (el.state == enemiesState.normal || el.state == enemiesState.inverted) {
            el.acting.act(el)
            if (el.gravity) {
                el.speedY += param[0];
            }
        }
    });
    return 0;
}

//#endregion

//#region Collisions
function collide(items, playors, ennemis) {
    if (joueur.mainProp.y > 600) {
       youDied()
    }
    if (joueur.mainProp.x < 0) {
        joueur.mainProp.x = 0
    }
    playors.forEach((joueur) => {
        ennemis.forEach((oppen) => {
            if (oppen.state == enemiesState.normal || oppen.state == enemiesState.inverted) {
                if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                        oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                    if (joueur.dir != ColisionEnum.NONE) {
                        die(oppen);
                    } else {
                       youDied()
                    }
                }
            }
        });
        var walls = items[0];
        if (walls != undefined) {
            for (var i = walls.startIndice; i <= walls.endIndice; i++) {
                let oppen = walls.walls[i];

                if (joueur.state == playerState.ONGRAB) {
                    let x = joueur.mainProp.x;
                    let y = joueur.mainProp.y
                    let speedOfGrab = joueur.speedX;
                    let lol = (2 * Math.PI / 800) * speedOfGrab;
                    let angleActuel = Math.atan2(joueur.inventory.activeItem.mainProp.y - joueur.mainProp.y, joueur.inventory.activeItem.mainProp.x - joueur.mainProp.x);
                    angleActuel -= lol;
                    joueur.mainProp.x = joueur.inventory.activeItem.mainProp.x - joueur.inventory.activeItem.dist * Math.cos(angleActuel);
                    joueur.mainProp.y = joueur.inventory.activeItem.mainProp.y - joueur.inventory.activeItem.dist * Math.sin(angleActuel);
                    if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                        oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                        joueur.speedX = 0;
                    }
                 
                    joueur.mainProp.x = x;
                    joueur.mainProp.y = y;
                }
                //console.log(oppen);
                //Probleme du pickatchu voant : resolution =>

                if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                         oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                    let bool = true;
                    if (!oppen.peacefull) {
                       youDied()
                    }
                    //YAAAAAAAAAAA
                    if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y, joueur.mainProp.w, joueur.mainProp.h,
                          oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                        bool = false;
                        if (!oppen.peacefull) {
                           youDied()
                        }
                        //console.log(1)
                        //TODO Reset X

                        
                        if (joueur.speedX > 0) {
                            joueur.mainProp.x = oppen.mainProp.x - joueur.mainProp.w - 1;
                        } else {
                            joueur.mainProp.x = oppen.mainProp.x + oppen.mainProp.w + 1;
                        }
                        joueur.speedX = 0;
                    }
                    if (rectsOverlap(joueur.mainProp.x, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                         oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                        bool = false;
                        if (!oppen.peacefull) {
                           youDied()
                        }
                        if (joueur.speedY > 0) {
                            joueur.speedY = 0;
                            joueur.jumps = joueur.maxJump;
                            joueur.dashTime = 15;
                            joueur.dash = true;
                        }
                        //console.log(oppen);
                        //TODO Reset Y
                    }
                    //YAAAATAAAAAAA
                    if (bool) {
                        //TODO Reset XY
                        joueur.speedX = 0;
                        joueur.speedY = 0;
                        joueur.jumps = joueur.maxJump;
                        joueur.dash = true;
                        joueur.dashTime = 40;
                    }
                    ///YOOOOOOOOO
                }

                if (joueur.inventory.shouldGrabBouncing(oppen))//TODO grab coll
                {
                    joueur.inventory.activeItem.grapWall();
                }

            }
            for (var i = walls.rstartIndice; i <= walls.rendIndice; i++) {
                let oppen = walls.roof[i];

                if (joueur.state == playerState.ONGRAB) {
                    let x = joueur.mainProp.x;
                    let y = joueur.mainProp.y
                    let speedOfGrab = joueur.speedX;
                    let lol = (2 * Math.PI / 800) * speedOfGrab;
                    let angleActuel = Math.atan2(joueur.inventory.activeItem.mainProp.y - joueur.mainProp.y, joueur.inventory.activeItem.mainProp.x - joueur.mainProp.x);
                    angleActuel -= lol;
                    joueur.mainProp.x = joueur.inventory.activeItem.mainProp.x - joueur.inventory.activeItem.dist * Math.cos(angleActuel);
                    joueur.mainProp.y = joueur.inventory.activeItem.mainProp.y - joueur.inventory.activeItem.dist * Math.sin(angleActuel);
                    if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                        oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                        joueur.speedX = 0;
                        if (!oppen.peacefull) {
                           youDied()
                        }
                    }
                    joueur.mainProp.x = x;
                    joueur.mainProp.y = y;
                }

                //console.log(oppen);
                //Probleme du pickatchu volant : resolution =>
                if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                         oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                    let bool = true;
                    if (!oppen.peacefull) {
                       youDied()
                    }
                    //YAAAAAAAAAAA
                    if (rectsOverlap(joueur.mainProp.x + joueur.speedX, joueur.mainProp.y, joueur.mainProp.w, joueur.mainProp.h,
                          oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                        bool = false;
                        if (!oppen.peacefull) {
                           youDied()
                        }
                        //console.log(1)
                        //TODO Reset X
                        if (joueur.speedX > 0) {
                            joueur.mainProp.x = oppen.mainProp.x - joueur.mainProp.w - 1;
                        } else {
                            joueur.mainProp.x = oppen.mainProp.x + oppen.mainProp.w + 1;

                        }
                        joueur.speedX = 0;

                    }
                    if (rectsOverlap(joueur.mainProp.x, joueur.mainProp.y + joueur.speedY, joueur.mainProp.w, joueur.mainProp.h,
                         oppen.mainProp.x, oppen.mainProp.y, oppen.mainProp.w, oppen.mainProp.h)) {
                        if (!oppen.peacefull) {
                           youDied()
                        }
                        l = false;
                        joueur.speedY = 0;
                        joueur.speedX = 0;
                    }
                    //YAAAATAAAAAAA
                    if (bool) {
                        //TODO Reset XY

                    }
                    ///YOOOOOOOOO
                }
                if (joueur.inventory.shouldGrabBouncing(oppen)) {
                    joueur.inventory.activeItem.grapWall();
                }
            }
        };
    });
    return 0;
}
//#endregion

//#region draws :D
function drawAll(ctx, items, playors, ennemis, rep) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    var walls = items[0];
    if (walls != undefined) {
        for (var i = walls.startIndice; i <= walls.endIndice; i++) {
            let el = walls.walls[i];
            el.mainProp.draw(ctx, rep);
        };
        
                for (var i = walls.rstartIndice; i <= walls.rendIndice; i++) {
            let el = walls.roof[i];
            el.mainProp.draw(ctx, rep);
        };
    }
    playors.forEach((el) => {
        el.shadows.draw(ctx, rep);
        el.mainProp.draw(ctx, rep);


        ctx.beginPath()
        ctx.strokeStyle = el.inventory.activeItem.mainProp.color;
        if (el.inventory.isgrabLaunched())
            el.inventory.activeItem.mainProp.draw(ctx, rep);

    });
    ctx.stroke();
    

    ennemis.forEach((el) => {
        if (el.state == enemiesState.normal || el.state == enemiesState.inverted) {
            el.mainProp.draw(ctx, rep);
        }
    });
    ctx.font = '20px consolas';
    ctx.fillStyle = 'white'
    ctx.fillText("Level : " + GodObject.level, 20, 30);
    ctx.fillText("Death : " + GodObject.death, 650, 30);
    ctx.restore();
    return 0;
}

function drawRect(ctx, elt, rep) {
    ctx.fillRect(elt.x - rep.x, elt.y - rep.y, elt.w, elt.h);
    
    ctx.beginPath()
    for(var i = 0 ; i < getRandomInt(1000);i++){
        ctx.fillStyle = 'rgba(0,0,0,0.2)'
        ctx.rect(elt.x - rep.x + getRandomInt(elt.w), elt.y + getRandomInt(elt.h) - rep.y,10,10);     
    }
    ctx.fill()
}

function drawPlayor(ctx, elt, rep) {
    if (joueur.dir != ColisionEnum.NONE) {
        if (joueur.dashTime % 5 == 0) {
            ctx.fillStyle = "rgb(255,255,0)";
        }
        else if (joueur.dashTime % 4 == 0) {
            ctx.fillStyle = "rgb(200,0,0)";
        }
        else if (joueur.dashTime % 2 == 0) {
            ctx.fillStyle = "rgb(200,200,0)";
        }
        else if (joueur.dashTime % 3 == 0) {
            ctx.fillStyle = "rgb(75,75,255)";
        }

    }
    ctx.beginPath()
    ctx.arc(elt.x - rep.x + elt.w / 2, elt.y - rep.y + elt.w / 2, elt.h / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.05)"
    ctx.arc(elt.x - rep.x + elt.w / 2, elt.y - rep.y + elt.w / 2, (elt.h / 2) * 1.2, 0, 2 * Math.PI);
    ctx.fill()
}

function drawShadows(ctx, elt, rep) {
    if (joueur.dir != ColisionEnum.NONE) {
        if (getRandomInt(5) == 4) {
            ctx.fillStyle = "rgba(200,200,0,0.5)";
        }
        if (getRandomInt(5) == 3) {
            ctx.fillStyle = "rgba(75,75,255,0.5)";
        }
    }
    ctx.beginPath()
    ctx.arc(elt.x - rep.x + elt.w / 2, elt.y - rep.y + elt.w / 2, elt.h / 2, 0, 2 * Math.PI);
    ctx.fill();
    
}
//#endregion 

//#region grappin

var grabState = {
    RUN: 1,
    GRAB: 2
};

class BouncingGrab {
    constructor(angle, maxDist, player) {
        this.player = player;
        this.maxDist = maxDist;
        this.dist = 0;
        this.mainProp = new elt(this.player.mainProp.x, this.player.mainProp.y, 0, 0, 'yellow');
        this.mainProp.drawFtc = drawGrab;
        this.speed = 6;
        this.angle = angle;
        this.activated = false;
        this.state = grabState.RUN;
    }
    shouldGrab(elt) {
        return this.activated && this.mainProp.x >= elt.mainProp.x && this.mainProp.x <= elt.mainProp.x + elt.mainProp.w && this.mainProp.y >= elt.mainProp.y && this.mainProp.y <= elt.mainProp.y + elt.mainProp.h;
    }
    grapWall(elt) {
        console.log('lol')
        this.state = grabState.GRAB;
        this.speed = 0;
        this.player.state = playerState.ONGRAB;
    }
}

function drawGrab(ctx, elt, rep) {
    ctx.save();
    ctx.moveTo(joueur.mainProp.x - rep.x, joueur.mainProp.y - rep.y);
    //ctx.arc(elt.x - rep.x, elt.y - rep.y, 5, 0, 2 * Math.PI);
    ctx.lineTo(elt.x - rep.x, elt.y - rep.y);
    ctx.restore()
}

function drawGrabElt(ctx, elt, rep) {
    ctx.arc(elt.x, elt.y, 5, 0, 2 * Math.PI);

}

class GrabElt {
    constructor(x, y, l, h, couleur) {
        this.mainProp = new elt(x, y, l, h, couleur);
        this.mainProp.drawFtc = drawGrabElt;
    }
}
//#endregion

//#region Classes  [joueur , repere, enemies ]
var playerState = {
    RUNING: 1,
    ONGRAB: 2
}

class elt {
    constructor(x, y, l, h, couleur) {
        this.x = x;
        this.y = y;
        this.w = l;
        this.h = h;
        this.color = couleur;
        this.drawFtc = null;
    }
    draw(ctxo, rep) {
        //  console.log(ctxo);

        ctxo.fillStyle = this.color;
        this.drawFtc(ctx, this, rep);
        
    }
}

class Repere {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

}

var repo = new Repere(0, 0);

class Joueur {
    constructor(x, y, l, h, vx, vy, couleur) {
        this.mainProp = new elt(x, y, l, h, couleur);
        this.mainProp.drawFtc = drawPlayor;
        this.speedX = vx;
        this.speedY = vy;
        this.dashTime = 40;
        this.maxJump = 2;
        this.jumps = this.maxJump;
        this.noRepeat = true;
        this.shadows = new ShadowList(10);
        this.state = playerState.RUNING;
        this.dash = true;
        this.dir = ColisionEnum.NONE;
        this.inventory = new PlayorStuff(this);
        this.inventory.youGotaNewBouncingGrab_Amazing();
        this.inventory.activeItem = this.inventory.bouncingGrab;
        this.launchGrab = true;

    }
}
//Inventory of the player avec plein de truc cool dedans ! 
class PlayorStuff {
    constructor(playor) {
        this.bouncingGrab = null;
        this.dashingGrab = null;
        this.offensivGrab = null;
        this.activeItem = null;
        this.playor = playor;
    }
    isBoucingGrab() {
        return (this.bouncingGrab != null);
    }
    isDashingGrab() {
        return (this.dashingGrab != null);
    }
    isoffensivGrab() {
        return (this.offensivGrab != null);
    }
    youGotaNewBouncingGrab_Amazing() {
        this.bouncingGrab = new BouncingGrab(0, 150, this.playor);
    }
    activatedBouncingGrab() {
        return this.isBoucingGrab.activated;
    }
    shouldGrabBouncing(elt) {
        return this.isBoucingGrab() && this.bouncingGrab.shouldGrab(elt);
    }
    launchGrab(angle, speed) {
        if (this.activeItem != null) {
            this.activeItem.mainProp.x = this.playor.mainProp.x;
            this.activeItem.mainProp.y = this.playor.mainProp.y
            this.activeItem.speed = speed;
            this.activeItem.angle = angle;
            this.activeItem.dist = 0;
            this.activeItem.activated = true;
            this.activeItem.state = grabState.RUN;
        }
    }
    isgrabLaunched() {
        return this.activeItem != null && this.activeItem.activated;
    }
}

class ShadowList {
    constructor(maxSize) {
        this.first = null;
        this.last = null;
        this.maxSize = maxSize;
        this.used = 0;
    }
    draw(ctx, rep) {
        var temp = this.first;
        ctx.save();
        while (temp != this.last) {
            ctx.fillStyle = temp.mainProp.color;
            temp.mainProp.drawFtc(ctx, temp.mainProp, rep);
            temp = temp.next;
        }
        ctx.restore()
    }
    add(elt) {
        if (this.used == this.maxSize) {
            this.last = this.last.prec;
            this.first.prec = elt;
            elt.next = this.first;
            this.first = elt;
        } else if (this.used == 0) {
            elt.next = this.first;
            elt.prec = null;
            this.first = elt;
            this.last = elt;
            this.used += 1;
        } else {
            this.first.prec = elt;
            elt.next = this.first;
            this.first = elt;
            this.used += 1;
        }
    }
}

class ShadowELt {
    constructor(x, y, l, h, vx, vy, couleur, next, prec) {
        this.mainProp = new elt(x, y, l, h, couleur);
        this.mainProp.drawFtc = drawShadows;
        this.next = next;
        this.prec = prec;
    }
}

class Wall {
    constructor(x, y, l, h, couleur) {
        this.mainProp = new elt(x, y, l, h, couleur);
        this.mainProp.drawFtc = drawRect;
        this.peacefull = true;
    }
}

class FloatingEnemies {
    constructor(x, y, l, h, vx, vy, couleur) {
        this.mainProp = new elt(x, y, l || 30, h || 30 , couleur);
        this.mainProp.drawFtc = drawRect;
        this.speedX = vx;
        this.speedY = vy;
        this.cycle = 0;
        this.state = enemiesState.normal;
        this.gravity = true;
        this.acting = new floatingTruc(this);
    }
}


class BlockingEnemies {
    constructor(x, y, l, h, vx, vy, couleur) {
        this.mainProp = new elt(x, y, l || 20, h || 20 , 'rgb(75,20,175)');
        this.mainProp.drawFtc = drawRect;
        this.speedX = 0;
        this.speedY = 2;
        this.cycle = 0;
        this.state = enemiesState.normal;
        this.gravity = true;
        this.acting = new BlockingTruc(this);
    }
}


class floatingTruc {
    constructor(enemis) {
        enemis.gravity = false;
    }
    act(enemy) {
        enemy.cycle++;
        if (enemy.cycle % (60 * 4) == 0) {
            if (enemy.state == enemiesState.normal) {

                enemy.state = enemiesState.inverted;
            } else {
                enemy.state = enemiesState.normal;
            }
            enemy.speedX *= -1;
            enemy.speedY *= -1;
        }
    }
}
//Duplicating code ...
class BlockingTruc {
    constructor(enemis) {
        enemis.gravity = false;
    }
    act(enemy) {
        enemy.cycle++;
        if (enemy.cycle % (60 ) == 0) {
            if (enemy.state == enemiesState.normal) {

                enemy.state = enemiesState.inverted;
            } else {
                enemy.state = enemiesState.normal;
            }
            enemy.speedX *= -1;
            enemy.speedY *= -1;
        }
    }
}

class DashingEnemies {
    constructor(x, y, l, h, vx, vy, couleur) {
        this.mainProp = new elt(x, y, l || 30, h || 30 , 'rgb(30,10,10)');
        this.mainProp.drawFtc = drawRect;
        this.speedX = vx;
        this.speedY = vy;
        this.gs = 0;
        this.cycle = 0;
        this.state = enemiesState.normal;
        this.gravity = true;
        this.acting = new DashingTruc(this);
        this.locked = false;
        this.lifetime = -1;
    }
}

class DashingTruc {
    constructor(enemis) {
        enemis.gravity = false;
    }
    act(enemy) {
        if (!enemy.locked) {
            enemy.cycle++;
            if (enemy.cycle % (60 * 4) == 0) {
                if (enemy.state == enemiesState.normal) {
                    enemy.state = enemiesState.inverted;
                } else {
                    enemy.state = enemiesState.normal;
                }
                enemy.speedX *= -1;
                enemy.speedY *= -1;
            }
            //TryingToLock
            if (dist(joueur.mainProp.x, enemy.mainProp.x, joueur.mainProp.y, enemy.mainProp.y) < 250) {
                enemy.locked = true;
                enemy.mainProp.color = 'rgb(80,25,25)'
                enemy.lifetime = 180;
                let angleActuel = Math.atan2(joueur.mainProp.y - enemy.mainProp.y, joueur.mainProp.x - enemy.mainProp.x);
                enemy.speedX = Math.cos(angleActuel) * Math.min(15,enemy.gs);
                enemy.speedY = Math.sin(angleActuel) * Math.min(15, enemy.gs);
            }
        } else {

            if (enemy.lifetime > 0) {
                enemy.lifetime--;
                enemy.gs *= 1.01;
                enemy.gs += 0.1;
                if (enemy.lifetime % 15 == 0) {
                    let angleActuel = Math.atan2(joueur.mainProp.y - enemy.mainProp.y, joueur.mainProp.x - enemy.mainProp.x);
                    enemy.speedX = Math.cos(angleActuel) * Math.min(4, enemy.gs);
                    enemy.speedY = Math.sin(angleActuel) * Math.min(4, enemy.gs);
                }


            } else {
                die(enemy);
            }
        }
    }
}


//#endregion

//#region Generation de truc en tout genres

//#region enemies

//GDVQAASLBDDAMOY
//DAMOYSB

function creerEnemies(AQSLBDDAMOY) {
    var HAREMOFD = [];
    for (i = 0; i < AQSLBDDAMOY; i++) {
        HAREMOFD.push(new FloatingEnemies(i * 10, i * 10, i * 10, i * 10, 0, 0.2, 'white'));
    }
    return HAREMOFD;
}
//#endregion

//#region levels
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function createWalls(lvl) {
    //sO = new SeedObject(1000, 1000, 10);
    //sO.initLevel(20);
    
    return generateLevel(lvl);//new Walls(sO.GenerateLevel(15), 601).forward(0);
}

class luckyApparition {
    constructor(level, bloc, truc, longueur) {

        this.tableauBloc = [];
        for (var i = 0; i < longueur; i++) {
            this.tableauBloc.push([
                getRandomInt(Math.floor((0.75 + (i / longueur * 0.25) * level) * Math.floor(getRandomInt(level + 1 + Math.floor((Math.log(2 * getRandomInt(level + 1) + 1))))))),                //hauteur
                10 - Math.floor((getRandomInt(2) + 1) * Math.log(getRandomInt(2 * level) + 1))                                                                //largeur    
            ]
           );
        }
    }

}

function valid(corx, cory, xcor, ycor, ymax, xmax) {
    if (cory > ycor) {
        if (cory - ycor > xmax)
            return false;
    }
    return true;
}

class SeedObject {
    constructor(heightM, widthM, level) {
        this.jH = heightM;
        this.jW = widthM;
        this.hash = null;
        this.unitH = canvas.height / 25;
        this.unitW = canvas.width / 25;
        this.levelSeed = []
        this.level = level;
    }
    initLevel(lvl) {
        this.levelSeed = [];
        for (var i = 1; i <= lvl; i++) {
            this.levelSeed.push(new luckyApparition(i, null, null, 30000));
        }
    }
    GenerateLevel(lvl) {

        var res = [];
        var xcor = 0;
        var ycor = 0;
        let x = this.levelSeed[lvl - 1].tableauBloc;

        while (xcor < 30000) {
            do {
                var corx = getRandomInt(x[xcor][1] - 4) + 5;
                var cory = getRandomInt(x[xcor][0] + 2) + 2;
                //console.log();
            } while (!valid(corx * this.unitW, cory * this.unitH, xcor, ycor, this.jH, this.jW));
            //console.log(this.unitH);
            res.push(new Wall(xcor, canvas.height - cory * this.unitH, corx * this.unitW, cory * this.unitH, 'white'));
            xcor += corx * this.unitW;
            ycor = cory;
        }
        return res;
    }

}
//#endregion

//#endregion

//structure de donnée pour les nivea
//100 * 100
class Walls {
    constructor(tab, preloading,tab2,enemies,size) {
        this.walls = tab
        this.roof =  tab2 || [];
        this.startIndice = 0;
        this.endIndice = 0;
        this.rstartIndice = 0;
        this.rendIndice = 0;
        this.start = 0;
        this.end = canvas.width;
        this.preloading = preloading;
        this.enemies = enemies
        this.size = size;
        //for (var z = 0 ; z < (this.walls[(this.walls.length - 1)].mainProp.x + this.walls[(this.walls.length - 1)].mainProp.w) / canvas.width  ; z++) {
        //    this.roof.push(new Wall(z * canvas.width, 0, canvas.width, 48, 'white'));
        //}
    }
    forward(x) {
        this.start += x;
        this.end += x;
        //
        {
            while (this.roof[this.rstartIndice].mainProp.x < this.start - this.preloading) {
                this.rstartIndice++;
            }
            while (this.roof[this.rendIndice].mainProp.x < this.end + this.preloading) {

                this.rendIndice++;
                if (this.rendIndice >= this.roof.length - 1) {
                    this.rendIndice = this.roof.length - 1;
                    break;
                }
            }
        }
        //
        {
            while (this.walls[this.startIndice].mainProp.x < this.start - this.preloading) {
                this.startIndice++;
            }
            while (this.walls[this.endIndice].mainProp.x < this.end + this.preloading) {
                this.endIndice++;
                if (this.endIndice >= this.walls.length - 1) {
                    this.endIndice = this.walls.length - 1;
                    break;
                }
            }
        }
        return this;
    }
    backward(x) {
        this.start -= x;
        this.end -= x;
        //roof
        {
            while (this.roof[this.rstartIndice].mainProp.x > this.start - this.preloading) {
                this.rstartIndice--;
                if (this.rstartIndice <= 0) {
                    this.rstartIndice = 0;
                    break;
                }

            }
            while (this.roof[this.rendIndice].mainProp.x > this.end + this.preloading) {
                this.rendIndice--;
            }
        }
        //floor
        {
            while (this.walls[this.startIndice].mainProp.x > this.start - this.preloading) {
                this.startIndice--;
                if (this.startIndice <= 0) {
                    this.startIndice = 0;
                    break;
                }

            }
            while (this.walls[this.endIndice].mainProp.x > this.end + this.preloading) {
                this.endIndice--;
            }
        }
        return this;
    }
}

//#region Collision de base
var ColisionEnum = {
    NONE: 0,
    TOP: 1,
    BOT: 2,
    LEFT: 3,
    RIGHT: 4
};

//pas besoin
function testeCollisionsAvecMurs(r) {

    if ((r.x + r.l) > canvas.width) {
        return ColisionEnum.RIGHT
    } else if ((r.x) < 0) {
        return ColisionEnum.LEFT
    }
    // MURS BAS ET HAUT
    if ((r.y + r.h) > canvas.height) {
        return ColisionEnum.BOT;
    } else if ((r.y) < 0) {
        return ColisionEnum.TOP;
    }
    return 0;
}

function testCollisionListElt(list, elt) {
    list.forEach((el) => {
        if (rectsOverlap(elt.x, elt.y, elt.l, elt.h,
                 el.x, el.y, el.l, el.h)) {
            return false;
        } else {
            return true;
        }
    });
}

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((x1 >= (x2 + w2)) || ((x1 + w1) <= x2))
        return false;
    if ((y1 >= (y2 + h2)) || ((y1 + h1) <= y2))
        return false;
    return true; // If previous tests failed, then both axis projections
}
//#endregion

//#region Events handle-ing
function handleEvents(playors, keyboard, items) {
    GodObject.playors.forEach((joueur) => {
        if (keyboard.isPressed('ControlRight')) {
            if (!joueur.inventory.activeItem.activated && joueur.launchGrab) {
                joueur.inventory.launchGrab(-Math.PI / 2, 8);
            }
        }
        else {
            joueur.inventory.activeItem.activated = false;
            joueur.state = playerState.RUNING;
            joueur.launchGrab = true;
        }
        //    if(items[1] == null){
        //        items[1] = new Grab(-Math.PI / 2, 57389, joueur);
        //        console.log(items[1].mainProp.x);
        //        console.log(items[1].mainProp.y);

        //    }
        //    else {

        //    }
        //}
        //else if( items[1] != null){
        //    items[1] = null;
        //    joueur.state = playerState.RUNING;
        //}


        //TODO gerer les conflis de touche? Quelle politique adopter ? AUCUNE 
        if (keyboard.isPressed('ControlLeft') && joueur.dash && joueur.dir == ColisionEnum.NONE) {
            joueur.jumps = 1;
            if (keyboard.isPressed('ArrowRight')) {
                joueur.dir = ColisionEnum.RIGHT;
            }
            if (keyboard.isPressed('ArrowLeft')) {
                joueur.dir = ColisionEnum.LEFT;
            }
            if (keyboard.isPressed('ArrowUp')) {
                joueur.dir = ColisionEnum.TOP;

            }
            if (keyboard.isPressed('ArrowDown')) {
                joueur.dir = ColisionEnum.BOT;
            }
        } else if (keyboard.isPressed('ControlLeft') && joueur.dir != ColisionEnum.NONE && joueur.dashTime > 0) {
            switch (joueur.dir) {
                case ColisionEnum.TOP: {
                    joueur.speedX = 0;
                    joueur.speedY = -12;
                    break;
                } //SPC DD
                case ColisionEnum.BOT: {
                    joueur.speedX = 0;
                    joueur.speedY = 12;
                    break;
                }
                case ColisionEnum.LEFT: {
                    joueur.speedX = -12;
                    joueur.speedY = 0;
                    break;
                }
                case ColisionEnum.RIGHT: {
                    joueur.speedX = 12;
                    joueur.speedY = 0;
                    break;
                }
            }
            joueur.dashTime--;
        } else if (joueur.dir != ColisionEnum.NONE) {
            joueur.dash = false;
            joueur.dir = ColisionEnum.NONE;
            joueur.speedX /= 4;
            joueur.speedY /= 4;
        } else {
            joueur.speedX = 8 * (keyboard.isPressed('ArrowRight') || keyboard.isPressed('KeyD')) + -8 * (keyboard.isPressed('ArrowLeft') || keyboard.isPressed('KeyA'));
            if (joueur.jumps > 0 && keyboard.isPressed('Space')) {
                if (joueur.noRepeat) {
                    joueur.speedY = -5;
                    joueur.jumps--;
                    joueur.noRepeat = false;
                }
            }
            else {
                joueur.noRepeat = true;
            }
        }
    });
}


function traiteKeydown(evt) {
    let code = evt.code;
    //console.log(code);
    keyboard.keyPressed(code);
}


function traiteKeyup(evt) {
    let code = evt.code;
    //console.log("keyUp");
    keyboard.keyUp(code);
}

//#endregion

var enemiesState = {
    normal: 1,
    inverted: 4 , 
    dead: 2,
    notLoaded:3
}

function resetlvl() {
    GodObject.rep.x = 0;
    GodObject.rep.y = 0;
    joueur.mainProp.y = GodObject.items[0].walls[0].mainProp.y - joueur.mainProp.h - 1;
    joueur.mainProp.x = 10;
    joueur.speedX = 0;
    joueur.speedY = 0;
    GodObject.ennemis = GodObject.items[0].enemies;
}
function nextLevel(lvl) {
    GodObject.items[0] = createWalls(lvl);
    resetlvl();
}

function die(truc) {
    truc.state = enemiesState.dead;
}

function youDied() {
    nextLevel(GodObject.level);
    GodObject.death++;
    dieSound.play();
}
//Product ok 
//