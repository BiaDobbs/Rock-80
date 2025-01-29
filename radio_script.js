let words = [];
let lines = [];
let xOffsets = [];
let speed = 1.6;
let rectHeight = 100;
let txt;
let numLines = 4;
let spacing = 20; 



function setup() {
  let canvas = createCanvas(windowWidth-20, 400);
  canvas.elt.id = "p5-canvas";
  document.getElementById('p5-container').appendChild(canvas.elt);
  
  // RiTa Concordance Parameters
  var params = {
    ignoreStopWords: true,
    ignoreCase: true,
    ignorePunctuation: true,
  };

  // RiTa Concordance
  count = RiTa.concordance(txt.join(" "), params);
  words = Object.keys(count);

  // Sorting words by count
  words.sort((a, b) => count[b] - count[a]);

  // Distribui as palavras nas linhas
  let maxWordsPerLine = Math.floor((width - 40) / 100); 
  let wordsPerLine = Math.ceil(words.length / numLines); 

  for (let i = 0; i < numLines; i++) {
    lines[i] = words.slice(i * wordsPerLine, (i + 1) * wordsPerLine); 
  }

  // posição inicial das linhas
  for (let i = 0; i < numLines; i++) {
    //xOffsets[i] = width;
    xOffsets[i] = 20;
  }
  
  
  button = createButton("▶");
  button.mousePressed(togglePlaying);
  button.style('background-color', '#FF5722');
  button.style('border', 'none');
  button.style('font-size', '20px');
  button.style('cursor', 'pointer');
  button.style('position', 'absolute'); 

  // Append the button to the p5-container div
  document.getElementById('p5-container').appendChild(button.elt);

 positionButton();
}

function draw() {
  background(255);
  textSize(20);
  stroke(0);
  text("FM", 20, 140);
  text("AM", 20, 280);
  textSize(14);
  rect(0, height / 2 - rectHeight / 2, width, rectHeight);
  
  noStroke();
  // linhas
  for (let i = 0; i < numLines; i++) {
    drawLineOfWords(lines[i], xOffsets[i], height / 2 + (i - (numLines - 1) / 2) * (rectHeight / numLines)); 
    xOffsets[i] -= speed; 

    // Reseta depois que sai, melhorar depois
    if (xOffsets[i] < -getLineWidth(lines[i])) {
      //xOffsets[i] = 0; 
      xOffsets[i] = width; 
    }
  }
  stroke("red");
  line(width/2, 260, width/2, 200);
}

function drawLineOfWords(words, x, y) {
  let xStart = x;

  // Desenha as palavras
  for (let word of words) {
    text(word, xStart, y);
    xStart += textWidth(word) + spacing; // Para não ter overlap
  }
}

// tamanho das linhas
function getLineWidth(words) {
  let totalWidth = 1;
  for (let word of words) {
    totalWidth += textWidth(word) + spacing;
  }
  return totalWidth;
}

// controla o audio
function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
    button.html(" ❚❚ ");
  } else {
    song.pause();
    button.html(" ▶ ");
  }

}
function positionButton() {
  let canvasRect = canvas.elt.getBoundingClientRect(); // Get canvas position
  let btnWidth = canvasRect.width / 10;
  let btnHeight = canvasRect.height / 10;

  button.size(btnWidth, btnHeight);
  
  // Position the button at the bottom center of the canvas
  button.style('left', `${canvasRect.left + (canvasRect.width / 2) - (btnWidth / 2)}px`);
  button.style('top', `${canvasRect.top + canvasRect.height - (btnHeight * 1.5)}px`);
}

function windowResized() {
  resizeCanvas(windowWidth-20, 400);
  positionButton();
}
