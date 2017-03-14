let snakes = [];
const snakeCount = 2;

const foodItems = [];
const options = {
  width: 600,
  height: 600,
  border: 5,
  scale: 12,
  speed: 0.24,
  food: 10,
  paused: false
};

options.width += options.border * 2;
options.height += options.border * 2;

function setup() {
  // Create the canvas and regulate the framerate
  // according to the scale of the game and the wanted speed.
  createCanvas(options.width, options.height);
  frameRate(floor(800 / options.scale * options.speed));

  // Create a new snake and set its scale.
  for (let i = 0; i < snakeCount; ++i) {
    snakes[i] = new Snake(options.border, options.border);
    snakes[i].onLose(() => console.log('Game Over!'));
    snakes[i].setScale(options.scale);
    snakes[i].randomize();

    for (let j = 0; j < options.food; ++j) {
      // Generate a food vector at a random location.
      foodItems[j] = generateFood();
      // Repick a location if the food item
      // was generated inside the snake.
      if (snakes[i].eat(foodItems[j]))
        --j;
    }
  }
}

function draw() {
  background(51);

  // Draw the food items.
  fill(20, 120, 100);
  noStroke();
  for (let j = foodItems.length - 1; j >= 0; --j) {
    rect(foodItems[j].x, foodItems[j].y, options.scale, options.scale);
  }

  for (let i = 0; i < snakes.length; ++i) {
    for (let j = foodItems.length - 1; j >= 0; --j) {
      if (snakes[i].eat(foodItems[j])) {
        // If the snake has eaten the food (because it was inside it),
        // increase the length of its tail and generate a new food item.
        snakes[i].extend();
        foodItems[j] = generateFood();
      }
    }

    for (let j = i + 1; j < snakes.length; ++j)
      if (snakes[i].collide(snakes[j]))
        snakes[i].kill();
    
    // Update and display the snake
    if (!options.paused && !snakes[i].hasLost())
      snakes[i].update();
    snakes[i].display();
  }
}

function generateFood() {
  let x, y, isInTail;
  do {
    isInTail = false;

    // Generate a random position on the game's field.
    const col = floor(random(floor((width - options.border * 2) / options.scale)));
    const row = floor(random(floor((height - options.border * 2) / options.scale)));
    x = col * options.scale + options.border;
    y = row * options.scale + options.border;

    for (let i = 0; i < snakes.length; ++i) {
      // Repick a location if the food item would be generated inside the snake.
      if (snakes[i].eat(x, y))
        break;

      // Loop through each tail's node and check if the food would be inside it.
      for (let j = 0; j < snakes[i].tail.length; ++j) {
        if (x >= snakes[i].tail[j].x && x < snakes[i].tail[j].x + scale &&
            y >= snakes[i].tail[j].y && y < snakes[i].tail[j].y + scale) {
          isInTail = true;
          break;
        }
      }
    }
  } while (isInTail);

  return createVector(x, y);
}

const controls = {
  0: {
    up: 38,
    right: 39,
    down: 40,
    left: 37
  },
  1: {
    up: 'W'.charCodeAt(0),
    right: 'D'.charCodeAt(0),
    down: 'S'.charCodeAt(0),
    left: 'A'.charCodeAt(0)
  }
};
function keyPressed() {
  // Restart the game when the player hits enter.
  if (keyCode === ENTER) {
    for (let i = 0; i < snakes.length; ++i)
      snakes[i].restart();
    return
  }

  // Pause the game when the player hits the space bar or 'P'.
  if (key === ' ' || key === 'P') {
    options.paused = !options.paused
    return;
  }

  for (let i = 0; i < snakes.length; ++i) {
    // Do not listen to controls if the play has lost.
    if (options.paused || snakes[i].hasLost())
      continue;

    // If there are no controls for this snake there
    // won't be any for the following snakes, so break here.
    if (i >= controls.length)
      break;

    // Update the snakes location when the
    // player presses one of the arrow keys.
    switch (keyCode) {
      case controls[i].up: snakes[i].setDir(0, -1); break;
      case controls[i].right: snakes[i].setDir(1, 0); break;
      case controls[i].down: snakes[i].setDir(0, 1); break;
      case controls[i].left: snakes[i].setDir(-1, 0); break;
    }
  }
}
