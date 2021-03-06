class Bird {
    constructor() {
        this.pos = {
            x: -width / 4,
            y: -height / 4
        }
        this.vel = {
            x: 0,
            y: 0
        }
        this.size = ((height + width) / 2) / 10
        this.getHitbox = () => {
            let offset = 0.5
            return {
                pos: {
                    x: this.pos.x - (this.size / 2) * offset,
                    y: this.pos.y - (this.size / 2) * offset
                },
                size: this.size * offset
            }
        }
        this.gravity = ((height + width) / 2) / 700
        this.jumpPower = this.gravity * 12
        this.sprite = new Sprite(sprites.bird)
        this.sprite.stop()
    }

    update(deltaT) {
        this.vel.y += this.gravity * deltaT
        this.pos.y += this.vel.y * deltaT
    }

    draw() {

        push()

        translate(this.pos.x, this.pos.y)
        rotateZ((-this.vel.y / this.jumpPower) / 2)
        specularMaterial(0, 0, 0, 0)
        texture(this.sprite.getImage())
        plane(this.size, this.size.y)

        pop()


        //draw hitbox
        //not working
        // push()

        // translate(this.hitbox.pos.x() + this.hitbox.size() / 2, this.hitbox.pos.y() + this.hitbox.size() / 2)
        // let t = createGraphics(1, 1)
        // t.background(255)
        // texture(t)
        // plane(this.hitbox.size(), this.hitbox.size())

        // pop()
    }

    jump() {
        //Apply velocity
        this.vel.y = -this.jumpPower

        //Start animation
        this.sprite.playOnce()

        //Play a random flap sound
        sounds.bird.flap[Math.floor(Math.random() * sounds.bird.flap.length)].play()
    }

    collides(tubes) {
        let collided = false
        let hitbox = this.getHitbox()

        if (hitbox.pos.y > height / 2) {
            collided = true
        }

        tubes.forEach(function(tube) {
            if (tube.collides(hitbox)) {
                collided = true
                sounds.tube.hit[Math.floor(Math.random() * sounds.tube.hit.length)].play()
            }
        })

        return collided
    }

    die() {
        this.sprite.stop()
    }
}
