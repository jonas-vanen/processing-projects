const replaceAt = function (str, index, char) {
  return str.substr(0, index) + char + str.substr(index + char.length);
};

function DNA(dna) {
  this.dna = dna;
  this.fitness = undefined;
  this.relativeFitness = undefined;

  const self = this;

  this.calculateFitness = function (goal) {
    let score = 0;
    // An element's fitness depends on the amount of
    // characters in its DNA that match with the goal string.
    for (let i = 0; i < self.dna.length && i < goal.length; ++i)
      if (self.dna[i] == goal[i])
        ++score;
    self.fitness = score / goal.length;
    self.fitness = pow(self.fitness, 3);
    return self.fitness;
  };

  this.crossover = function (parent) {
    let newDNA = "";
    // Split the string at a random index.
    const middle = floor(random(self.dna.length));
    for (let i = 0; i < self.dna.length && i < parent.dna.length; ++i)
      newDNA += i > middle ? self.dna[i] : parent.dna[i];
    return new DNA(newDNA);
  };

  this.mutate = function (mutationRate, charset) {
    for (let i = 0; i < this.dna.length; ++i) {
      if (random(1) < mutationRate) {
        // Pick a random character to simulate mutation.
        this.dna = replaceAt(this.dna, i, charset.charAt(floor(random(charset.length))));
      }
    }
  };
}