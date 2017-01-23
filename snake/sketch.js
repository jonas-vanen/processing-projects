let snake;
const foodItems = [];
const options = {
  width: 600,
  height: 600,
  border: 5,
  scale: 12,
  speed: 0.18,
  food: 4,
  paused: false
};

function setup() {
  // Create the canvas and regulate the framerate
  // according to the scale of the game and the wanted speed.
  createCanvas(options.width - options.border * 2, options.height - options.border * 2);
  frameRate(floor(800 / options.scale * options.speed));

  // Create a new snake and set its scale.
  snake = new Snake(options.border, options.border);
  snake.onLose(() => console.log('Game Over!'));
  snake.setScale(options.scale);
  snake.randomize();

  for (let i = 0; i < options.food; ++i) {
    // Generate a food vector at a random location.
    foodItems[i] = generateFood();
    // Repick a location if the food item
    // was generated inside the snake.
    if (snake.eat(foodItems[i]))
      --i;
  }
}

function draw() {
  background(51);

  // Draw the food items.
  fill(20, 120, 100);
  noStroke();
  for (let i = foodItems.length - 1; i >= 0; --i) {
    if (snake.eat(foodItems[i])) {
      // If the snake has eaten the food (because it was inside it),
      // increase the length of its tail and generate a new food item.
      snake.extend();
      foodItems[i] = generateFood();
    }
    rect(foodItems[i].x, foodItems[i].y, options.scale, options.scale);
  }

  // Update and display the snake
  if (!options.paused && !snake.hasLost())
    snake.update();
  snake.display();
}

function generateFood() {
  const col = floor(random(floor(width / options.scale)));
  const row = floor(random(floor(height / options.scale)));
  return createVector(col * options.scale + options.border, row * options.scale + options.border);
}

function keyPressed() {
  // Restart the game when the player hits enter.
  if (keyCode === ENTER) {
    snake.restart();
    return
  }

  // Pause the game when the player hits the space bar or 'P'.
  if (key === ' ' || key === 'P') {
    options.paused = !options.paused
    return;
  }

  // Do not listen to controls if the play has lost.
  if (options.paused || snake.hasLost())
    return;

  // Update the snakes location when the
  // player presses one of the arrow keys.
  switch (keyCode) {
    case UP_ARROW: snake.setDir(0, -1); break;
    case RIGHT_ARROW: snake.setDir(1, 0); break;
    case DOWN_ARROW: snake.setDir(0, 1); break;
    case LEFT_ARROW: snake.setDir(-1, 0); break;
  }
}