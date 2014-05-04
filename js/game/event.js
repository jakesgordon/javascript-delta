Game.Event = {

  stop: function(ev) {
    ev.preventDefault();
    ev.cancelBubble = true;
    return false;
  },

  canvasPos: function(ev, canvas) {
    var bbox = canvas.getBoundingClientRect(),
           x = (ev.clientX - bbox.left) * (canvas.width / bbox.width),
           y = (ev.clientY - bbox.top)  * (canvas.height / bbox.height);
    return { x: x, y: y };
  },

  mouseWheelDelta: function(ev) {
    if (is.valid(ev.wheelDelta))
      return ev.wheelDelta/120;
    else if (is.valid(ev.detail))
      return -ev.detail/3;
    else
      return 0;
  }

};
