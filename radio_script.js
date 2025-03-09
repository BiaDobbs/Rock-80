let words = [];
let lines = [];
let xOffsets = [];
let speed = 1.2;
let rectHeight = 120;
let txt;
let numLines = 3;
let spacing = 20;
let baseWidth = 800;
let scaleFactor;
let buttonX, buttonY, buttonW, buttonH;
let isPlaying = false;

function setup() {
  // Ensure the canvas exists to avoid errors
  let container = document.getElementById("canvas-wrapper");
  if (!container) {
    console.error("Canvas container not found!");
    return;
  }

  // aspect ratio 
  imgAspectRatio = img.width / img.height;

  let canvasWidth = windowWidth;
  let canvasHeight = canvasWidth / imgAspectRatio;

  if (canvasHeight > windowHeight * 0.8) {
    canvasHeight = windowHeight * 0.8;
    canvasWidth = canvasHeight * imgAspectRatio;
  }

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.elt.id = "p5-canvas";
  document.getElementById("p5-container").appendChild(canvas.elt);

  scaleFactor = width / baseWidth;

  // RiTa Concordance Parameters
  var params = {
    ignoreStopWords: true,
    ignoreCase: true,
    ignorePunctuation: true,
  };

  count = RiTa.concordance(txt.join(" "), params);
  words = Object.keys(count);
  words.sort((a, b) => count[b] - count[a]);

  // Distribute words into lines
  let wordsPerLine = Math.ceil(words.length / numLines);
  for (let i = 0; i < numLines; i++) {
    lines[i] = words.slice(i * wordsPerLine, (i + 1) * wordsPerLine);
  }

  // Initialize the offsets (starting positions of each line)
  for (let i = 0; i < numLines; i++) {
    xOffsets[i] = width-200* scaleFactor; // Start lines off-screen to the right
  }
}

function draw() {
  background(255);
  scaleFactor = width / baseWidth;

  noStroke();
  textSize(20 * scaleFactor);
  fill(0);
  rect(
    0,
    height / 2.4 - (rectHeight * scaleFactor) / 2,
    width,
    rectHeight * scaleFactor
  );
  fill(255);

  // Draw the lines of text and move them left
  for (let i = 0; i < numLines; i++) {
    drawLineOfWords(
      lines[i],
      xOffsets[i],
      height / 2.28 + (i - (numLines - 1) / 2) * (rectHeight / (numLines * 1.5)) * scaleFactor
    );

    // Move the line to the left
    xOffsets[i] -= speed * scaleFactor;

    // If the line goes completely off-screen to the left, reset its position to the right
    if (xOffsets[i] + getLineWidth(lines[i]) < 0) {
      xOffsets[i] = width;
    }
  }

  stroke("#FF5722");
  strokeWeight(5 * scaleFactor);
  line(width / 2, 200 * scaleFactor, width / 2, 120 * scaleFactor);

  let aspectRatio = img.width / img.height;
  let targetWidth = width;
  let targetHeight = width / aspectRatio;

  if (targetHeight > height) {
    targetHeight = height;
    targetWidth = height * aspectRatio;
  }

  image(img, 0, 0, width, height);

  // Custom button inside canvas
  drawCanvasButton();
}

function drawLineOfWords(words, x, y) {
  let xStart = x;

  // Draw the words
  for (let word of words) {
    text(word, xStart, y);
    xStart += textWidth(word) + spacing * scaleFactor + 10; // Add space between words
  }
}

// Calculate the width of the text line
function getLineWidth(words) {
  let totalWidth = 0;
  for (let word of words) {
    totalWidth += textWidth(word) + spacing * scaleFactor;
  }
  return totalWidth;
}

// Custom button inside canvas
function drawCanvasButton() {
  buttonW = 32 * scaleFactor;
  buttonH = 32 * scaleFactor;
  buttonX = width / 1.4 - buttonW / 2;
  buttonY = height - buttonH - 34 * scaleFactor;

  blendMode(MULTIPLY);
  fill(isPlaying ? "#FF5722":"#686464" );
  //noFill()
  noStroke();
  rect(buttonX, buttonY, buttonW/2, buttonH, 1 * scaleFactor);
  fill(isPlaying ? "#686464" : "#FF5722");
  rect(buttonX+buttonW/2, buttonY, buttonW/2, buttonH, 1 * scaleFactor);
  blendMode(BLEND);

  //fill(255);
  //textSize(25 * scaleFactor);
  //textAlign(CENTER, CENTER);
  //text(isPlaying ? "❚❚" : "▶", buttonX + buttonW / 2, buttonY + buttonH / 2);
}

// Detect button press
function mousePressed() {
  if (
    mouseX > buttonX &&
    mouseX < buttonX + buttonW &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonH
  ) {
    togglePlaying();
  }
}

// Control audio playback
function togglePlaying() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    song.loop();
  } else {
    song.pause();
  }
}

function windowResized() {
  let newCanvasWidth = windowWidth;
  let newCanvasHeight = newCanvasWidth / imgAspectRatio;

  if (newCanvasHeight > windowHeight * 0.8) {
    newCanvasHeight = windowHeight * 0.8;
    newCanvasWidth = newCanvasHeight * imgAspectRatio;
  }

  resizeCanvas(newCanvasWidth, newCanvasHeight);
  scaleFactor = width / baseWidth;
}
