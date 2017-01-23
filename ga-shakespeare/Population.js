function Population(size, mutationRate) {
  this.size = size;
  this.mutationRate = mutationRate;
  this.genes = [];
  this.charset = "";
  this.goal = "";

  // The population's stats.
  this.generation = 0;
  this.totalFitness = undefined;
  this.averageFitness = undefined;
  this.fittest = undefined;

  // Age property that updates itself when it's called.
  // Visible for JSON.stringify function.
  this.age = 0;
  let _age = 0;
  Object.defineProperty(this, 'age', {
    get: function () {
      self.age = _age = timer.get();
      return _age;
    }
  });

  // This function is invoked once the population has finished.
  this.onFinished = null;

  const self = this;
  const timer = new Stopwatch({ delay: 100 });

  const randomString = function (length) {
    let string = "";
    // Generate a random string from the population's charset.
    for (let i = 0; i < length; ++i)
      string += self.charset.charAt(floor(random(self.charset.length)));
    return string;
  };

  const pickParent = function () {
    // Each DNA has the same probability of being
    // picked if all of them have a fitness of 0.
    if (self.totalFitness === 0)
      return random(self.genes);

    // First generate a random number between 0 and 1.
    const percent = random(1);
    let cumulativeProbability = 0.0;
    for (let i = 0; i < self.genes.length; ++i) {
      // Calculate the relative fitness of the element.
      self.genes[i].relativeFitness = self.genes[i].fitness / self.totalFitness;
      // Add the fitness to the cumulation.
      cumulativeProbability += self.genes[i].relativeFitness;
      // Pick this DNA if the cumulative probability
      // is larger than the picked random number.
      // This is more likely to happen if it is higher.
      if (percent <= cumulativeProbability)
        return self.genes[i];
    }

    // Return a random DNA if the above loop
    // didn't succeed for whatever reason.
    return random(self.genes);
  };

  this.start = function () { timer.start(); };
  this.stop = function () { timer.stop(); };

  this.finished = function (func) {
    this.onFinished = func;
  };

  this.hasFinished = function () {
    return self.fittest && self.fittest.dna === self.goal;
  };

  this.generate = function () {
    // STEP 1 - Generate a new population with random DNA.
    for (let i = 0; i < self.size; ++i) {
      const string = randomString(self.goal.length);
      const dna = new DNA(string);
      self.genes.push(dna);
    }
  };

  this.populate = function () {
    // Reset everything.
    self.totalFitness = 0;
    self.averageFitness = 0;
    self.fittest = null;
    ++self.generation;

    // STEP 2 - Evaluate the fitness of each DNA.
    for (let i = 0; i < self.genes.length; ++i) {
      // Calculate the fitness of the current DNA.
      const dna = self.genes[i];
      self.totalFitness += dna.calculateFitness(self.goal);

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

      // c) Mutate the child's DNA based on a given probability.
      child.mutate(self.mutationRate, self.charset);

      // d) Add the child to the new generation array.
      newGeneration.push(child);
    }

    // STEP 4 - Replace the old population with the new population.
    self.genes = newGeneration;

    // Calculate the average fitness of the current generation.
    self.averageFitness = self.totalFitness / self.genes.length / self.goal.length * 100;

    // Invoke the onFinished function.
    if (self.hasFinished() && self.onFinished && typeof self.onFinished === 'function')
      self.onFinished();
  };
}
