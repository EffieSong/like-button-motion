"use strict"
let shootStars = [];
let e;
let CNV;
let emojiSize = 38;
//let CNV;

function init(){
  let cnv = createCanvas(375, 812);
  cnv.class("canvas");
  let cnvNode = document.querySelector(".canvas")
  let cnvContainer = document.querySelector(".canvas-container");
  cnvContainer.appendChild(cnvNode);
  textAlign(CENTER, CENTER);
  textSize(emojiSize);
  return cnv;
}

function setup() {
  CNV=init();
}
function draw() {
  animate(CNV);
}

function animate(cnv){
  drawingContext.clearRect(0, 0, cnv.width, cnv.height);
  shootStars.forEach(item => item.run());
  if (shootStars.every(item => {
      return item.isDead ? true : false
    })) shootStars.length = 0;
  if (shootStars.length == 0 && !mouseIsPressed) {
    noLoop();
  }
  noStroke();
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
  if (buttonIsHover) {
    let s = new RandomDirectionShoot(mouseX, mouseY);
    shootStars.push(s);
    loop();
  }
}

function RandomDirectionShoot(x, y,cnv=CNV) {
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
    star.rotation = random(-PI/4,PI/4);
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

