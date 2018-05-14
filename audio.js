var dieSound;
var musicquiSeBalade;
var playing = false;

function audioInit() {
    dieSound = new Audio("Sound/Die.mp3");
    //dieSound.oncanplay = function () {
    //    dieRdy = true;
    //};
    musicquiSeBalade = new Audio("Sound/Ambiant.mp3");
    //musicquiSeBalade.oncanplay = function () {
    //    ambRdy = true;
    //};
    musicquiSeBalade.volume = 0.1;
    musicquiSeBalade.loop = true;
    musicquiSeBalade.autoplay = true;
}



function audioReady() {
    return dieRdy && dieRdy;
}