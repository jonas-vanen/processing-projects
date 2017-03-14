let grid;

function setup() {
  createCanvas(600, 600);
  // Show FPS.
  setInterval(() => document.getElementById('fps').innerHTML = parseInt(getFrameRate()), 500);
  // Create a new grid.
  grid = new Grid({cols: 30, rows: 30});
  // Set the start to the top left and
  // the end to the bottom right of the grid.
  grid.start = grid[0][0];
  grid.end = grid[grid.cols - 1][grid.rows - 1];
  grid.start.isObstacle = grid.end.isObstacle = false;
  // Add the path's start to the openSet.
  grid.open(grid.start);
}

function draw() {
  if (grid.openSet.length > 0) {
    const openSet = grid.openSet;
    const closedSet = grid.closedSet;

    // openSet is not empty.
    let best = 0;
    for (let i = 1; i < openSet.length; ++i) {
      if (openSet[i].f < openSet[best].f) {
        best = i;
      }
    }

    const current = openSet[best];
    if (current === grid.end) {
      console.log('Path found!');
      noLoop();
    }

    // Clear the grid's path.
    grid.path = [];
    // Collect all previous locations in an array.
    let temp = current;
    grid.path.push(temp);
    while (temp.previous) {
      grid.path.push(temp.previous);
      temp = temp.previous;
    }

    // Remove the current spot from the open set.
    openSet.splice(best, 1);
    // Add it to the set of closed spots.
    closedSet.push(current);

    const neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];
      // Ignore the neighbor which is already evaluated.
      if (closedSet.includes(neighbor) || neighbor.isObstacle)
        continue;

      // Distance in the grid is always the same.
      const distance = 1;
      const testG = current.g + distance;
      if (!openSet.includes(neighbor))
        openSet.push(neighbor)
      else if (testG >= neighbor.g)
        // The path is longer.
        continue;

      neighbor.g = testG;
      neighbor.h = neighbor.heuristic();
      neighbor.f = neighbor.g + neighbor.h;

      neighbor.previous = current;
    }
  } else {
    console.log('No path found.');
    noLoop();
  }

  background(255);

  // Show the grid.
  grid.show();
}
