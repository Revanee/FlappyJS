class Backdrop {
    constructor() {
		this.clouds = []
	    this.addCloud()
	    let bd = this
	    this.spawner = setInterval(function() {
	        bd.addCloud()
	    }, 1000)

    }
    update(deltaT) {
	    
	    //cull
        this.clouds = this.clouds.reduce(function (temp, cloud) {
            if(cloud.pos.x + cloud.size > -width / 2) temp.push(cloud)
            return temp
        }, [])

	    this.clouds.forEach(function(cloud) {
	        cloud.update(deltaT)
	    })

    }
    draw() {
	    //Use a better way to optimize
	    texture(this.clouds[0].sprite)
	    this.clouds.forEach(function(cloud) {
	        cloud.draw()
	    })

    }
    addCloud() {
		this.clouds.push(new Cloud())
    }
    mousePressed(){

    }
}
