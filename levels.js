//Enemies
class PresenceEnemies {
    constructor(classe, proba, increaseProbaByLevel) {
        this.classe = classe;
        this.proba = proba;
        this.increaseProbaByLevel = increaseProbaByLevel;
    }
}

//'rgbo(50,20,20)'

//#region Floor
class littleFloor {
    constructor() {
        this.unTouchable = false;
        this.heigth = [25, 24, 23, 22];
        this.width = 100;
        this.color = 'rgb(15,15,25)';
    }
};

class noFloor {
    constructor() {
        this.unTouchable = true;
        this.heigth = [28];
        this.width = 100;
        this.color = 'rgb(100,20,20)';
    }
}

class lowFloor {
    constructor() {
        this.unTouchable = false;
        this.heigth = [23];
        this.width = 100;
        this.color = 'rgb(15,15,25)';
    }
};

class heigthFloor {
    constructor() {
        this.unTouchable = false;
        this.heigth = [22, 21, 20, 19];
        this.color = 'rgb(15,15,25)';
        this.width = 100;
    }
}
//#endregion

//#region DarkRoom
class littleFloorD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [25, 24, 23, 22];
        this.width = 100;
        this.color = 'rgb(100,20,20)';
    }
};


class lowFloorD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [23];
        this.width = 100;
        this.color = 'rgb(100,20,20)';
    }
};

class heigthFloorD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [22, 21, 20, 19];
        this.color = 'rgb(100,20,20)';
        this.width = 100;
    }
}

//#endregion

//#region Roof
class littleRoof {
    constructor() {
        this.unTouchable = false;
        this.heigth = [3, 4, 5, 6, 7];
        this.color = 'rgb(15,15,25)';
        this.width = 100;
    }

}

class noRoof {
    constructor() {
        this.unTouchable = false;
        this.heigth = [-1];
        this.color = 'rgb(15,15,25)';
        this.width = 100;
    }
}

class lowRoof {
    constructor() {
        this.unTouchable = false;
        this.heigth = [1];
        this.color = 'rgb(15,15,25)';
        this.width = 100;
    }

}

class heightRoof {
    constructor() {
        this.unTouchable = false;
        this.heigth = [1, 2, 3, 4, 5];
        this.width = 100;
        this.color = 'rgb(15,15,25)';
    }
}

class hardRoof {
    constructor() {
        this.unTouchable = false;
        this.heigth = [7, 8, 9];
        this.width = 100;
        this.color = 'rgb(15,15,25)';
    }
}
//#endregion

//#region DarkRoof
class littleRoofD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [3, 4, 5, 6, 7];
        this.color = 'rgb(100,20,20)';
        this.width = 100;
    }

}



class lowRoofD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [1];
        this.color = 'rgb(100,20,20)';
        this.width = 100;
    }
}

class heightRoofD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [1, 2, 3, 4];
        this.width = 100;
        this.color = 'rgb(100,20,20)';
    }
}

class hardRoofD {
    constructor() {
        this.unTouchable = true;
        this.heigth = [6, 7, 8];
        this.width = 100;
        this.color = 'rgb(100,20,20)';
    }
}

//#endregion 


//Rooms
class standartRoom {
    constructor() {
        this.size = 600;
        this.top = [new heightRoof()];
        this.bot = [new littleFloor()];
        this.enemies = [new PresenceEnemies(FloatingEnemies, 30, 2), new PresenceEnemies(DashingEnemies, 30, 2), new PresenceEnemies(FloatingEnemies, 30, 2), new PresenceEnemies(BlockingEnemies, 100, 2)];
    }
}

//N
class PeaceRoom {
    constructor() {
        this.size = 600;
        this.top = [new lowRoof()];
        this.bot = [new lowFloor()];
        this.enemies = [new PresenceEnemies(DashingEnemies, 50, 2)]
    }
}

//N
class FoesRoom {
    constructor() {
        this.size = 600;
        this.top = [new heightRoof()];
        this.bot = [new heigthFloor(), new lowFloor()];
        this.enemies = [new PresenceEnemies(DashingEnemies, 90, 2)]
    }
}

//D
class ChallengeRoom {
    constructor() {
        this.size = 600;
        this.top = [new heightRoof()];
        this.bot = [new heigthFloor(), new lowFloorD(), new heigthFloorD()];
        this.enemies = [new PresenceEnemies(DashingEnemies, 90, 2)]
    }
}

class MoreFoesRoom {
    constructor() {
        this.size = 600;
        this.top = [new heightRoofD()];
        this.bot = [new heigthFloor(), new lowFloor()];
        this.enemies = [new PresenceEnemies(DashingEnemies, 90, 2), new PresenceEnemies(BlockingEnemies, 90, 2)]
    }
}


class CareRoom {
    constructor() {
        this.size = 600;
        this.top = [new heightRoof()];
        this.bot = [new heigthFloor(), new lowFloorD(), new heigthFloorD()];
        this.enemies = [new PresenceEnemies(BlockingEnemies, 50, 2), new PresenceEnemies(FloatingEnemies, 60, 2)]
    }
}

//D
class LuckRoom {
    constructor() {
        this.size = 300;
        this.top = [new lowRoofD()];
        this.bot = [new noFloor()];
        this.enemies = [new PresenceEnemies(DashingEnemies, 60, 2)]
    }
}

class PikeRoom {
    constructor() {
        this.size = 300;
        this.top = [new hardRoofD()];
        this.bot = [new noFloor()];
        this.enemies = [new PresenceEnemies(FloatingEnemies, 60, 2)]
    }
}


//N
class StartRoom {
    constructor() {
        this.size = 300;
        this.top = [new lowRoof()];
        this.bot = [new lowFloor()];
        this.enemies = [new PresenceEnemies(DashingEnemies, 0, 0)]
    }
}

//D
class HardRoom {
    constructor() {
        this.size = 600;
        this.top = [new lowRoofD(), new lowRoofD(), new lowRoof()];
        this.bot = [new lowFloorD(), new lowFloorD(), new lowFloor()];
        this.enemies = [new PresenceEnemies(FloatingEnemies, 30, 4)]
    }
}

//D
class standartJumpRoom {
    constructor() {
        this.size = 600;
        this.top = [new heightRoofD(), new heightRoof()];
        this.bot = [new littleFloorD(), new littleFloor()];
        this.enemies = [new PresenceEnemies(FloatingEnemies, 30, 2)]

    }
}

//H
class HoleRoom {
    constructor() {
        this.size = 200;
        this.top = [new lowRoof()];
        this.bot = [new noFloor()];
        this.enemies = [new PresenceEnemies(FloatingEnemies, 40, 1)]

    }
}

//H
class HardHoleRoom {
    constructor() {
        this.size = 300;
        this.top = [new lowRoof(), new hardRoof(), new noRoof()];
        this.bot = [new noFloor()];
        this.enemies = [new PresenceEnemies(FloatingEnemies, 40, 1)]
    }
}

class level {
    constructor(length, rooms) {
        this.length = length;
        this.rooms = rooms;
    }
}


var Levels = {
    "1": new level(3000, [PeaceRoom, standartRoom]),
    "2": new level(4000, [standartRoom, PeaceRoom, HoleRoom]),
    "3": new level(5000, [standartRoom, PeaceRoom, standartJumpRoom, PeaceRoom, standartRoom,  HoleRoom]),
    "4": new level(6000, [standartRoom, PeaceRoom, HoleRoom, standartJumpRoom]),
    "5": new level(6000, [standartRoom, PeaceRoom, PeaceRoom, HoleRoom, FoesRoom]),
    "6": new level(6000, [standartRoom, FoesRoom, PeaceRoom, HoleRoom, HoleRoom]),
    "7": new level(6000, [standartRoom, PeaceRoom, standartRoom, HardHoleRoom,  ChallengeRoom, HoleRoom]),
    "8": new level(6000, [standartRoom, PeaceRoom, standartJumpRoom, ChallengeRoom, HardRoom]),
    "9": new level(6000, [standartJumpRoom, HardRoom]),
    "10": new level(6000, [standartRoom, PeaceRoom,FoesRoom, ChallengeRoom]),
    "11": new level(6000, [standartRoom, PeaceRoom, ChallengeRoom, ChallengeRoom, LuckRoom]),
    "12": new level(6000, [standartRoom, PeaceRoom, ChallengeRoom, HardHoleRoom, HardHoleRoom,FoesRoom]),
    "13": new level(6000, [standartRoom, FoesRoom, HardHoleRoom, PikeRoom]),
    "14": new level(6000, [standartRoom, ChallengeRoom, HardHoleRoom, PikeRoom]),
    "15": new level(6000, [standartRoom, CareRoom, ChallengeRoom, standartJumpRoom]),
    "16": new level(6000, [standartRoom, HoleRoom, standartJumpRoom]),
    "17": new level(6000, [standartRoom, MoreFoesRoom,ChallengeRoom]),
    "18": new level(6000, [standartRoom, MoreFoesRoom, PikeRoom]),
    "19": new level(6000, [standartRoom, PikeRoom, standartJumpRoom,HardHoleRoom,FoesRoom]),
    "20" : new level(6000, [standartRoom, PeaceRoom, standartJumpRoom, HardRoom, HardHoleRoom, ChallengeRoom, LuckRoom, PikeRoom]),
    more: new level(10000, [standartRoom,  standartJumpRoom, HardRoom, HardHoleRoom, ChallengeRoom, LuckRoom, PikeRoom])
}


//Generate the level with a bit of random 
function generateLevel(X) {
    var actualLength = 0;
    var niveau;
    if (X < 20) {
        niveau = Levels[X];
    }
    else {
        niveau = Levels["more"]
    }
    var lengthToGo = niveau.length;
    var b = [];
    var t = [];
    var e = [];
    var d = [];
    var rooms = niveau.rooms;
    while (actualLength < lengthToGo) {
        roomI = getRandomInt(rooms.length);
        if (actualLength != 0) {
            var roomRes = generateRoom(rooms[roomI], actualLength, X);
        } else {
            var roomRes = generateRoom(StartRoom, actualLength, X);
        }
        addAll(roomRes.b, b);
        addAll(roomRes.t, t);
        addAll(roomRes.e, e);
        addAll(roomRes.d, d);
        actualLength += roomRes.size;
    }

    return new Walls(b, 151, t, e, actualLength).forward(0);
}


class Room {
    constructor() {
        this.b = [];
        this.t = [];
        this.e = [];
        this.d = [];
        this.size = 0;
    }
}

function generateRoom(room, x, lvl) {
    var res = new Room();
    var superiorOffset = 200
    var roomO = new room();
    var size = roomO.size;
    var actualLength = 0;
    var onSeCalmeAvecLesNiveauTropHard = 0;
    

    while (actualLength < size) {
        var hard;
        do {
            hard = false;
            //floor
            let floorTI = getRandomInt(roomO.bot.length);
            var floorT = roomO.bot[floorTI];

            let floorI = getRandomInt(floorT.heigth.length);
            let floorH = floorT.heigth[floorI];
            {

                let w = new Wall(x + actualLength, 24 * (floorH - 1), floorT.width, (25 - floorH + 1) * 24, floorT.color);
                if (floorT.unTouchable) {
                    this.hard = true
                    w.peacefull = false;
                }
                res.b.push(w);
            }

        } while (onSeCalmeAvecLesNiveauTropHard > 650 && hard);

        //roof
        let roofTI = getRandomInt(roomO.top.length);
        let roofT = roomO.top[roofTI];
        let roofI = getRandomInt(roofT.heigth.length);
        let roofH = roofT.heigth[roofI];
        {
            let w = new Wall(x + actualLength, (24 * roofH) - superiorOffset, roofT.width, superiorOffset + (0 + roofH) * 24, roofT.color)
            res.t.push(w);
            if (roofT.unTouchable) {

                w.peacefull = false;
            }
        }
        //en
        //What enemy we generate 
        do {
            var vrai = vrai;
            let enI = getRandomInt(roomO.enemies.length);
            let enT = roomO.enemies[enI];
            if ((enT.proba + lvl * enT.increaseProbaByLevel > getRandomInt(100))) {
                res.e.push(new enT.classe(x + actualLength + 10, getRandomInt(200) + 285 - 100, 0, 0,( getRandomInt(4) + 1) * 0.1, (getRandomInt(4)+1) * 0.1, 'rgb(100,100,100)'));
            }
            else { vrai = false }
        } while (vrai);
        actualLength += floorT.width;
        if (!hard) {
            onSeCalmeAvecLesNiveauTropHard = 0;
        }
        else {
            onSeCalmeAvecLesNiveauTropHard += floorT.width;
        }

    }
    res.size = actualLength;
    return res
}
