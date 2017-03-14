function Grid(options) {
  this.cols = options.cols || 10;
  this.rows = options.rows || 10;
  this.path = [];
  this.openSet = [];
  this.closedSet = [];
  this.start = undefined;
  this.end = undefined;

  const self = this;

  // Initialize the grid with spots.
  for (let i = 0; i < this.cols; ++i) {
    this[i] = [];
    for (let j = 0; j < this.rows; ++j) {
      this[i][j] = new Spot(this, i, j);
    }
  }
  // Compute the neighbors of each spot.
  for (let i = 0; i < this.cols; ++i) {
    for (let j = 0; j < this.rows; ++j) {
      this[i][j].findNeighbors(this);
    }
  }
  this.width = this.cols === 0 ? 0 : width / this.cols;
  this.height = this.rows === 0 ? 0 : height / this.rows;

  this.show = function () {
    // Draw the obstacles as spheres.
    for (let i = 0; i < this.cols; ++i) {
      for (let j = 0; j < this.rows; ++j) {
        fill(255);
        const spot = this[i][j];
        if (spot.isObstacle)
          spot.show();
      }
    }

    // Draw the path as a continuous thick line.
    noFill();
    stroke(255, 0, 100);
    strokeWeight(this.width / 2);
    beginShape();
    for (let i = 0; i < grid.path.length; ++i) {
      const p = grid.path[i];
      const w = this.width;
      const h = this.height;
      vertex(p.col * w + w / 2, p.row * h + h / 2);
    }
    endShape();
  };

  const normalize = function (col, row) { return typeof col === 'object' ? col : self[col][row]; };
  this.open = function (col, row) { this.openSet.push(normalize(col, row)); };
  this.close = function (col, row) { this.closedSet.push(normalize(col, row)); };
}
