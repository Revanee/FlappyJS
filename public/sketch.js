/*jslint vars: true, plusplus: true, devel: true, esversion: 6*/
/*globals background, createCanvas, document, resizeCanvas, rect, rectMode, CENTER, width, height, keyCode, WEBGL, window, fill, translate, setTimeout, mouseX, mouseY, text, textSize */

var jumpPower = 25;
var weight = 5;
var gravity = 9.8;

var prevTime;

var state = "Run";

function setup() {
	createCanvas(document.body.offsetWidth, document.body.offsetHeight);
	rectMode(CENTER);
	init();
	prevTime = window.performance.now();
}

function draw() {

	background('#35e052');
	//translate(-width / 2, -height / 2);

	if (state === "Run") {
		update(window.performance.now() - prevTime);

		if (checkIfDead()) {
			die();
		}
	}

	if (state === "Dead") {
		menu.draw();
	}

	bird.draw();

}

function checkIfDead() {
	if (bird.pos.y < 0 || bird.pos.y > height) return true;
	else return false;
}

function die() {
	state = "Dead";
}

function live() {
	state = "Run";
	bird.pos.x = width / 4;
	bird.pos.y = height / 4;
	bird.vel.x = 0;
	bird.vel.y = 0;
}

function update(elapsedTime) {
	var targetTime = 16;
	var delta = targetTime / elapsedTime;
	var acc = gravity / bird.mass;
	bird.vel.y += acc;
	bird.pos.y += bird.vel.y;
}

function init() {
	bird.pos.x = width / 4;
	bird.pos.y = height / 4;
	menu.pos.x = width / 2;
	menu.pos.y = height / 2;
	menu.size.x = width / 4;
	menu.size.y = height / 8;
}

function keyPressed() {
	if (state === "Run") jump();
}

function mouseClicked() {
	click();
}

function touchStarted() {
	click();
}

function click() {
	if (state === "Run") jump();
	if (state === "Dead") {
		if (menu.hover()) live();
	}
}

function windowResized() {
	resizeCanvas(document.body.offsetWidth, document.body.offsetHeight);
	init();
}

function jump() {
	bird.vel.y = -jumpPower;
}

var bird = {
	pos: {
		x: 0,
		y: 0
	},
	vel: {
		x: 0,
		y: 0
	},
	size: {
		x: 50,
		y: 50
	},
	mass: weight,
	draw: function () {
		fill('#f4ce42');
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
};

var menu = {
	pos: {
		x: 0,
		y: 0
	},
	size: {
		x: 0,
		y: 0
	},
	draw: function () {
		fill(255);
		if (this.hover()) fill(100);
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		fill('#ff6321');
		textSize(this.size.y - 10);
		text("Retry", this.pos.x, this.pos.y, this.size.x, this.size.y);

	},
	hover: function () {
		if (mouseX < this.pos.x + this.size.x / 2 && mouseX > this.pos.x - this.size.x / 2 &&
			mouseY < this.pos.y + this.size.y / 2 && mouseY > this.pos.y - this.size.y / 2) {
			return true;
		} else return false;
	}
};
