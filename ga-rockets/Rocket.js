function Rocket(location) {
  this.location = location && typeof location.copy === 'function' ? location.copy() : location;
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.radius = 4;
  this.maxforce = 0.05;
  this.maxspeed = 4;

  const self = this;

  this.run = function (edges, bounce) {
    if (edges)
      self.edges(bounce);
    self.update();
    self.display();
  };

  this.seek = function (destination, apply) {
    const desired = p5.Vector.sub(destination, self.location);
    desired.normalize();
    desired.mult(self.maxspeed);

    const steering = p5.Vector.sub(desired, self.velocity);
    steering.limit(self.maxforce);

    if (apply)
      self.applyForce(steering.mult(Number(apply)));
    return steering;
  };

  this.applyForce = function (force) {
    force.limit(self.maxforce);
    self.acceleration.add(force);
  };

  this.update = function () {
    self.velocity.add(self.acceleration);
    self.velocity.limit(self.maxspeed);
    self.location.add(self.velocity);
    self.acceleration.mult(0);
  };

  this.edges = function (bounce) {
    const radius = self.radius + 1;
    if (self.location.x - radius < 0){
      self.location.x = radius;
      if (bounce) self.velocity.x *= -1;
    }
    if (self.location.x > width - radius) {
      self.location.x = width - radius
      if (bounce) self.velocity.x *= -1;
    }
    if (self.location.y - radius < 0) {
      self.location.y = radius
      if (bounce) self.velocity.y *= -1;
    }
    if (self.location.y > height - radius) {
      self.location.y = height - radius;
      if (bounce) self.velocity.y *= -1;
    }
  };

  this.display = function () {
    /*/// Ellipse
    fill(180);
    stroke(0);
    strokeWeight(1);
    const diameter = self.radius * 2;
    ellipse(self.location.x, self.location.y, diameter, diameter)
    /**/

    /**/// Arrow
    fill(180);
    stroke(100);
    const diameter = self.radius * 2;

    push();
    translate(self.location.x, self.location.y);
    rotate(self.velocity.heading() + PI / 2);

    beginShape(TRIANGLES);
    vertex(0, -diameter);
    vertex(self.radius, diameter);
    vertex(-self.radius, diameter);
    endShape();
    pop();
    /**/
  };
}