function Stopwatch(delay) {
  let offset, clock, interval;
  delay = delay || 1;

  const delta = function () {
    const now = Date.now(),
      d = now - offset;
    offset = now;
    return d;
  };

  const update = function () {
    clock += delta();
  };

  this.start = function () {
    if (!interval) {
      offset = Date.now();
      interval = setInterval(update, delay);
    }
    return this;
  };

  this.stop = function () {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    return this;
  };

  this.reset = function () {
    clock = 0;
    return this;
  };

  this.get = function () {
    return clock;
  };

  this.reset();
  return this;
};