function Spot(grid, col, row) {
  this.grid = grid;
  this.col = col || 0;
  this.row = row || 0;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.isObstacle = random(1) < 0.36;

  this.show = function () {
    fill(0);
    noStroke();
    const w = this.grid.width;
    const h = this.grid.height;
    const x = this.col * w + w / 2;
    const y = this.row * h + h / 2;
    ellipse(x, y, w / 2, h / 2);

    stroke(0);
    rectMode(CORNERS);
    for (let i = 0; i < this.neighbors.length; ++i) {
      const n = this.neighbors[i];
      if (n.col !== this.col && n.row !== this.row || !n.isObstacle)
        continue;

      const nx = n.col * w + w / 2;
      const ny = n.row * h + h / 2;
      rect(x, y, nx, ny);
    }
  };

  this.findNeighbors = function (path) {
    const i = this.col;
    const j = this.row;
    const n = this.neighbors;

    if (i > 0)             n.push(path[i - 1][j]);
    if (j < path.rows - 1) n.push(path[i][j + 1]);
    if (i < path.cols - 1) n.push(path[i + 1][j]);
    if (j > 0)             n.push(path[i][j - 1]);

    if (i > 0 && j < path.rows - 1)             n.push(path[i - 1][j + 1]);
    if (i < path.cols - 1 && j < path.rows - 1) n.push(path[i + 1][j + 1]);
    if (i < path.cols - 1 && j > 0)             n.push(path[i + 1][j - 1]);
    if (i > 0 && j > 0)                         n.push(path[i - 1][j - 1]);
  };

  this.heuristic = function () {
    //const distance = dist(this.col, this.row, this.grid.end.col, this.grid.end.row);
    const distance = abs(this.col - this.grid.end.col) + abs(this.row - this.grid.end.row);
    return distance;
  }
}
