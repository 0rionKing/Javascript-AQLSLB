class Keyboard {
    constructor() {
    }
    keyPressed(keycode) {
        this[keycode] = KeyboardEnum.KEYPRESSED;
    }
    keyUp(keyCode) {
        this[keyCode] = KeyboardEnum.KEYNOTPRESSED;
    }
    isPressed(keyCode) {
        return this.hasOwnProperty(keyCode) && this[keyCode];
    }
}

var KeyboardEnum = {
    KEYPRESSED: true,
    KEYNOTPRESSED: false
}