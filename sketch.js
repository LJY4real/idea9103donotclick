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

let hueOffset = 0;

let mondrianBlocks = [];
let mondrianUpdateTimer = 0;

let clockNumbers = [];

let pixelationLevel = 1;
let isReversing = false;
let reverseStartTime = 0;
let pixelatedImg = null;
let lastPixelationLevel = 1;

let poeticTexts = [
  "Time is fluid...",
  "Reality bends...",
  "Wake up...",
  "The persistence of memory",
  "Follow the white rabbit"
];
let currentTextIndex = 0;
let textAlpha = 0;
let textFadeTimer = 0;

let glitchTexts = [];
let instructionTexts = [];

function preload() {
  backgroundImg = loadImage('libraries/The_Persistence_of_Memory.jpg');
}

function setup() {
  createCanvas(800, 600);
  
  clockCenterX = 200;
  clockCenterY = height / 2;
  
  hourAngle = -90;
  minuteAngle = -90;
  secondAngle = -90;
  
  mondrianBlocks = [];
  generateMondrianBlocks();
  
  for (let i = 1; i <= 12; i = i + 1) {
    clockNumbers.push(new ClockNumber(i));
  }
  
  glitchTexts = [];
  for (let i = 0; i < poeticTexts.length; i = i + 1) {
    glitchTexts.push(new GlitchText(poeticTexts[i]));
  }
  
  instructionTexts.push(new GlitchText("Click mouse: Start/Stop rotation"));
  instructionTexts.push(new GlitchText("Press SPACE: Reset everything"));
  instructionTexts.push(new GlitchText("Press 1: Toggle magnifier ON/OFF"));
  instructionTexts.push(new GlitchText("Magnifier: "));
  
  matrixChars = [];
  for (let i = 0; i < 80; i = i + 1) {
    let matrixChar = new MatrixCharacter(random(width), random(-500, 0), random(2, 5), random(150, 255));
    matrixChars.push(matrixChar);
  }
}

function draw() {
  if (isRotating) {
    let currentTime = millis();
    let timeElapsed = (currentTime - startTime) / 1000;
    
    if (isReversing == false && timeElapsed >= 30) {
      isReversing = true;
      reverseStartTime = millis();
    }
    
    if (isReversing == true) {
      let reverseElapsed = (millis() - reverseStartTime) / 1000;
      timeElapsed = 30 - reverseElapsed;
      if (timeElapsed <= 0) {
        isReversing = false;
        startTime = millis();
        timeElapsed = 0;
        shapesCleared = false;
        fadeAlpha = 255;
        pixelationLevel = 1;
        rotationSpeed = 6;
      }
    }
    
    if (timeElapsed >= 10 && shapesCleared == false) {
      shapesCleared = true;
      magnifierActive = true;
    }
    
    if (timeElapsed >= 10 && timeElapsed < 30) {
      fadeAlpha = 255 - ((timeElapsed - 10) / 20) * 255;
      pixelationLevel = 1 + int((timeElapsed - 10) / 4);
    } else if (timeElapsed >= 30) {
      fadeAlpha = 0;
    } else {
      fadeAlpha = 255;
      pixelationLevel = 1;
    }
    
    hueOffset = hueOffset + 2;
    if (hueOffset > 360) {
      hueOffset = 0;
    }
    
    mondrianUpdateTimer = mondrianUpdateTimer + 1;
    if (mondrianUpdateTimer > 60 && shapesCleared == false) {
      mondrianBlocks = [];
      generateMondrianBlocks();
      mondrianUpdateTimer = 0;
    }
    
    textFadeTimer = textFadeTimer + 1;
    if (textFadeTimer > 180) {
      currentTextIndex = (currentTextIndex + 1) % poeticTexts.length;
      textFadeTimer = 0;
    }
    
    if (textFadeTimer < 60) {
      textAlpha = (textFadeTimer / 60) * 255;
    } else if (textFadeTimer > 120) {
      textAlpha = ((180 - textFadeTimer) / 60) * 255;
    } else {
      textAlpha = 255;
    }
  }
  
  if (shapesCleared == true) {
    if (backgroundImg) {
      if (pixelationLevel > 1) {
        if (pixelationLevel != lastPixelationLevel) {
          pixelatedImg = createPixelatedImage(backgroundImg, pixelationLevel * 8);
          lastPixelationLevel = pixelationLevel;
        }
        if (pixelatedImg) {
          image(pixelatedImg, 0, 0, width, height);
        }
      } else {
        image(backgroundImg, 0, 0, width, height);
      }
    } else {
      background(150, 200, 255);
    }
  } else {
    background(220);
    drawMondrianBackground();
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
    
    let currentTime = millis();
    let timeElapsed = (currentTime - startTime) / 1000;
    let distortionFactor = 0;
    
    if (timeElapsed > 5) {
      distortionFactor = (timeElapsed - 5) / 5;
      distortionFactor = min(distortionFactor, 1);
    }
    
    let distortion = (rotationSpeed / 50) * distortionFactor;
    let radiusX = clockRadius * 2 + distortion * 80;
    let radiusY = clockRadius * 2 - distortion * 60;
    
    let waveOffset = sin(millis() / 200) * distortion * 15;
    
    ellipse(clockCenterX + waveOffset, clockCenterY, radiusX, radiusY);
    
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    
    for (let i = 1; i <= 12; i = i + 1) {
      let angle = i * 30 - 90;
      let angleRad = angle * 3.14159 / 180;
      let distFromMouse = dist(mouseX, mouseY, clockCenterX, clockCenterY);
      let pushFactor = max(0, 1 - distFromMouse / 200);
      let offset = pushFactor * 15;
      
      let warpX = cos(millis() / 300 + i) * distortion * 10;
      let warpY = sin(millis() / 300 + i) * distortion * 10;
      
      let x = clockCenterX + cos(angleRad) * (clockRadius * 0.75 + offset) + warpX + waveOffset;
      let y = clockCenterY + sin(angleRad) * (clockRadius * 0.75 + offset) + warpY;
      fill(0);
      text(i, x, y);
    }
    
    fill(0);
    ellipse(clockCenterX + waveOffset, clockCenterY, 10, 10);
  } else if (fadeAlpha > 0) {
    fill(255, fadeAlpha);
    stroke(0, fadeAlpha);
    strokeWeight(3);
    
    let distortion = rotationSpeed / 50;
    let radiusX = clockRadius * 2 + distortion * 80;
    let radiusY = clockRadius * 2 - distortion * 60;
    
    let waveOffset = sin(millis() / 200) * distortion * 15;
    
    ellipse(clockCenterX + waveOffset, clockCenterY, radiusX, radiusY);
    
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    
    for (let i = 0; i < clockNumbers.length; i = i + 1) {
      let number = clockNumbers[i];
      number.update();
      let angle = number.position * 30 - 90;
      let angleRad = angle * 3.14159 / 180;
      
      let warpX = cos(millis() / 300 + number.position) * distortion * 10;
      let warpY = sin(millis() / 300 + number.position) * distortion * 10;
      
      let x = clockCenterX + cos(angleRad) * (clockRadius * 0.75) + warpX + waveOffset;
      let y = clockCenterY + sin(angleRad) * (clockRadius * 0.75) + warpY;
      fill(0, 255, 0, fadeAlpha);
      text(number.displayChar, x, y);
    }
    
    fill(0, fadeAlpha);
    ellipse(clockCenterX + waveOffset, clockCenterY, 10, 10);
  }
  
  if (isRotating == true) {
    rotationSpeed = rotationSpeed + 0.05;
    
    secondAngle = secondAngle + rotationSpeed;
    minuteAngle = minuteAngle + rotationSpeed / 60;
    hourAngle = hourAngle + rotationSpeed / 720;
  }
  
  let hourColor = getColorFromHue(hueOffset);
  let minuteColor = getColorFromHue(hueOffset + 120);
  let secondColor = getColorFromHue(hueOffset + 240);
  
  drawClockHand(hourAngle, clockRadius * 0.4, 8, color(red(hourColor), green(hourColor), blue(hourColor), fadeAlpha));
  drawClockHand(minuteAngle, clockRadius * 0.6, 5, color(red(minuteColor), green(minuteColor), blue(minuteColor), fadeAlpha));
  drawClockHand(secondAngle, clockRadius * 0.8, 2, color(red(secondColor), green(secondColor), blue(secondColor), fadeAlpha));
  
  for (let i = 0; i < instructionTexts.length; i = i + 1) {
    instructionTexts[i].update();
  }
  
  fill(0, 255, 0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text(instructionTexts[0].displayText, 450, 50);
  text(instructionTexts[1].displayText, 450, 80);
  if (shapesCleared == true) {
    text(instructionTexts[2].displayText, 450, 110);
    text(instructionTexts[3].displayText + (magnifierActive ? "ON" : "OFF"), 450, 140);
  }
  
  if (magnifierActive == true && shapesCleared == true && backgroundImg) {
    drawMagnifier();
  }
  
  if (isRotating == true && shapesCleared == false) {
    glitchTexts[currentTextIndex].update();
    fill(0, 255, 0, textAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text(glitchTexts[currentTextIndex].displayText, width / 2, height - 50);
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

function getColorFromHue(hue) {
  let h = hue;
  while (h >= 360) {
    h = h - 360;
  }
  while (h < 0) {
    h = h + 360;
  }
  
  let r = 0;
  let g = 0;
  let b = 0;
  
  if (h < 60) {
    r = 255;
    g = (h / 60) * 255;
    b = 0;
  } else if (h < 120) {
    r = ((120 - h) / 60) * 255;
    g = 255;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = 255;
    b = ((h - 120) / 60) * 255;
  } else if (h < 240) {
    r = 0;
    g = ((240 - h) / 60) * 255;
    b = 255;
  } else if (h < 300) {
    r = ((h - 240) / 60) * 255;
    g = 0;
    b = 255;
  } else {
    r = 255;
    g = 0;
    b = ((360 - h) / 60) * 255;
  }
  
  return color(r, g, b);
}

function drawMondrianBackground() {
  for (const block of mondrianBlocks) {
    stroke(0);
    strokeWeight(6);
    fill(block.r, block.g, block.b);
    rect(block.x, block.y, block.w, block.h);
  }
}

function generateMondrianBlocks() {
  let colors = [
    {r: 255, g: 0, b: 0},
    {r: 255, g: 220, b: 0},
    {r: 0, g: 80, b: 180},
    {r: 255, g: 255, b: 255},
    {r: 255, g: 255, b: 255}
  ];
  
  let numBlocks = 10 + int(random(8));
  
  for (let i = 0; i < numBlocks; i = i + 1) {
    let blockW = random(80, 250);
    let blockH = random(80, 250);
    let blockX = random(0, width - blockW);
    let blockY = random(0, height - blockH);
    
    let colorIndex = int(random(colors.length));
    let selectedColor = colors[colorIndex];
    
    let block = {
      x: blockX,
      y: blockY,
      w: blockW,
      h: blockH,
      r: selectedColor.r,
      g: selectedColor.g,
      b: selectedColor.b
    };
    
    mondrianBlocks.push(block);
  }
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
    shapesCleared = false;
    hourAngle = -90;
    minuteAngle = -90;
    secondAngle = -90;
    angleCheckpoint = -90;
    rotationSpeed = 6;
    startTime = 0;
    fadeAlpha = 255;
    magnifierActive = false;
    hueOffset = 0;
    mondrianUpdateTimer = 0;
    pixelationLevel = 1;
    isReversing = false;
    textAlpha = 0;
    textFadeTimer = 0;
    currentTextIndex = 0;
    pixelatedImg = null;
    lastPixelationLevel = 1;
    
    mondrianBlocks = [];
    generateMondrianBlocks();
    
    clockNumbers = [];
    for (let i = 1; i <= 12; i = i + 1) {
      clockNumbers.push(new ClockNumber(i));
    }
    
    glitchTexts = [];
    for (let i = 0; i < poeticTexts.length; i = i + 1) {
      glitchTexts.push(new GlitchText(poeticTexts[i]));
    }
    
    instructionTexts = [];
    instructionTexts.push(new GlitchText("Click mouse: Start/Stop rotation"));
    instructionTexts.push(new GlitchText("Press SPACE: Reset everything"));
    instructionTexts.push(new GlitchText("Press 1: Toggle magnifier ON/OFF"));
    instructionTexts.push(new GlitchText("Magnifier: "));
    
    matrixChars = [];
    for (let i = 0; i < 80; i = i + 1) {
      let matrixChar = new MatrixCharacter(random(width), random(-500, 0), random(2, 5), random(150, 255));
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

function createPixelatedImage(img, pixelSize) {
  let tempImg = createGraphics(width, height);
  let cols = int(width / pixelSize);
  let rows = int(height / pixelSize);
  
  tempImg.noStroke();
  for (let x = 0; x < cols; x = x + 1) {
    for (let y = 0; y < rows; y = y + 1) {
      let imgX = int((x / cols) * img.width);
      let imgY = int((y / rows) * img.height);
      let c = img.get(imgX, imgY);
      tempImg.fill(c);
      tempImg.rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
  return tempImg;
}

function drawMagnifier() {
  // Runtime guards: don't attempt to access image if it's not loaded or has invalid dimensions
  try {
    if (!backgroundImg) return;
    if (!backgroundImg.width || !backgroundImg.height) return;

    let srcCenterX = (mouseX / width) * backgroundImg.width;
    let srcCenterY = (mouseY / height) * backgroundImg.height;

    let srcSize = magnifierSize / magnifyScale;
    if (!(srcSize > 0)) return;

    let srcX = srcCenterX - srcSize / 2;
    let srcY = srcCenterY - srcSize / 2;

    srcX = max(0, min(srcX, backgroundImg.width - srcSize));
    srcY = max(0, min(srcY, backgroundImg.height - srcSize));

    // get() can throw if parameters are invalid; wrap to surface errors clearly
    let magnifiedImg = backgroundImg.get(srcX, srcY, srcSize, srcSize);

    imageMode(CENTER);
    image(magnifiedImg, mouseX, mouseY, magnifierSize, magnifierSize);
    imageMode(CORNER);
  } catch (err) {
    console.error('drawMagnifier error:', err);
    // rethrow so the page-level error overlay will show the stack trace
    throw err;
  }
}

class ClockNumber {
  
  constructor(positionInPrm) {
    this.position = positionInPrm;
    this.displayChar = this.getRandomChar();
    this.changeTimer = 0;
  }
  
  getRandomChar() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    let index = int(random(chars.length));
    return chars.charAt(index);
  }
  
  update() {
    this.changeTimer = this.changeTimer + 1;
    if (this.changeTimer > 15) {
      this.displayChar = this.getRandomChar();
      this.changeTimer = 0;
    }
  }
}

class GlitchText {
  
  constructor(originalTextInPrm) {
    this.originalText = originalTextInPrm;
    this.displayText = originalTextInPrm;
    this.glitchTimer = 0;
  }
  
  update() {
    this.glitchTimer = this.glitchTimer + 1;
    if (this.glitchTimer > 10) {
      if (random(1) < 0.3) {
        let newText = "";
        for (let i = 0; i < this.originalText.length; i = i + 1) {
          if (this.originalText.charAt(i) == " ") {
            newText = newText + " ";
          } else if (random(1) < 0.1) {
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
            let index = int(random(chars.length));
            newText = newText + chars.charAt(index);
          } else {
            newText = newText + this.originalText.charAt(i);
          }
        }
        this.displayText = newText;
      } else {
        this.displayText = this.originalText;
      }
      this.glitchTimer = 0;
    }
  }
}

class MatrixCharacter {
  
  constructor(xInPrm, yInPrm, speedInPrm, brightnessInPrm) {
    this.x = xInPrm;
    this.y = yInPrm;
    this.speed = speedInPrm;
    this.char = this.getRandomChar();
    this.brightness = brightnessInPrm;
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
    fill(0, this.brightness, 0, fadeAlpha * 0.8);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.char, this.x, this.y);
  }
}