const opts = {
  DEBUG: false,
  scale: 20,
  increment: 0.1,
  zstep: 0.01,
  particles: 500
};

const vectors = [];
const particles = [];
let zoff = 0;
let rows, cols

function setup() {
  createCanvas(800, 800);
  setInterval(() => document.getElementById('fps').innerHTML = parseInt(getFrameRate()), 500);

  cols = width / opts.scale + 1;
  rows = height / opts.scale + 1;

  for (let i = 0; i < opts.particles; ++i) {
    particles[i] = new Particle();
    particles[i].pos.set(random(width), random(height));
  }
  background(255);
}

function draw() {
  background(255);
  stroke(0, 60);

  let xoff = zoff;
  for (let x = 0; x < rows; ++x) {
    let yoff = 0;
    for (let y = 0; y < cols; ++y) {
      const i = x + y * cols;
      const n = noise(xoff, yoff);
      const a = noise(xoff, yoff) * TWO_PI * 2;
      const v = vectors[i] = p5.Vector.fromAngle(a);
      const sx = x * opts.scale, sy = y * opts.scale;
      //line(sx, sy, sx + v.x * opts.scale, sy + v.y * opts.scale);
      yoff += opts.increment;
    }
    xoff += opts.increment;
  }
  zoff += opts.zstep;

  for (let i = 0; i < particles.length; ++i) {
    const p = particles[i];
    const row = floor(p.pos.x / opts.scale) + 1;
    const col = floor(p.pos.y / opts.scale) + 1;

    const index = row + col * cols;
    const v = vectors[index];
    if (v === undefined)
      continue;

    particles[i].applyForce(v);
    particles[i].update();
    particles[i].edges();
    particles[i].display();

    if (opts.DEBUG) {
      const x = row * opts.scale;
      const y = col * opts.scale;
      fill(0, 255, 0);
      stroke(255, 0, 0);
      line(x, y, x + v.x * opts.scale, y + v.y * opts.scale);
      ellipse(p.pos.x, p.pos.y, 4, 4);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    opts.DEBUG = !opts.DEBUG;
  }
}