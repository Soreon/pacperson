/* eslint-disable no-unused-expressions */
/* eslint-disable no-bitwise */

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const spaceBetweenDoubleLineInPixel = 8;
const doubleLineColor = '#1a1aae';
const doubleLineThickness = 3;
const dotColor = '#ec9445';
const canvasMarginInPixel = 20;
const widthSubdivision = 21;
const heightSubdivision = 27;
const maxSubdivision = Math.max(widthSubdivision, heightSubdivision);
const gridWidthInPixel = canvas.clientWidth - (2 * canvasMarginInPixel);
const gridHeightInPixel = canvas.clientHeight - (2 * canvasMarginInPixel);
const cellWidthInPixel = (gridWidthInPixel / maxSubdivision) | 0;
const cellHeightInPixel = (gridHeightInPixel / maxSubdivision) | 0;

let marginLeft = 0;
let marginTop = 0;

if (maxSubdivision === widthSubdivision) {
  const origCellHeightInPixel = (gridHeightInPixel / heightSubdivision) | 0;
  marginTop = (origCellHeightInPixel - cellHeightInPixel) * heightSubdivision / 2;
}

if (maxSubdivision === heightSubdivision) {
  const origCellWidthInPixel = (gridWidthInPixel / widthSubdivision) | 0;
  marginLeft = (origCellWidthInPixel - cellWidthInPixel) * widthSubdivision / 2;
}


const defaultGridData = ` ╔═════════╦═════════╗
                          ║•••••••••║•••••••••║
                          ║•╔═╗•╔═╗•║•╔═╗•╔═╗•║
                          ║●║░║•║░║•║•║░║•║░║●║
                          ║•╚═╝•╚═╝•╨•╚═╝•╚═╝•║
                          ║•••••••••••••••••••║
                          ║•╔═╗•╥•╔═══╗•╥•╔═╗•║
                          ║•╚═╝•║•╚═╦═╝•║•╚═╝•║
                          ║•••••║•••║•••║•••••║
                          ╚═══╗•╠═╡•╨•╞═╣•╔═══╝
                          ░░░░║•║░░░░░░░║•║░░░░
                          ░░░░║•║░╔═══╗░║•║░░░░
                          ════╝•╨░║░░░║░╨•╚════
                          ░░░░░•░░║░░░║░░•░░░░░
                          ════╗•╥░╚═══╝░╥•╔════
                          ░░░░║•║░░░░░░░║•║░░░░
                          ░░░░║•║░╔═══╗░║•║░░░░
                          ╔═══╝•╨░╚═╦═╝░╨•╚═══╗
                          ║•••••••••║•••••••••║
                          ║•╞═╗•╞═╡•╨•╞═╡•╔═╡•║
                          ║●••║•••••••••••║••●║
                          ╠═╗•║•╥•╔═══╗•╥•║•╔═╣
                          ╠═╝•╨•║•╚═╦═╝•║•╨•╚═╣
                          ║•••••║•••║•••║•••••║
                          ║•╞═══╩═╡•╨•╞═╩═══╡•║
                          ║•••••••••••••••••••║
                          ╚═══════════════════╝`;
const gameGrid = new Array(widthSubdivision * heightSubdivision);
gameGrid.fill(false);

if (window.devicePixelRatio) {
  // get current size of the canvas
  let rect = canvas.getBoundingClientRect();

  // increase the actual size of our canvas
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;

  // ensure all drawing operations are scaled
  context.scale(window.devicePixelRatio, window.devicePixelRatio);

  // scale everything down using CSS
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}

function loadGrid(str) {
  if (str.length === 0) return;
  const data = str.replace(/\s/g, '');
  gameGrid.fill(false);
  for (let i = 0; i < Math.min(gameGrid.length, data.length); i += 1) {
      if (data[i]) gameGrid[i] = data[i];
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLine(ctx, ax, ay, bx, by, color, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawHDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawVDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.stroke();
}

function drawHLSDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawVTSDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y);
  ctx.stroke();
}

function drawHRSDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawVBSDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.stroke();
}

function drawTLCDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawTRCDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.stroke();
}

function drawBLCDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.stroke();
}

function drawBRCDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x, y + halfCellHeight - halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawTBDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.stroke();
}

function drawTTDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth - halfSpace, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + halfCellWidth + halfSpace, y);
  ctx.stroke();
}

function drawTLDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x, y + halfCellHeight - halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawTRDoubleLine(ctx, x, y) {
  const halfSpace = (spaceBetweenDoubleLineInPixel / 2 ) | 0;
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;

  ctx.strokeStyle = doubleLineColor;
  ctx.lineWidth = doubleLineThickness;

  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth - halfSpace, y);
  ctx.lineTo(x + halfCellWidth - halfSpace, y + cellHeightInPixel);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight - halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight - halfSpace);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + halfCellWidth + halfSpace, y + cellHeightInPixel);
  ctx.lineTo(x + halfCellWidth + halfSpace, y + halfCellHeight + halfSpace);
  ctx.lineTo(x + cellWidthInPixel, y + halfCellHeight + halfSpace);
  ctx.stroke();
}

function drawDot(ctx, x, y) {
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(x + halfCellWidth, y + halfCellHeight, 4, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBigDot(ctx, x, y) {
  const halfCellWidth = (cellWidthInPixel / 2 ) | 0;
  const halfCellHeight = (cellHeightInPixel / 2 ) | 0;
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(x + halfCellWidth, y + halfCellHeight, 8, 0, 2 * Math.PI);
  ctx.fill();
}

function drawGrid() {
  // for (let i = 0; i <= widthSubdivision; i += 1) {
  //   drawLine(context, cellWidthInPixel * i, 0, cellWidthInPixel * i, cellHeightInPixel * heightSubdivision, '#222', 1);
  // }
  // for (let i = 0; i <= heightSubdivision; i += 1) {
  //   drawLine(context, 0, cellHeightInPixel * i, cellWidthInPixel * widthSubdivision, cellHeightInPixel * i, '#222', 1);
  // }

  // Parcourir chaque élément du tableau de booléens
  for (let i = 0; i < gameGrid.length; i += 1) {
    // Calculer les coordonnées x et y de l'élément courant
    const x = i % widthSubdivision;
    const y = (i / widthSubdivision) | 0;

    // Calculer les coordonnées du coin supérieur gauche du carré
    const startX = x * cellWidthInPixel;
    const startY = y * cellHeightInPixel;

    // Si l'élément courant est vrai, dessiner un carré
    switch (gameGrid[i]) {
      case '═':
        drawHDoubleLine(context, startX, startY)
        break;
      case '║':
        drawVDoubleLine(context, startX, startY)
        break;
      case '╡':
        drawHLSDoubleLine(context, startX, startY)
        break;
      case '╨':
        drawVTSDoubleLine(context, startX, startY)
        break;
      case '╞':
        drawHRSDoubleLine(context, startX, startY)
        break;
      case '╥':
        drawVBSDoubleLine(context, startX, startY)
        break;
      case '╔':
        drawTLCDoubleLine(context, startX, startY)
        break;
      case '╗':
        drawTRCDoubleLine(context, startX, startY)
        break;
      case '╚':
        drawBLCDoubleLine(context, startX, startY)
        break;
      case '╝':
        drawBRCDoubleLine(context, startX, startY)
        break;
      case '╩':
        drawTTDoubleLine(context, startX, startY)
        break;
      case '╠':
        drawTRDoubleLine(context, startX, startY)
        break;
      case '╦':
        drawTBDoubleLine(context, startX, startY)
        break;
      case '╣':
        drawTLDoubleLine(context, startX, startY)
        break;
      case '•':
        drawDot(context, startX, startY)
        break;
      case '●':
        drawBigDot(context, startX, startY)
        break;
    
      default:
        break;
    }
  }
}

function draw() {
  clearCanvas();
  drawGrid();
  requestAnimationFrame(draw);
}

context.translate(canvasMarginInPixel + marginLeft, canvasMarginInPixel + marginTop);
loadGrid(defaultGridData);
draw();
