let population;
let origin, targetObstacle;
let obstacles = [];

const size = 100;
const lifetime = 500;
let fitnesses = '';
let averageFitnesses = '';

function setup() {
  createCanvas(1000, 640);
  setInterval(function () {
    document.getElementById('fps').innerHTML = parseInt(getFrameRate());
  }, 500);

  origin = createVector(width / 2, height - 16);
  targetObstacle = new Obstacle(width / 2, 32, 24, 24);

  obstacles.push(new Obstacle(width / 2, height * 9/16, 400, 8));
  obstacles.push(new Obstacle(width * 1/4, height / 3, 300, 8));
  obstacles.push(new Obstacle(width * 3/4, height / 3, 300, 8));

  /*origin = createVector(16, height / 2);
  targetObstacle = new Obstacle(width - 32, height / 2, 24, 24);

  // First row
  obstacles.push(new Obstacle(width * 0.2, height * 0.2, 8, height * 0.4));
  obstacles.push(new Obstacle(width * 0.2, height - height * 0.1 - 1, 8, height - height * 0.8));
  // Second row
  obstacles.push(new Obstacle(width * 0.39, height * 0.5, 8, height * 0.5));
  // Third row
  obstacles.push(new Obstacle(width * 0.6, height * 0.2, 8, height * 0.4));
  obstacles.push(new Obstacle(width * 0.56, height - height * 0.05 - 1, 8, height - height * 0.9));
  // Thick obstacle
  obstacles.push(new Obstacle(width * 0.8, height * 0.5, 40, 260));*/

  population = new Population(origin, targetObstacle, size, lifetime);
  population.generate();
}

function draw() {
  background(255);

  // Draw the origin.
  drawOrigin();
  // Draw the target.
  population.displayTarget();
  
  if (!population.cycle()) {
    population.populate();
    console.log(population.fittest);
    fitnesses += (population.fittest ? population.fittest.fitness : 0.0) + '\r\n';
    averageFitnesses += population.averageFitness + '\r\n';
    //console.log(fitnesses);
  }

  // Draw the obstacles and kill DNA that hits one.
  for (const i in obstacles) {
    obstacles[i].display();
    for (let j = 0; j < population.genes.length; ++j) {
      const dna = population.genes[j];
      if (obstacles[i].clash(dna.host.location)) {
        dna.kill();
      }
    }
  }

  // Draw an obstacle that is outlined with the mouse.
  drawObstacleOutlines();

  // Update the status text.
  fill(0);
  noStroke();
  text('Average fitness: ' + (population.averageFitness ? population.averageFitness : 0.000).toFixed(3) + '\n' +
    'Total fitness: ' + (population.totalFitness ? population.totalFitness : 0.000).toFixed(3) + '\n' + 
    'Mutation rate: ' + (population.mutationRate * 100) + '%\n' +
    'Cycles left: ' + (population.lifetime - population.cycleCount) + '\n' +
    'Generation: ' + population.generation, 10, 20);
}

let drawingOrigin = null;
let drawingEnd = null;
function mousePressed() {
  drawingOrigin = createVector(mouseX, mouseY);
  drawingEnd = createVector(mouseX, mouseY);
}

function mouseReleased() {
  let w = drawingEnd.x - drawingOrigin.x;
  let h = drawingEnd.y - drawingOrigin.y;

  if (w < 0) {
    drawingOrigin.x += w;
    w *= -1;
  }
  if (h < 0) {
    drawingOrigin.y += h;
    h *= -1;
  }

  obstacles.push(new Obstacle(drawingOrigin.x + w / 2, drawingOrigin.y + h / 2, w, h));
  drawingEnd = drawingOrigin = null;
}

function drawObstacleOutlines() {
  if (drawingOrigin && drawingEnd) {
    drawingEnd.set(mouseX, mouseY);
    const w = drawingEnd.x - drawingOrigin.x;
    const h = drawingEnd.y - drawingOrigin.y;

    fill(140, 100);
    stroke(0);
    rectMode(CORNER);
    rect(drawingOrigin.x, drawingOrigin.y, w, h);
  }
}

function drawOrigin() {
  stroke(0);
  fill(0, 255, 0);
  rectMode(CENTER);
  rect(origin.x, origin.y, 8, 8);
}
