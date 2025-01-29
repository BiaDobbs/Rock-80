let words = [];
let lines = [];
let xOffsets = [];
let speed = 1.6;
let rectHeight = 100;
let txt;
let numLines = 4;
let spacing = 20; 



function setup() {
  let canvas = createCanvas(windowWidth, 400);
  canvas.elt.id = "p5-canvas"; // Give the canvas an ID (optional)
  document.getElementById('p5-container').appendChild(canvas.elt); // Manually move it

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
