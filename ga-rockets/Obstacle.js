function Obstacle(x, y, width, height) {
  this.location = createVector(x, y);
  this.width = width;
  this.height = height;

  const self = this;

  this.clash = function (position) {
    const x = self.location.x - self.width / 2;
    const y = self.location.y - self.height / 2;
    return position.x > x && position.x < x + self.width &&
      position.y > y && position.y < y + height;
  };

  this.display = function () {
    fill(140, 140);
    stroke(0);
    rectMode(CENTER);
    rect(self.location.x, self.location.y, self.width, self.height);
  };
}