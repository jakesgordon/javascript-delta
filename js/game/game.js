var Game = {

  //-----------------------------------------------------------------------------------------------

  run: function(options) {

    var now,
        dt       = 0,
        last     = Game.Math.timestamp(),
        step     = 1/options.fps,
        update   = options.update,
        render   = options.render,
        fpsmeter = Game.fpsmeter(options.fpsmeter);

    function frame() {
      fpsmeter.tickStart();
      now = Game.Math.timestamp();
      dt = dt + Math.min(1, (now - last) / 1000);
      while(dt > step) {
        dt = dt - step;
        update(step);
      }
      render(dt);
      last = now;
      fpsmeter.tick();
      requestAnimationFrame(frame, options.canvas);
    }

    frame();
  },

  //-----------------------------------------------------------------------------------------------

  fpsmeter: function(options) {
    if (options)
      return new FPSMeter(options.anchor ? $(options.anchor) : document.body, options);
    else
      return { tickStart: function() { }, tick: function() { } };
  },

  //-----------------------------------------------------------------------------------------------

  storage: function() {
    return this.localStorage = this.localStorage || window.localStorage || {};
  },

  //-----------------------------------------------------------------------------------------------

  animate: function(entity) {
    if (!entity.anim)
      entity.anim = { frame: 0, n: 0 }
    entity.anim.n = entity.anim.n + 1;
    if (entity.anim.n >= 60/entity.sprite.fps) {
      entity.anim.n = 0;
      entity.anim.frame = entity.anim.frame + 1;
      if (entity.anim.frame >= entity.sprite.frames.length) {
        entity.anim.frame = 0;
        return true;
      }
    }
  },

  //-----------------------------------------------------------------------------------------------

  Load: {

    resources: function(images, sounds, callback) {

      images = images || [];
      sounds = sounds || [];

      var n, image, sound,
          done      = false,
          count     = images.length + sounds.length,
          resources = { images: {}, sounds: {} },
          loaded    = function() { if (!done) { done = true; callback(resources); } },
          onload    = function() { if (--count == 0) loaded(); };

      if (count == 0) {
        callback(resources);
      }
      else {
        for(n = 0 ; n < images.length ; n++) {
          image = is.string(images[n]) ? { id: images[n], url: images[n] } : images[n];
          resources.images[image.id] = $({ tag: 'img' });
          resources.images[image.id].on('load', onload);
          resources.images[image.id].src = image.url;
        }
        for(n = 0 ; n < sounds.length ; n++) {
          sound = is.string(sounds[n]) ? { id: sounds[n], name: sounds[n] } : sounds[n];
          resources.sounds[sound.id] = AudioFX(sound.name, sound, onload);
        }
        setTimeout(loaded, 5000); // need a timeout because HTML5 audio canplay event is VERY VERY FLAKEY (especially on slow connections)
      }
    },

    json: function(url, callback) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if ((request.readyState == 4) && (request.status == 200))
          callback(JSON.parse(request.responseText));
      };
      request.open("GET", url, true);
      request.send();
    }

  }

  //-----------------------------------------------------------------------------------------------

};
