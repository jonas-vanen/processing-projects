function Snake(x, y) {
  this.tail = [];
  this.position = createVector(x || 0, y || 0);

  const origin = this.position.copy();
  const previous = this.position.copy();
  const direction = createVector();

  let lost = false;
  let onLose = undefined;
  let scale = 10;

  // Set the position of the snake.
  this.setPos = (x, y) => this.position.set(x, y);
  // Set the direction of the snake.
  this.setDir = (x, y) => direction.set(x, y);
  // Set the scale of the game.
  this.setScale = function (scl) {
    scale = scl;
    return scale;
  };
  this.randomize = function () {
    // Randomize the snake's position.
    const col = floor(random(floor(width / scale)));
    const row = floor(random(floor(height / scale)));
    this.position.set(col * scale + origin.x, row * scale + origin.y);
    previous.set(this.position.x, this.position.y);

    // Choose randomly if the snake moves on the x- or y-axis
    // and choose the direction according to where it is.
    // E.g. if it is in the left half of the window and it is
    // going to move on the x-axis it will move to the right.
    const moveX = random(1) < 0.5;
    const dirx = moveX ? (col < scale / 2 ? 1 : -1) : 0;
    const diry = moveX ? 0 : (row < scale / 2 ? 1 : -1);
    direction.set(dirx, diry);

    // Randomize the snakes direction.
    //const dirx = moveX ? (random(1) < 0.5 ? 1 : -1) : 0;
    //const diry = moveX ? 0 : (random(1) < 0.5 ? 1 : -1);
  };

  // Check if the player has lost the game
  this.hasLost = () => lost;
  // Set an event listener for the case the the play loses the game.
  this.onLose = (func) => onLose = func;
  // Lose the game.
  this.lose = () => {
    lost = true;
    // Invoke the onLose event listener function.
    if (typeof onLose === 'function')
      onLose();
  };

  // Restart the game.
  this.restart = function () {
    lost = false;
    this.randomize();
    this.tail = [];
  };

  // Make the snake's tail one node longer.
  this.extend = function () {
    const node = this.position.copy();
    this.tail.push(node);
  };

  // Check if the snake can eat a food item.
  this.eat = function (food, y) {
    // Pretend that an x and a y value were passed
    // if the argument list's length is larger than 1.
    if (arguments.length > 1)
      food = {x: food, y: y};

    // Check if the food vector is inside the the snake.
    return food.x >= this.position.x && food.x < this.position.x + scale &&
      food.y >= this.position.y && food.y < this.position.y + scale;
  };

  // Update the position of the snake and its tail.
  this.update = function () {
    // Future x and y locations.
    const nx = this.position.x + direction.x * scale;
    const ny = this.position.y + direction.y * scale;

    // The player loses if the snake is outside the window
    if (nx < origin.x || nx > width - origin.x - scale ||
        ny < origin.y || ny > height - origin.y - scale) {
      this.lose();
      return;
    }

    // If the user drives into the first tail node, lose.
    if (this.tail.length > 0 && previous.x === nx && previous.y === ny) {
      this.lose();
      return;
    }

    // Update the previous position.
    previous.set(this.position.x, this.position.y);

    // Update the position of the snake.
    this.position.set(nx, ny);

    if (this.tail.length < 1)
      return;

    // Update the positions of the first tail node to
    // the previous position of the snake.
    let prev = this.tail[0].copy();
    this.tail[0] = previous.copy();

    for (let i = 1; i < this.tail.length; ++i) {
      // If the user drives into a tail's node, lose.
      if (prev.equals(this.position)) {
        this.lose();
        return;
      }

      // Update the positions of the tail nodes to
      // the positions of the node that was added earlier.
      const temp = this.tail[i].copy();
      this.tail[i] = prev;
      prev = temp;
    }
  };

  this.collide = function (snake) {
    // If the snake is inside the other snake's head, lose.
    if (this.position.equals(snake.position)) {
      this.lose();
      return;
    }

    // Check each tail node of the other snake.
    for (let i = 0; i < snake.tail.length; ++i) {
      // If the snake is inside this tail node, lose.
      if (this.position.equals(snake.tail[i].pos)) {
        this.lose();
        return;
      }
    }
  };

  this.display = function () {
    // Change color mode to HSB.
    colorMode(HSB, 100);
    fill(16, 100, 100);
    stroke(100, 100, 100);
    rect(this.position.x, this.position.y, scale, scale);

    // Display each tail node.
    for (let i = 0; i < this.tail.length; ++i) {
      // Calculate the hue based on the tail number
      const hue = (i + 17) % 101;
      fill(hue, 100, 100);
      // Invert the stroke.
      stroke(100 - hue, 100, 100);

      rect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    // Reset color mode.
    colorMode(RGB);
  };
}