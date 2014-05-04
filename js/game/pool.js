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
