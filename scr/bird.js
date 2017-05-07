/*jshint node: true, esversion: 6, asi: true*/
/*global image*/

module.exports = class Bird {
	constructor(weight) {

		this.pos = {
			x: 0,
			y: 0
		}
		this.vel = {
			x: 0,
			y: 0
		}
		this.size = {
			x: 50,
			y: 50
		}
		this.mass = weight
		this.sprite = null
	}

	draw() {
		image(this.sprite, this.pos.x, this.pos.y, this.size.x, this.size.y)
	}

}
