Game.Canvas = {

  create: function(width, height) {
    return this.init($({ tag: 'canvas'}), width, height);
  },

  init: function(canvas, width, height) {
    canvas = $(canvas);
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },

  render: function(width, height, render, canvas) { // http://kaioa.com/node/103
    canvas = canvas || this.create(width, height);
    render(canvas.getContext('2d'), width, height);
    return canvas;
  }

};
