function Particle() {
  this.pos = createVector();
  this.vel = createVector();
  this.acc = createVector();
  this.maxspeed = 5;

  this.update = function () {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.edges = function () {
    if (this.pos.x > width)  this.pos.x = 1;
    if (this.pos.x < 0)      this.pos.x = width - 1;
    if (this.pos.y > height) this.pos.y = 1;
    if (this.pos.y < 0)      this.pos.y = height - 1;
  };

  this.display = function () {
    stroke(0);
    fill(0);
    ellipse(this.pos.x, this.pos.y, 4, 4);
    stroke(0, 20);
    strokeWeight(1);
    point(this.pos.x, this.pos.y);
  };
}