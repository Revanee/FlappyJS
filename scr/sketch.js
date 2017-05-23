let oldTime
let elapsedTime

let state = "Menu"

let bird
let tubes = []
let clouds = []
let sprites = {}
let sounds = {}

let spawner

let score

//load sprites
function preload() {

    sprites.bird = loadGif('assets/sprites/bird/TrashyDove.gif')
    sprites.tube = {
        top: loadImage('assets/sprites/tube/TubeTop.png'),
        bottom: loadImage('assets/sprites/tube/TubeBottom.png'),
        body: loadImage('assets/sprites/tube/TubeBody.png')
    }
    sprites.menu = loadImage('assets/sprites/play-button.png')

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
    createCanvas(document.body.offsetWidth, document.body.offsetHeight, WEBGL)

    bird = new Bird(sprites)

    clouds.push(new Cloud())
    setInterval(function() {
        clouds.push(new Cloud())
    }, 1000)

    init()

    oldTime = window.performance.now()
}

//main looping function, draw current frame
function draw() {
    //update time elapsed between frames
    elapsedTime = window.performance.now() - oldTime
    oldTime = window.performance.now()

    //update game logic
    update()

    //splice arrays
    //TODO: use a better way for culling
    if (tubes.length > 3) {
        tubes.splice(0, 1)
    }
    if (clouds.length > 100) {
        clouds.splice(0, 1)
    }

    //draw elements

    background('#22e4f9')

    clouds.forEach(function(cloud) {
        cloud.draw()
    })

    bird.draw()

    _texture(sprites.tube.top)
    tubes.forEach(function(tube) {
        tube.drawTop()
    })

    _texture(sprites.tube.body)
    tubes.forEach(function(tube) {
        tube.drawBody()
    })

    _texture(sprites.tube.bottom)
    tubes.forEach(function(tube) {
        tube.drawBottom()
    })

    if (state === "Menu") {
        menu.draw()
    }
}

//update game logic once every frame
function update() {
    let targetTime = 1000 / 60
    let deltaT = elapsedTime / targetTime

    clouds.forEach(function(cloud) {
        cloud.update(deltaT)
    })

    if (state === "Playing") {
        bird.update(deltaT)

        tubes.forEach(function(tube) {
            tube.update(deltaT)

            //score
            if (tube.pos.x + tube.size < bird.pos.x && !tube.passed) {
                tube.passed = true
                score++
                console.log(score)
            }
        })

        //check for death
        if (bird.collides(tubes)) {
            //handle death
            state = "Menu"
            bird.die()
            clearInterval(spawner)
            console.log("Score: " + score)
        }
    }
}

//called on spawn
function live() {
    score = 0
    tubes = []
    state = "Playing"
    bird = new Bird(sprites)

    tubes.push(new Tube())
    spawner = setInterval(function() {
        tubes.push(new Tube())
    }, 2000)

    init()

    bird.jump()
}

//menu object
let menu = {
    pos: {
        x: 0,
        y: 0
    },
    size: 0,
    draw: function() {
        _texture(sprites.menu)



        if (this.hover()) {
            plane(this.size * 1.2, this.size * 1.2)
        } else {
            plane(this.size, this.size)
        }
    },
    hover: function() {
        if (mouseX < width / 2 + this.size / 2 && mouseX > width / 2 - this.size / 2 &&
            mouseY < height / 2 + this.size / 2 && mouseY > height / 2 - this.size / 2) {
            return true
        } else return false
    }
}

//controls
function keyPressed() {
    if (state === "Playing") bird.jump()
}

function mousePressed() {
    if (state === "Playing") bird.jump()
    if (state === "Menu") {
        if (menu.hover()) live()
    }
}

//allow resizing
function windowResized() {
    resizeCanvas(document.body.offsetWidth, document.body.offsetHeight)
    init()
}

//adjust sizes based on proportions
function init() {
    menu.size = ((height + width) / 2) / 3
}

//Override library functions

//Disable texture filtering for textures
let _texture = function(arg) {
    texture(arg)
    _renderer.GL.texParameteri(_renderer.GL.TEXTURE_2D, _renderer.GL.TEXTURE_MAG_FILTER, _renderer.GL.NEAREST)
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
