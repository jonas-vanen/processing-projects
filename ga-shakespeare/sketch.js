let population;
let html = {};

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy .,-_()?!=/$%&";
const goal = "To be or not to be.";
const words = 200;
const mutate = 0.01;

function setup() {
  noCanvas();
  html.bestPhrase = createP('');
  html.bestPhrase.class('best');

  html.status = createP('');
  html.status.class('stats');

  html.allPhrases = createP('');
  html.allPhrases.position(400, 150);
  html.allPhrases.class('all');

  // Create a new population
  population = new Population(words, mutate);
  population.charset = charset;
  population.goal = goal;

  // Generate new genes with random DNAs.
  population.generate();
  population.start();

  // Invoke this function when the population has finished.
  population.finished(function () {
    population.stop();
    noLoop();
    console.log(population);
  });
}

function draw() {
  // Populate a new generation.
  population.populate();

  // Update the status.
  const bestPhrase = population.fittest ? population.fittest.dna : '-';
  html.bestPhrase.html('Best phrase:<br />' + bestPhrase);

  let status = 'total generations: ' + population.generation + '<br />';
  status += 'average fitness: ' + parseInt(population.averageFitness) + '%<br />';
  status += 'total population: ' + population.genes.length + '<br />';
  status += 'mutation rate: ' + population.mutationRate * 100 + '%<br />';
  status += 'elapsed time: ' + (population.age / 1000).toFixed(1) + 's';
  html.status.html(status);

  let allPhrases = 'All phrases:<br />';
  for (let i = 0; i < population.genes.length; ++i)
    allPhrases += population.genes[i].dna + '<br />';
  html.allPhrases.html(allPhrases);
}
