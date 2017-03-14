function DNA(location, lifetime, genes) {
  this.host = new Rocket(location);
  this.host.maxforce = 0.5;
  this.host.maxspeed = 4;

  this.lifetime = lifetime;
  this.genes = genes;
  this.fitness = undefined;
  this.dead = false;
  this.reachedTarget = false;

  const self = this;

  if (arguments.length < 3) {
    this.genes = [];
    for (let i = 0; i < this.lifetime; ++i) {
      this.genes[i] = p5.Vector.fromAngle(random(TWO_PI));
      this.genes[i].mult(random(this.host.maxforce));
    }
  }

  this.reached = function () { this.reachedTarget = true; }
  this.kill = function () { this.dead = true; };

  this.hasReached = function () { return this.reachedTarget; };
  this.isDead = function () { return this.dead; };

  this.calculateFitness = function (targetObstacle) {
    let distance = self.host.location.dist(targetObstacle.location);
    // We don't want distance to be less than 1, otherwise
    // fitness will be greater than one (out of percent range).
    if (distance < 1)
      distance = 1;

    // The smaller the distance is, the greater fitness will be.
    self.fitness = 1 / distance;

    // Award DNA whose host has reached the target with double fitness!
    if (this.reachedTarget)
      self.fitness *= 2;

    return self.fitness;
  };

  this.crossover = function (parent) {
    const newGenes = [];
    for (let i = 0; i < self.genes.length && i < parent.genes.length; ++i) {
      const ownGene = random(1) < 0.5;
      newGenes[i] = ownGene ? self.genes[i] : parent.genes[i];
    }
    return new DNA(null, self.lifetime, newGenes);

    /*const newGenes = [];
    // Split the string at a random index.
    const middle = floor(random(self.genes.length));
    for (let i = 0; i < self.genes.length && i < parent.genes.length; ++i)
      newGenes.push(i > middle ? self.genes[i] : parent.genes[i]);
    return new DNA(null, self.lifetime, newGenes);*/
  };

  this.mutate = function (mutationRate) {
    for (let i = 0; i < self.genes.length; ++i)
      if (random(1) < mutationRate)
        // Create a new random vector to simulate mutation.
        self.genes[i] = p5.Vector.fromAngle(random(TWO_PI));
  };
}