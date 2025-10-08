let backgroundImg;

let hourAngle = 0;
let minuteAngle = 0;
let secondAngle = 0;

let isRotating = false;

let angleCheckpoint = -90;

let shapes = [];

let matrixChars = [];

let rotationSpeed = 6;

let startTime = 0;
let shapesCleared = false;
let fadeAlpha = 255;

let magnifierActive = false;
let magnifierSize = 100;
let magnifyScale = 2;

let clockCenterX;
let clockCenterY;
let clockRadius = 150;

function preload() {
  backgroundImg = loadImage('libraries/cri_000000386470.jpg');
}

function setup() {
  createCanvas(800, 600);
  
  clockCenterX = 200;
  clockCenterY = height / 2;
  
  hourAngle = -90;
  minuteAngle = -90;
  secondAngle = -90;
  
  for (let i = 0; i < 80; i = i + 1) {
    let matrixChar = new MatrixCharacter(random(width), random(-500, 0), random(2, 5));
    matrixChars.push(matrixChar);
  }
}

function draw() {
  if (isRotating) {
    let currentTime = millis();
    let timeElapsed = (currentTime - startTime) / 1000;
    
    if (timeElapsed >= 10 && shapesCleared == false) {
      shapes = [];
      shapesCleared = true;
      magnifierActive = true;
    }
    
    if (timeElapsed >= 10 && timeElapsed < 30) {
      fadeAlpha = 255 - ((timeElapsed - 10) / 20) * 255;
    } else if (timeElapsed >= 30) {
      fadeAlpha = 0;
    }
  }
  
  if (shapesCleared == true) {
    if (backgroundImg) {
      image(backgroundImg, 0, 0, width, height);
    } else {
      background(150, 200, 255);
    }
  } else {
    background(220);
  }
  
  if (shapesCleared == false) {
    for (const shape of shapes) {
      shape.draw();
    }
  }
  
  if (shapesCleared == false) {
    for (const matrixChar of matrixChars) {
      matrixChar.update();
      matrixChar.draw();
    }
  } else if (fadeAlpha > 0) {
    for (const matrixChar of matrixChars) {
      matrixChar.update();
      matrixChar.draw();
    }
  }
  
  if (shapesCleared == false) {
    fill(255);
    stroke(0);
    strokeWeight(3);
    ellipse(clockCenterX, clockCenterY, clockRadius * 2, clockRadius * 2);
    
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    
    for (let i = 1; i <= 12; i++) {
      let angle = i * 30 - 90;
      let angleRad = angle * 3.14159 / 180;
      let x = clockCenterX + cos(angleRad) * (clockRadius * 0.75);
      let y = clockCenterY + sin(angleRad) * (clockRadius * 0.75);
      text(i, x, y);
    }
    
    fill(0);
    ellipse(clockCenterX, clockCenterY, 10, 10);
  } else if (fadeAlpha > 0) {
    fill(255, fadeAlpha);
    stroke(0, fadeAlpha);
    strokeWeight(3);
    ellipse(clockCenterX, clockCenterY, clockRadius * 2, clockRadius * 2);
    
    fill(0, fadeAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    
    for (let i = 1; i <= 12; i++) {
      let angle = i * 30 - 90;
      let angleRad = angle * 3.14159 / 180;
      let x = clockCenterX + cos(angleRad) * (clockRadius * 0.75);
      let y = clockCenterY + sin(angleRad) * (clockRadius * 0.75);
      text(i, x, y);
    }
    
    fill(0, fadeAlpha);
    ellipse(clockCenterX, clockCenterY, 10, 10);
  }
  
  if (isRotating == true) {
    rotationSpeed = rotationSpeed + 0.05;
    
    secondAngle = secondAngle + rotationSpeed;
    minuteAngle = minuteAngle + rotationSpeed / 60;
    hourAngle = hourAngle + rotationSpeed / 720;
    
    if (secondAngle >= angleCheckpoint + 30 && shapesCleared == false) {
      let numShapes = 5 + int(random(6));
      for (let i = 0; i < numShapes; i = i + 1) {
        addRandomShape();
      }
      angleCheckpoint = angleCheckpoint + 30;
    }
  }
  
  drawClockHand(hourAngle, clockRadius * 0.4, 8, color(50, 50, 50, fadeAlpha));
  drawClockHand(minuteAngle, clockRadius * 0.6, 5, color(100, 100, 100, fadeAlpha));
  drawClockHand(secondAngle, clockRadius * 0.8, 2, color(255, 0, 0, fadeAlpha));
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text("Click mouse: Start/Stop rotation", 450, 50);
  text("Press SPACE: Reset everything", 450, 80);
  if (shapesCleared == true) {
    text("Press 1: Toggle magnifier ON/OFF", 450, 110);
    text("Magnifier: " + (magnifierActive ? "ON" : "OFF"), 450, 140);
  }
  
  if (magnifierActive == true && shapesCleared == true && backgroundImg) {
    drawMagnifier();
  }
}

function drawClockHand(angle, length, thickness, handColor) {
  stroke(handColor);
  strokeWeight(thickness);
  
  let rad = angle * 3.14159 / 180;
  
  let endX = clockCenterX + cos(rad) * length;
  let endY = clockCenterY + sin(rad) * length;
  
  line(clockCenterX, clockCenterY, endX, endY);
}

function mousePressed() {
  if (isRotating == true) {
    isRotating = false;
  } else {
    isRotating = true;
    startTime = millis();
    shapesCleared = false;
    rotationSpeed = 6;
  }
}

function keyPressed() {
  if (key == " ") {
    isRotating = false;
    shapes = [];
    shapesCleared = false;
    hourAngle = -90;
    minuteAngle = -90;
    secondAngle = -90;
    angleCheckpoint = -90;
    rotationSpeed = 6;
    startTime = 0;
    fadeAlpha = 255;
    magnifierActive = false;
    
    matrixChars = [];
    for (let i = 0; i < 80; i = i + 1) {
      let matrixChar = new MatrixCharacter(random(width), random(-500, 0), random(2, 5));
      matrixChars.push(matrixChar);
    }
  }
  
  if (key == "1") {
    if (magnifierActive == true) {
      magnifierActive = false;
    } else {
      magnifierActive = true;
    }
  }
}

function addRandomShape() {
  let size = 20 + random(80);
  
  let x = size / 2 + random(width - size);
  let y = size / 2 + random(height - size);
  
  let useGradient = false;
  if (random(1) < 0.1) {
    useGradient = true;
  }
  
  let shapeColor = color(random(255), random(255), random(255), 150 + random(105));
  let gradientColor1 = color(random(255), random(255), random(255));
  let gradientColor2 = color(random(255), random(255), random(255));
  
  let shapeType = int(random(4));
  
  let rotationAngle = random(360);
  
  let strokeColor = color(random(255), random(255), random(255));
  
  let newShape = new RandomShape(x, y, size, shapeColor, shapeType, useGradient, gradientColor1, gradientColor2, rotationAngle, strokeColor);
  shapes.push(newShape);
}

function drawMagnifier() {
  let srcCenterX = (mouseX / width) * backgroundImg.width;
  let srcCenterY = (mouseY / height) * backgroundImg.height;
  
  let srcSize = magnifierSize / magnifyScale;
  
  let srcX = srcCenterX - srcSize / 2;
  let srcY = srcCenterY - srcSize / 2;
  
  srcX = max(0, min(srcX, backgroundImg.width - srcSize));
  srcY = max(0, min(srcY, backgroundImg.height - srcSize));
  
  let magnifiedImg = backgroundImg.get(srcX, srcY, srcSize, srcSize);
  
  imageMode(CENTER);
  image(magnifiedImg, mouseX, mouseY, magnifierSize, magnifierSize);
  imageMode(CORNER);
}

class RandomShape {
  
  constructor(xPosInPrm, yPosInPrm, sizeInPrm, colorInPrm, typeInPrm, useGradientInPrm, gradientColor1InPrm, gradientColor2InPrm, rotationAngleInPrm, strokeColorInPrm) {
    this.xPos = xPosInPrm;
    this.yPos = yPosInPrm;
    this.size = sizeInPrm;
    this.shapeColor = colorInPrm;
    this.shapeType = typeInPrm;
    this.useGradient = useGradientInPrm;
    this.gradientColor1 = gradientColor1InPrm;
    this.gradientColor2 = gradientColor2InPrm;
    this.rotationAngle = rotationAngleInPrm;
    this.strokeColor = strokeColorInPrm;
  }
  
  draw() {
    let savedX = this.xPos;
    let savedY = this.yPos;
    
    stroke(this.strokeColor);
    strokeWeight(2);
    
    if (this.shapeType == 0) {
      if (this.useGradient == true) {
        noStroke();
        let steps = 20;
        for (let i = steps; i > 0; i = i - 1) {
          let t = i / steps;
          let r1 = red(this.gradientColor1);
          let g1 = green(this.gradientColor1);
          let b1 = blue(this.gradientColor1);
          let r2 = red(this.gradientColor2);
          let g2 = green(this.gradientColor2);
          let b2 = blue(this.gradientColor2);
          let r = r1 + (r2 - r1) * (1 - t);
          let g = g1 + (g2 - g1) * (1 - t);
          let b = b1 + (b2 - b1) * (1 - t);
          fill(r, g, b);
          ellipse(this.xPos, this.yPos, this.size * t, this.size * t);
        }
      } else {
        fill(this.shapeColor);
        ellipse(this.xPos, this.yPos, this.size, this.size);
      }
    } else if (this.shapeType == 1) {
      let angle = this.rotationAngle * 3.14159 / 180;
      let x1 = this.xPos + cos(angle) * (-this.size / 2) - sin(angle) * (-this.size / 2);
      let y1 = this.yPos + sin(angle) * (-this.size / 2) + cos(angle) * (-this.size / 2);
      let x2 = this.xPos + cos(angle) * (this.size / 2) - sin(angle) * (-this.size / 2);
      let y2 = this.yPos + sin(angle) * (this.size / 2) + cos(angle) * (-this.size / 2);
      let x3 = this.xPos + cos(angle) * (this.size / 2) - sin(angle) * (this.size / 2);
      let y3 = this.yPos + sin(angle) * (this.size / 2) + cos(angle) * (this.size / 2);
      let x4 = this.xPos + cos(angle) * (-this.size / 2) - sin(angle) * (this.size / 2);
      let y4 = this.yPos + sin(angle) * (-this.size / 2) + cos(angle) * (this.size / 2);
      
      if (this.useGradient == true) {
        noStroke();
        let steps = 20;
        for (let i = 0; i < steps; i = i + 1) {
          let t = i / steps;
          let r1 = red(this.gradientColor1);
          let g1 = green(this.gradientColor1);
          let b1 = blue(this.gradientColor1);
          let r2 = red(this.gradientColor2);
          let g2 = green(this.gradientColor2);
          let b2 = blue(this.gradientColor2);
          let r = r1 + (r2 - r1) * t;
          let g = g1 + (g2 - g1) * t;
          let b = b1 + (b2 - b1) * t;
          fill(r, g, b);
          let yOffset = (this.size * t) / steps;
          quad(x1, y1 + i * yOffset, x2, y2 + i * yOffset, x2, y2 + (i + 1) * yOffset, x1, y1 + (i + 1) * yOffset);
        }
      } else {
        fill(this.shapeColor);
        quad(x1, y1, x2, y2, x3, y3, x4, y4);
      }
    } else if (this.shapeType == 2) {
      let angle = this.rotationAngle * 3.14159 / 180;
      let tx1 = 0;
      let ty1 = -this.size / 2;
      let tx2 = -this.size / 2;
      let ty2 = this.size / 2;
      let tx3 = this.size / 2;
      let ty3 = this.size / 2;
      
      let rx1 = this.xPos + cos(angle) * tx1 - sin(angle) * ty1;
      let ry1 = this.yPos + sin(angle) * tx1 + cos(angle) * ty1;
      let rx2 = this.xPos + cos(angle) * tx2 - sin(angle) * ty2;
      let ry2 = this.yPos + sin(angle) * tx2 + cos(angle) * ty2;
      let rx3 = this.xPos + cos(angle) * tx3 - sin(angle) * ty3;
      let ry3 = this.yPos + sin(angle) * tx3 + cos(angle) * ty3;
      
      fill(this.shapeColor);
      triangle(rx1, ry1, rx2, ry2, rx3, ry3);
    } else if (this.shapeType == 3) {
      strokeWeight(5);
      let angle = this.rotationAngle * 3.14159 / 180;
      let endX = this.xPos + cos(angle) * this.size;
      let endY = this.yPos + sin(angle) * this.size;
      
      if (this.useGradient == true) {
        let steps = 20;
        for (let i = 0; i < steps; i = i + 1) {
          let t = i / steps;
          let r1 = red(this.gradientColor1);
          let g1 = green(this.gradientColor1);
          let b1 = blue(this.gradientColor1);
          let r2 = red(this.gradientColor2);
          let g2 = green(this.gradientColor2);
          let b2 = blue(this.gradientColor2);
          let r = r1 + (r2 - r1) * t;
          let g = g1 + (g2 - g1) * t;
          let b = b1 + (b2 - b1) * t;
          stroke(r, g, b);
          let x1 = this.xPos + (endX - this.xPos) * t;
          let y1 = this.yPos + (endY - this.yPos) * t;
          let x2 = this.xPos + (endX - this.xPos) * (t + 1 / steps);
          let y2 = this.yPos + (endY - this.yPos) * (t + 1 / steps);
          line(x1, y1, x2, y2);
        }
      } else {
        stroke(this.strokeColor);
        line(this.xPos, this.yPos, endX, endY);
      }
    }
  }
}

class MatrixCharacter {
  
  constructor(xInPrm, yInPrm, speedInPrm) {
    this.x = xInPrm;
    this.y = yInPrm;
    this.speed = speedInPrm;
    this.char = this.getRandomChar();
  }
  
  getRandomChar() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    let index = int(random(chars.length));
    return chars.charAt(index);
  }
  
  update() {
    this.y = this.y + this.speed;
    
    if (this.y > height) {
      this.y = random(-200, 0);
      this.x = random(width);
    }
    
    if (random(1) < 0.05) {
      this.char = this.getRandomChar();
    }
  }
  
  draw() {
    fill(0, 255, 0, fadeAlpha * 0.8);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text(this.char, this.x, this.y);
  }
}