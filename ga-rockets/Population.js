function Population(origin, targetObstacle, size, lifetime) {
  this.size = size;
  this.mutationRate = 0.01;
  this.origin = origin;
  this.targetObstacle = targetObstacle;
  this.lifetime = lifetime;
  this.genes = [];

  // The population's stats.
  this.generation = 0;
  this.totalFitness = undefined;
  this.averageFitness = undefined;
  this.fittest = undefined;
  this.cycleCount = 0;

  const self = this;

  const pickParent = function () {
    // Each DNA has the same probability of being
    // picked if all of them have a fitness of 0.
    if (self.totalFitness === 0)
      return random(self.genes);

    // First generate a random number between 0 and 1.
    const percent = random(1);
    let cumulativeProbability = 0.0;
    for (let i = 0; i < self.genes.length; ++i) {
      const dna = self.genes[i];
      // A dead DNA cannot be a parent.
      if (dna.isDead())
        continue;

      // Calculate the relative fitness of the element.
      dna.relativeFitness = dna.fitness / self.totalFitness;
      // Add the fitness to the cumulation.
      cumulativeProbability += dna.relativeFitness;

      // Pick this DNA if the cumulative probability
      // is larger than the picked random number.
      // This is more likely to happen if it is higher.
      if (percent <= cumulativeProbability)
        return dna;
    }

    // Return a random DNA if the above loop
    // didn't succeed for some reason.
    return random(self.genes);
  };

  this.generate = function () {
    // STEP 1 - Generate a new population with random DNA.
    for (let i = 0; i < self.size; ++i) {
      const dna = new DNA(self.origin, self.lifetime);
      self.genes.push(dna);
    }
  };

  this.cycle = function () {
    if (self.cycleCount >= self.lifetime)
      return false;

    // Loop through all genes and apply the its
    // force of the current cycle to its host.
    for (let i = 0; i < self.genes.length; ++i) {
      const dna = self.genes[i];
      // Do not update this dna if it's dead
      // or if it has reached the target.
      if (dna.isDead() || dna.hasReached()) {
        dna.host.display();
        continue;
      }

      // Check if the DNA's host has hit the target.
      if (targetObstacle.clash(dna.host.location)) {
        dna.reached();
        continue;
      }

      // Kill DNA that leaves the window.
      if (dna.host.location.x < 0 || dna.host.location.x > width ||
          dna.host.location.y < 0 || dna.host.location.y > height) {
        dna.kill();
        continue;
      }

      // Add a new random vector if one is missing for some reason,
      // for example because of resizing the population in the console.
      while (self.cycleCount >= dna.genes.length) {
        const vector = p5.Vector.fromAngle(random(TWO_PI));
        vector.mult(random(dna.host.maxforce));
        dna.genes.push(vector);
      }
      // Get the force of the current cycle.
      const force = dna.genes[self.cycleCount];

      // Apply the force and update the DNA's host.
      dna.host.applyForce(force);
      dna.host.run(false, false);
    }

    ++self.cycleCount;
    return true;
  };

  this.populate = function () {
    // Reset everything.
    self.totalFitness = 0;
    self.averageFitness = 0;
    self.fittest = null;
    self.cycleCount = 0;
    ++self.generation;

    // STEP 2 - Evaluate the fitness of each DNA.
    for (let i = 0; i < self.genes.length; ++i) {
      const dna = self.genes[i];
      // Do not calculate fitness of DNA that is dead.
      if (dna.isDead())
        continue;

      // Calculate the fitness of the current DNA.
      self.totalFitness += dna.calculateFitness(self.targetObstacle);

      // Update the fittest DNA.
      if (!self.fittest || dna.fitness > self.fittest.fitness)
        self.fittest = dna;
    }

    // Create an array that holds a
    // new generation of this population.
    const newGeneration = [];

    // STEP 3 - Populate a new generation.
    for (let n = 0; n < self.size; ++n) {
      // a) Pick two parents.
      const parentA = pickParent();
      const parentB = pickParent();

      // b) Crossover the parents' DNA to create a child.
      const child = parentA.crossover(parentB);
      child.host.location = self.origin.copy();

      // c) Mutate the child's DNA based on a given probability.
      child.mutate(self.mutationRate);

      // d) Add the child to the new generation array.
      newGeneration.push(child);
    }

    // STEP 4 - Replace the old population with the new population.
    self.genes = newGeneration;

    // Calculate the average fitness of the current generation.
    self.averageFitness = self.totalFitness / self.genes.length * 100;
  };

  this.displayTarget = function () {
    self.targetObstacle.display();
  };
}