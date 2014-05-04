Game.Math = {

  timestamp: function() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  },

  bound: function(x, min, max) {
    return Math.max(min, Math.min(max, x));
  },

  between: function(x, from, to) {
    return (is.valid(x) && (from <= x) && (x <= to));
  },

  wrap: function(n, min, max) {
    while(n < min)
      n = n + max;
    while(n >= max)
      n = n - max;
    return n;
  },

  overlap: function(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(((x1 + w1) <= x2) ||
             ((x2 + w2) <= x1) ||
             ((y1 + h1) <= y2) ||
             ((y2 + h2) <= y1))
  },

  brighten: function(hex, percent) {

    var a = Math.round(255 * percent/100),
        r = a + parseInt(hex.substr(1, 2), 16),
        g = a + parseInt(hex.substr(3, 2), 16),
        b = a + parseInt(hex.substr(5, 2), 16);

    r = r<255?(r<1?0:r):255;
    g = g<255?(g<1?0:g):255;
    b = b<255?(b<1?0:b):255;

    return '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1);
  },

  darken: function(hex, percent) {
    return this.brighten(hex, -percent);
  },

  random: function(min, max) {
    return (min + (Math.random() * (max - min)));
  },

  randomInt: function(min, max) {
    return Math.round(Game.Math.random(min, max));
  },

  randomChoice: function(choices) {
    return choices[Math.round(Game.Math.random(0, choices.length-1))];
  },

  randomBool: function() {
    return Game.Math.randomChoice([true, false]);
  }

};
