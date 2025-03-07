let words = [];
let lines = [];
let xOffsets = [];
let speed = 1.2;
let rectHeight = 100;
let txt;
let numLines = 3;
let spacing = 10; 



function setup() {
  
    // Make sure the container exists before adding the canvas
  let container = document.getElementById("canvas-wrapper");
  if (!container) {
    console.error("Canvas container not found!");
    return;
  }
  
  let canvas = createCanvas(800, 400);
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
  button.size(canvas.width/10,canvas.height/10)
  button.style('margin-top', '-50px');
  
  document.getElementById('p5-container').appendChild(button.elt);
}

function draw() {
 
  noStroke();
  textSize(20);
  fill(0)
  rect(0, height / 2 - rectHeight / 2, width, rectHeight);
  fill(255)
  
  
  // linhas
  for (let i = 0; i < numLines; i++) {
    drawLineOfWords(lines[i], xOffsets[i], height / 2 + (i - (numLines - 1) / 2) * (rectHeight / numLines)+5); 
    xOffsets[i] -= speed; 

    // Reseta depois que sai, melhorar depois
    if (xOffsets[i] < -getLineWidth(lines[i])) {
      //xOffsets[i] = 0; 
      xOffsets[i] = img.width; 
    }
  }
  stroke("#FF5722");
  strokeWeight(5);
  line(width/2, 260, width/2, 200);
  image(img, 0, 15, width, height, 0, 0, img.width, img.height);
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
