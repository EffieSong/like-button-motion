"use strict"

var data = [{
    key: "randomdirection",
    draw: function (cnv = CNV) {
        drawingContext.clearRect(0, 0, cnv.width, cnv.height);
        shootStars.forEach(item => item.run());
        if (shootStars.every(item => {
                return item.isDead ? true : false
            })) shootStars.length = 0;
        if (shootStars.length == 0 && !mouseIsPressed) {
            noLoop();
        }
        noStroke();
    },

    mousePressed: function (hover = buttonIsHover) {
        if (hover) {
            let s = new RandomDirectionShoot(like.x, like.y);
            shootStars.push(s);
            loop();
        }
    },
    mouseReleased: function () {},
}, {
    key: "presstocontroldirection",
    draw: function (cnv = CNV) {
        drawingContext.clearRect(0, 0, cnv.width, cnv.height);
        shootStars.forEach(item => {
            item.run();
        });
        if (shootStars.every(item => {
                return item.isDead ? true : false
            })) shootStars.length = 0;
        if (shootStars.length == 0 && !mouseIsPressed) {
            noLoop();
        }
        noFill();
        strokeWeight(1);
        stroke(0);
        rect(like.x, like.y, like.l, like.l);
        if (mouseIsPressed && active) {
            line(like.x, like.y, mouseX, mouseY);
        }
    },
    mousePressed: function (hover = buttonIsHover) {
        loop();
        if (hover) {
            myShoot = setInterval(continueShoot, 80);
            active = true;
        }
    },
    mouseReleased: function () {
        active = false;
        clearInterval(myShoot);
    },
}];
//------------------randomdirection & presstocontroldirection----------------------------
let shootStars = [];
let e;
let CNV;
let CANVASWIDTH = 251;
let CANVASHEIGHT = 490;
let emojiSize = 30;
let like_button = document.querySelector(".like-button");
let buttonIsHover = false;
like_button.onmouseover = function () {
    buttonIsHover = true
};
like_button.onmouseleave = function () {
    buttonIsHover = false
};

//--------------------------presstocontroldirection------------------------------------------
let active = false;
let like = {
    x: 196+10,
    y: 245+10,
    l: 20
};
let myShoot;

function continueShoot() {
    let angle = Math.atan2(-(mouseY - like.y), mouseX - like.x);
    let s = new RainballShoot(like.x, like.y, [angle - 0.2 * PI, angle + 0.2 * PI]);
    shootStars.push(s);
}
// ----------------------------------------------------------------------------
function setup() {
    CNV = createCanvas(CANVASWIDTH, CANVASHEIGHT);
    CNV.class("canvas");
    let cnvContainer = document.querySelector(".canvas-container");
    let cnvNode = document.querySelector(".canvas")
    cnvContainer.appendChild(cnvNode);
    textAlign(CENTER, CENTER);
    textSize(emojiSize);
    rectMode(CENTER);
}

function draw() {}
function mousePressed() {}
function mouseReleased() {}
draw = data[0].draw;
mousePressed = data[0].mousePressed;
mouseReleased = data[0].mouseReleased;

let animaOptions = document.querySelectorAll("#animation-options li");
animaOptions.forEach((item, index) => {
    item.onclick = function () {
        // Add active class to the current button (highlight it)
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";

        draw = data[index].draw;
        console.log(index);
        mousePressed = data[index].mousePressed;
        mouseReleased = data[index].mouseReleased;
        
    };
});

function RainballShoot(x, y, spreadAngle = [0, TWO_PI], cnv = CNV) {
    this.particles = [];
    this.explodes = [];
    this.currentState = false; // whether is collided
    this.preState = false;
    this.spreadAngle = spreadAngle;
    this.isDead = false;

    let angle = random(this.spreadAngle[0], this.spreadAngle[1]);
    this.vel = createVector(cos(angle), -sin(angle)).normalize().mult(random(7, 18));


    let colors = ['#FFFFFF', '#F9D347', '#F29F39', '#ec4940', '#CF4DEF', '#3F99F7', '#5BC339'];
    for (let i = 0; i < colors.length; i++) {
        let star = new Particle(x, y);
        star.lifeSpan = 30;
        star.rotation = random(-PI / 3, PI / 3);
        star.offsetT = i * 0.4;
        star.vel = this.vel.copy();
        star.c = colors[i];
        star.edge = "none";
        if (i > 0) star.sprite = 'ellipse';
        star.customUpdateFunction = function () {
            let d = (emojiSize-this.scale)/ colors.length;
            this.scale = this.scale < emojiSize ? this.scale + d : emojiSize;
            switch (true) {
                case this.location.x <= 0:
                    this.vel.x *= -1;
                    this.edge = "left";
                    break;
                case this.location.x >= cnv.width - emojiSize / 3:
                    this.vel.x *= -1;
                    this.edge = "right";
                    break;
                case this.location.y <= 0 + emojiSize / 2:
                    this.vel.y *= -1;
                    this.edge = "top";
                    break;
                case this.location.y >= cnv.height - emojiSize / 2:
                    this.vel.y *= -1;
                    this.edge = "bottom";
                    break;
                default:
                    this.edge = "none"
            }
        }
        this.particles.push(star);
    }

    this.run = function () {
        let lastP = this.particles[0];
        this.currentSate = lastP.lifeCount == lastP.lifeSpan || lastP.edge != "none";
        if (!this.currentSate) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].run();
            }
        } else if (this.currentSate && !this.preState) {
            let n = lastP.edge == "left" || lastP.edge == "right" ? 50 : 30;
            let spreadAngle = lastP.edge == "left" ? [-0.5 * PI, 0.5 * PI] : lastP.edge == "right" ? [0.5 * PI, 1.5 * PI] : [0, 2 * PI];
            let e = new Explode(lastP.location.x, lastP.location.y, n, 5, spreadAngle);
            this.explodes.push(e);
        }
        this.explodes.forEach(item => item.run());
        this.preState = this.currentSate;
        if (this.explodes.length != 0) {
            if (this.explodes.every(item => {
                    return item.isDead ? true : false
                })) {
                this.explodes.length = 0;
                this.isDead = true;
            }
        }
    }

}

function RandomDirectionShoot(x, y, cnv = CNV) {
    this.particles = [];
    this.explodes = [];
    this.currentState = false;
    this.preState = false;
    this.isDead = false;
    let vel = createVector(random(-1, 1), random(-1, 1)).normalize().mult(random(9, 17));
    let colors = ['#FFFFFF', '#F9D347', '#F29F39', '#ec4940', '#CF4DEF', '#3F99F7', '#5BC339'];
    for (let i = 0; i < colors.length; i++) {
        let star = new Particle(x, y);
        star.lifeSpan = 30;
        star.offsetT = i * 1.6;
        star.vel = vel.copy();
        star.c = colors[i];
        star.edge = "none";
        star.rotation = random(-PI / 4, PI / 4);
        if (i > 0) star.sprite = 'ellipse';
        star.customUpdateFunction = function () {
            this.scale = this.scale < emojiSize ? this.scale + 1 : emojiSize;
            switch (true) {
                case this.location.x <= 0:
                    this.vel.x *= -1;
                    this.edge = "left";
                    break;
                case this.location.x >= cnv.width - emojiSize / 3:
                    this.vel.x *= -1;
                    this.edge = "right";
                    break;
                case this.location.y <= 0 + emojiSize / 2:
                    this.vel.y *= -1;
                    this.edge = "top";
                    break;
                case this.location.y >= cnv.height - emojiSize / 2:
                    this.vel.y *= -1;
                    this.edge = "bottom";
                    break;
                default:
                    this.edge = "none"
            }
        }
        this.particles.push(star);
    }

    this.run = function () {
        let lastP = this.particles[0];
        this.currentSate = lastP.lifeCount == lastP.lifeSpan || lastP.edge != "none";
        if (!this.currentSate) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].run();
            }
        } else if (this.currentSate && !this.preState) {
            let n = lastP.edge == "left" || lastP.edge == "right" ? 50 : 30;
            let spreadAngle = lastP.edge == "left" ? [-0.5 * PI, 0.5 * PI] : lastP.edge == "right" ? [0.5 * PI, 1.5 * PI] : [0, 2 * PI];
            let e = new Explode(lastP.location.x, lastP.location.y, n, 7, spreadAngle);
            this.explodes.push(e);
        }
        this.explodes.forEach(item => item.run());
        this.preState = this.currentSate;
        if (this.explodes.length != 0) {
            if (this.explodes.every(item => {
                    return item.isDead ? true : false
                })) {
                this.explodes.length = 0;
                this.isDead = true;
            }
        }
    }

}

