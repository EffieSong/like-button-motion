"use strict"


let cnv2;
let shootStars = [];
let emojiSize = 35;
let active = false;
let like = {
  x: 300,
  y: 436,
  l: 40
};
let myShoot;

function setup() {
  cnv2 = createCanvas(375, 812);
  cnv2.class("canvas");
  let cnvNode = document.querySelector(".canvas")
  let cnvContainer = document.querySelector(".canvas-container");
  cnvContainer.appendChild(cnvNode);
  textAlign(CENTER, CENTER);
  textSize(emojiSize);
  rectMode(CENTER);
}

function draw() {
  drawingContext.clearRect(0, 0, cnv2.width, cnv2.height);
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
  //rect(like.x, like.y, like.l, like.l);
  if (mouseIsPressed && active) {
    line(like.x, like.y, mouseX, mouseY);
  }
}

let like_button = document.querySelector(".like-button");
let buttonIsHover = false;
like_button.onmouseover = function () {
  buttonIsHover = true
};
like_button.onmouseleave = function () {
  buttonIsHover = false
};

function mousePressed() {
  loop();
  if (buttonIsHover) {
    myShoot = setInterval(continueShoot, 80);
    active = true;
  }
}

function mouseReleased() {
  active = false;
  clearInterval(myShoot);
}

function continueShoot() {
  let angle = Math.atan2(-(mouseY - like.y), mouseX - like.x);
  let s = new RainballShoot(like.x, like.y, [angle - 0.2 * PI, angle + 0.2 * PI]);
  shootStars.push(s);
}

function RainballShoot(x, y, spreadAngle = [0, TWO_PI]) {
  this.particles = [];
  this.explodes = [];
  this.currentState = false; // whether is collided
  this.preState = false;
  this.spreadAngle = spreadAngle;
  this.isDead = false;

  let angle = random(this.spreadAngle[0], this.spreadAngle[1]);
  this.vel = createVector(cos(angle), -sin(angle)).normalize().mult(random(7, 18));


  let colors = ['#FFFFFF', '#F9D347', '#F29F39', '#ec4940', '#CF4DEF', '#3F99F7', '#5BC339'];
  for (i = 0; i < colors.length; i++) {
    let star = new Particle(x, y);
    star.lifeSpan = 30;
    star.rotation = random(-PI/3,PI/3);
    star.offsetT = i * 0.4;
    star.vel = this.vel.copy();
    star.c = colors[i];
    star.edge = "none";
    if (i > 0) star.sprite = 'ellipse';
    star.customUpdateFunction = function () {
      this.scale = this.scale < 30 ? this.scale + 1 : 30;
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
      for (i = this.particles.length - 1; i >= 0; i--) {
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

