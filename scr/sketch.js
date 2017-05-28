p5.disableFriendlyErrors = true;

//declare time step variables
let oldTime
let elapsedTime

//declare assets
let sprites = {}
let sounds = {}

//declare screens stack
let screens = []

//keep track of score
let score
if (localStorage.score) {
    score = JSON.parse(localStorage.score)
} else {
    score = {
        best: 0,
        last: 0
    }
    localStorage.score = JSON.stringify(score)
}

//load spritesk
function preload() {

    sprites.bird = loadGif('assets/sprites/bird/TrashyDove.gif')
    sprites.tube = {
        top: loadImage('assets/sprites/tube/TubeTop.png'),
        bottom: loadImage('assets/sprites/tube/TubeBottom.png'),
        body: loadImage('assets/sprites/tube/TubeBody.png')
    }
    sprites.menu = {
        play: loadImage('assets/sprites/play-button.png'),
        best: loadImage('assets/sprites/best.png'),
        last: loadImage('assets/sprites/last.png')
    }
    sprites.numbers = [loadImage('assets/sprites/numbers/0.png'),
        loadImage('assets/sprites/numbers/1.png'),
        loadImage('assets/sprites/numbers/2.png'),
        loadImage('assets/sprites/numbers/3.png'),
        loadImage('assets/sprites/numbers/4.png'),
        loadImage('assets/sprites/numbers/5.png'),
        loadImage('assets/sprites/numbers/6.png'),
        loadImage('assets/sprites/numbers/7.png'),
        loadImage('assets/sprites/numbers/8.png'),
        loadImage('assets/sprites/numbers/9.png'),
    ]
    sounds.tube = {
        hit: [loadSound('assets/sounds/tube/hit_1.flac')]
    }
    sounds.bird = {
        flap: [loadSound('assets/sounds/bird/flap_1.flac'),
            loadSound('assets/sounds/bird/flap_2.flac'),
            loadSound('assets/sounds/bird/flap_3.flac'),
            loadSound('assets/sounds/bird/flap_4.flac'),
        ]
    }
}

//initialize state of game
function setup() {
    override()
    createCanvas(document.body.offsetWidth, document.body.offsetHeight, WEBGL)

    screens.push(new Backdrop())
    screens.push(new Game())
    screens.push(new Menu())

    oldTime = window.performance.now()
}

//main looping function, draw current frame
function draw() {
    //update time elapsed between frames
    elapsedTime = window.performance.now() - oldTime
    oldTime = window.performance.now()

    //update game logic
    update()

    //draw elements

    //use background to debug fps
    background('#22e4f9')
        //background(255 - frameRate() / 60 * 255, 0, frameRate() / 60 * 255)

    screens.forEach(function(screen) {
        screen.draw()
    })
}

//update game logic once every frame
function update() {
    let targetTime = 1000 / 60
    let deltaT = elapsedTime / targetTime

    screens.forEach(function(screen) {
        screen.updateGraphics(deltaT)
    })

    screens[screens.length - 1].updateLogic(deltaT)
}

//controls
function keyPressed() {
    try {
        screens[screens.length - 1].keyPressed()
    } catch (e) {}
}

function keyReleased() {
    try {
        screens[screens.length - 1].keyReleased()
    } catch (e) {}
}


//Avoid double event firing on touch devices
//skip next mousePressed() whenever touchStart() is called
let skipNextMouseClick = false

function mousePressed() {
    if (skipNextMouseClick) {
        console.log('mousePressed')
        try {
            screens[screens.length - 1].mousePressed()
        } catch (e) {}
    }
    skipNextMouseClick = true
}

function touchStarted() {
    skipNextMouseClick = false
    console.log('touch')
    try {
        screens[screens.length - 1].mousePressed()
    } catch (e) {}
}

function mouseReleased() {
    try {
        screens[screens.length - 1].mouseReleased()
    } catch (e) {}
}

//allow resizing
function windowResized() {
    resizeCanvas(document.body.offsetWidth, document.body.offsetHeight)
}

//check if landscape
function isLandscape() {
    if (width > height) return true
    else return false
}

//Override library functions

//Disable texture filtering for textures
let override = function() {
    console.log('overriding')
    let _texture = texture
    texture = function(arg) {
        _texture(arg)
        _renderer.GL.texParameteri(_renderer.GL.TEXTURE_2D, _renderer.GL.TEXTURE_MAG_FILTER, _renderer.GL.NEAREST)
    }
}

//Disable auto_play for gifs
let loadGif = function(url, cb) {
    var gif = new SuperGif({
        gif: url,
        p5inst: this,
        auto_play: false
    })

    gif.load(cb)

    var p5graphic = gif.buffer()

    p5graphic.play = gif.play
    p5graphic.pause = gif.pause
    p5graphic.playing = gif.get_playing
    p5graphic.frames = gif.get_frames
    p5graphic.totalFrames = gif.get_length

    p5graphic.loaded = function() {
        return !gif.get_loading()
    }

    p5graphic.frame = function(num) {
        if (typeof num === 'number') {
            gif.move_to(num)
        } else {
            return gif.get_current_frame()
        }
    }

    return p5graphic
}
