//=============================================================================
// feature detection
//=============================================================================
ua = function() {

  var ua  = navigator.userAgent.toLowerCase(); // should avoid user agent sniffing... but sometimes you just gotta do what you gotta do
  var key =        ((ua.indexOf("opera")   > -1) ? "opera"   : null);
      key = key || ((ua.indexOf("firefox") > -1) ? "firefox" : null);
      key = key || ((ua.indexOf("chrome")  > -1) ? "chrome"  : null);
      key = key || ((ua.indexOf("safari")  > -1) ? "safari"  : null);
      key = key || ((ua.indexOf("msie")    > -1) ? "ie"      : null);

  try {
    var re      = (key == "ie") ? "msie ([\\d\\.]*)" : key + "\\/([\\d\\.]*)"
    var matches = ua.match(new RegExp(re, "i"));
    var version = matches ? matches[1] : null;
  } catch (e) {}

  return {
    full:    ua,
    name:    key + (version ? " " + version : ""),
    version: version,
    major:   version ? parseInt(version) : null,
    is: {
      firefox: (key == "firefox"),
      chrome:  (key == "chrome"),
      safari:  (key == "safari"),
      opera:   (key == "opera"),
      ie:      (key == "ie")
    }
  }
}();

//=============================================================================
// type detection
//=============================================================================

is = {
  'string':         function(obj) { return (typeof obj === 'string');                 },
  'number':         function(obj) { return (typeof obj === 'number');                 },
  'bool':           function(obj) { return (typeof obj === 'boolean');                },
  'array':          function(obj) { return (obj instanceof Array);                    },
  'undefined':      function(obj) { return (typeof obj === 'undefined');              },
  'func':           function(obj) { return (typeof obj === 'function');               },
  'null':           function(obj) { return (obj === null);                            },
  'notNull':        function(obj) { return (obj !== null);                            },
  'invalid':        function(obj) { return ( is['null'](obj) ||  is.undefined(obj));  },
  'valid':          function(obj) { return (!is['null'](obj) && !is.undefined(obj));  },
  'emptyString':    function(obj) { return (is.string(obj) && (obj.length == 0));     },
  'nonEmptyString': function(obj) { return (is.string(obj) && (obj.length > 0));      },
  'emptyArray':     function(obj) { return (is.array(obj) && (obj.length == 0));      },
  'nonEmptyArray':  function(obj) { return (is.array(obj) && (obj.length > 0));       },
  'document':       function(obj) { return (obj === document);                        }, 
  'window':         function(obj) { return (obj === window);                          },
  'element':        function(obj) { return (obj instanceof HTMLElement);              },
  'event':          function(obj) { return (obj instanceof Event);                    },
  'link':           function(obj) { return (is.element(obj) && (obj.tagName == 'A')); }
}

//=============================================================================
// type coersion
//=============================================================================

to = {
  'bool':   function(obj, def) { if (is.valid(obj)) return ((obj == 1) || (obj == true) || (obj == "1") || (obj == "y") || (obj == "Y") || (obj.toString().toLowerCase() == "true") || (obj.toString().toLowerCase() == 'yes')); else return (is.bool(def) ? def : false); },
  'number': function(obj, def) { if (is.valid(obj)) { var x = parseFloat(obj); if (!isNaN(x)) return x; } return (is.number(def) ? def : 0); },
  'string': function(obj, def) { if (is.valid(obj)) return obj.toString(); return (is.string(def) ? def : ''); },
  'array':  function(obj, def) { if (is.array(obj)) return obj; return is.valid(obj) ? [obj] : (def || []); }
}

//=============================================================================
//
// Compatibility for older browsers (compatibility: http://kangax.github.com/es5-compat-table/)
//
//  Object.create:        http://javascript.crockford.com/prototypal.html
//  Object.extend:        (defacto standard like jquery $.extend or prototype's Object.extend)
//  Class.create:         create a simple javascript 'class' (a constructor function with a prototype and optional class methods)
//
//=============================================================================

if (!Object.create) {
  Object.create = function(base) {
    function F() {};
    F.prototype = base;
    return new F();
  }
}

if (!Object.extend) {
  Object.extend = function(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property))
        destination[property] = source[property];
    }
    return destination;
  };
}

var Class = {
  create: function(prototype, extensions) {
    var ctor = function() { if (this.initialize) return this.initialize.apply(this, arguments); }
    ctor.prototype = prototype || {};      // instance methods
    Object.extend(ctor, extensions || {}); // class methods
    return ctor;
  }
}

if (!window.requestAnimationFrame) {// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame    || 
                                 window.oRequestAnimationFrame      || 
                                 window.msRequestAnimationFrame     || 
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}


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
//=============================================================================
// Minimal DOM Library ($)
//=============================================================================

Game.Element = function() {

  var query  = function(selector, context) {
    if (is.array(context))
      return Sizzle.matches(selector, context);
    else
      return Sizzle(selector, context);
  };

  var extend = function(obj)  {
    if (is.array(obj)) {
      for(var n = 0, l = obj.length ; n < l ; n++)
        obj[n] = extend(obj[n]);
    }
    else if (!obj._extended) {
      Object.extend(obj, Game.Element.instanceMethods);
    }
    return obj;
  };

  var on = function(ele, type, fn, capture) { ele.addEventListener(type, fn, capture);    };
  var un = function(ele, type, fn, capture) { ele.removeEventListener(type, fn, capture); };

  var create = function(attributes) {
    var ele = document.createElement(attributes.tag);
    for (var name in attributes) {
      if (attributes.hasOwnProperty(name) && is.valid(attributes[name])) {
        switch(name) {
          case 'tag'  : break;
          case 'html' : ele.innerHTML = attributes[name];  break;
          case 'text' : ele.appendChild(document.createTextNode(attributes[name])); break;
          case 'dom'  :
            attributes[name] = is.array(attributes[name]) ? attributes[name] : [attributes[name]];
            for (var n = 0 ; n < attributes[name].length ; n++)
              ele.appendChild(attributes[name][n]);
            break;
          case 'class':
          case 'klass':
          case 'className':
            ele.className = attributes[name];
            break;
          case 'on':
            for(var ename in attributes[name])
              on(ele, ename, attributes[name][ename]);
            break;
          default:
            ele.setAttribute(name, attributes[name]);
            break;
        }
      }
    }
    return ele;
  };

  return {
 
    all: function(selector, context) {
      return extend(query(selector, context));
    },

    get: function(obj, context) {
      if (is.string(obj))
        return extend(query("#" + obj, context)[0]);
      else if (is.element(obj) || is.window(obj) || is.document(obj))
        return extend(obj);
      else if (is.event(obj))
        return extend(obj.target || obj.srcElement);
      else if ((typeof obj == 'object') && obj.tag)
        return extend(create(obj));
      else
        throw "not an appropriate type for DOM wrapping: " + ele;
    },

    instanceMethods: {

      _extended: true,

      on: function(type, fn, capture) { on(this, type, fn, capture); return this; },
      un: function(type, fn, capture) { un(this, type, fn, capture); return this; },

      showIf:  function(on)      { if (on) this.show(); else this.hide(); },
      show:    function()        { this.style.display = ''       },
      hide:    function()        { this.style.display = 'none';  },
      visible: function()        { return (this.style.display != 'none') && !this.fading; },
      fade:    function(amount)  { this.style.opacity = amount;  },

      relations: function(property, includeSelf) {
        var result = includeSelf ? [this] : [], ele = this;
        while(ele = ele[property])
          if (ele.nodeType == 1)
            result.push(ele);
        return extend(result); 
      },

      parent:            function()            { return extend(this.parentNode); },
      ancestors:         function(includeSelf) { return this.relations('parentNode', includeSelf); },
      previousSiblings:  function()            { return this.relations('previousSibling');         },
      nextSiblings:      function()            { return this.relations('nextSibling');             },

      select: function(selector)            { return Game.Element.all(selector, this); },
      down: function(selector)              { return Game.Element.all(selector, this)[0]; },
      up:   function(selector, includeSelf) { return Game.Element.all(selector, this.ancestors(includeSelf))[0]; },
      prev: function(selector)              { return Game.Element.all(selector, this.previousSiblings())[0];     },
      next: function(selector)              { return Game.Element.all(selector, this.nextSiblings())[0];         },

      remove: function() {
        if (this.parentNode)
          this.parentNode.removeChild(this);
        return this;
      },

      removeChildren: function() { // NOTE: can't use :clear because its in DOM level-1 and IE bitches if we try to provide our own
        while (this.childNodes.length > 0)
          this.removeChild(this.childNodes[0]);
        return this;
      },

      update: function(content) {
        this.innerHTML = "";
        this.append(content);
      },
          
      append: function(content) {
        if (is.string(content))
          this.innerHTML += content;
        else if (is.array(content))
          for(var n = 0 ; n < content.length ; n++)
            this.append(content[n]);
        else
          this.appendChild(Game.Element.get(content));
      },

      setClassName:    function(name)     { this.className = name; },
      hasClassName:    function(name)     { return (new RegExp("(^|\s*)" + name + "(\s*|$)")).test(this.className) },
      addClassName:    function(name)     { this.toggleClassName(name, true);  },
      removeClassName: function(name)     { this.toggleClassName(name, false); },
      toggleClassName: function(name, on) {
        var classes = this.className.split(' ');
        var n = classes.indexOf(name);
        on = (typeof on == 'undefined') ? (n < 0) : on;
        if (on && (n < 0))
          classes.push(name);
        else if (!on && (n >= 0))
          classes.splice(n, 1);
        this.className = classes.join(' ');
      },

      fadeout: function(options) {
        options = options || {};
        this.cancelFade();
        this.fading = Animator.apply(this, 'opacity: 0', { duration: options.duration, onComplete: function() {
          this.hide();
          this.fading = null;
          this.style.opacity = is.ie ? 1 : null; /* clear opacity after hiding, but IE doesn't allow clear so set to 1.0 for IE */
          if (options.onComplete)
            options.onComplete();
        }.bind(this) });
        this.fading.play();
      },

      fadein: function(options) {
        options = options || {};
        this.cancelFade();
        this.style.opacity = 0;
        this.show();
        this.fading = Animator.apply(this, 'opacity: 1', { duration: options.duration, onComplete: function() {
          this.fading = null;
          this.style.opacity = is.ie ? 1 : null; /* clear opacity after hiding, but IE doesn't allow clear so set to 1.0 for IE */
          if (options.onComplete)
            options.onComplete();
        }.bind(this) });
        this.fading.play();
      },

      cancelFade: function() {
        if (this.fading) {
          this.fading.stop();
          delete this.fading;
        }
      }

    }
  };

}();

$ = Game.Element.get;
$$ = Game.Element.all;

Game.Event = {

  stop: function(ev) {
    ev.preventDefault();
    ev.cancelBubble = true;
    ev.returnValue = false;
    return false;
  }

}

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
Game.Key = {
  BACKSPACE: 8,
  TAB:       9,
  RETURN:   13,
  ESC:      27,
  SPACE:    32,
  END:      35,
  HOME:     36,
  LEFT:     37,
  UP:       38,
  RIGHT:    39,
  DOWN:     40,
  PAGEUP:   33,
  PAGEDOWN: 34,
  INSERT:   45,
  DELETE:   46,
  ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
  A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
  TILDA:    192,

  map: function(map, context, cfg) {
    cfg = cfg || {};
    var ele = $(cfg.ele || document);
    var onkey = function(ev, keyCode, mode) {
      var n, k, i;
      for(n = 0 ; n < map.length ; ++n) {
        k = map[n];
        k.mode = k.mode || 'up';
        if (Game.Key.match(k, keyCode, mode, context, ev.ctrlKey, ev.shiftKey)) {
          k.action.call(context, keyCode, ev.ctrlKey, ev.shiftKey);
          return Game.Event.stop(ev);
        }
      }
    };
    ele.on('keydown', function(ev) { return onkey(ev, ev.keyCode, 'down'); });
    ele.on('keyup',   function(ev) { return onkey(ev, ev.keyCode, 'up');   });
  },

  match: function(map, keyCode, mode, context, ctrl, shift) {
    if (map.mode === mode) {
      if (!map.state || !context || (map.state === context.current) || (is.array(map.state) && map.state.indexOf(context.current) >= 0)) {
        if ((map.key === keyCode) || (is.array(map.key) && (map.key.indexOf(keyCode) >= 0))) {
          if ((is.invalid(map.ctrl) || (map.ctrl === ctrl)) &&
              (is.invalid(map.shift) || (map.shift === shift))) {
            return true;
          }
        }
      }
    }
    return false;
  }

};


var ObjectPool = function(klass, options) {
  this.initialize(klass, options);
};

ObjectPool.prototype = {

  initialize: function(klass, options) {
    options = options || {};

    this.name        = options.name || "pool";
    this.klass       = klass;
    this.initializer = options.initializer;
    this.cleaner     = options.cleaner;
    this.store       = [];
    this.next        = 0;
    this.grow(options.size || 10);

    if (options.delegators) {
      klass.pool                  = this;
      klass.allocate              = this.allocate.bind(this);
      klass.free                  = this.free.bind(this);
      klass.prototype.isAllocated = function() { return klass.pool.isAllocated(this); };
      klass.prototype.isFree      = function() { return klass.pool.isFree(this);      };
      klass.prototype.free        = function() { klass.pool.free(this);               };
    }

  },
 
  grow: function(size) {
    var n, obj, start = this.store.length, length = size || (this.store.length * 2);
    this.store.length = length;
    for(n = start ; n < length ; n++) {
      this.store[n] = new this.klass;
      this.store[n].pindex = n;
    }
    console.log('grow ' + this.name + ' from ' + start + ' to ' + length);
  },

  swap: function(i, j) {
    var oi = this.store[i],
        oj = this.store[j];
    this.store[i] = oj;
    this.store[j] = oi;
    oi.pindex = j;
    oj.pindex = i; 
  },

  allocate: function() {
    if (this.next == this.store.length)
      this.grow();
    var result = this.store[this.next];
    if (this.initializer)
      this.initializer.apply(result, arguments);
    result.pindex = this.next;
    this.next++;
    return result;
  },

  free: function(obj) {
    if (this.isAllocated(obj)) {
      this.next--;
      this.swap(obj.pindex, this.next);
      if (this.cleaner)
        this.cleaner.call(this.store[this.next]);
    }
  },

  isAllocated: function(obj) { return obj.pindex <  this.next;      },
  isFree:      function(obj) { return obj.pindex >= this.next;      },
  allocated:   function()    { return this.next;                    },
  remaining:   function()    { return this.store.length - this.next },
  length:      function()    { return this.store.length;            }
 
};
