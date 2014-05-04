var PubSub = {

  enable: function(on) {

    on.subscribe = function(target, events) {
      var n, max, event;
      events = is.array(events) ? events : [].slice.call(arguments, 1);
      for(n = 0, max = events.length ; n < max ; n++) {
        event = 'on' + events[n];
        this.subscribers        = this.subscribers        || {};
        this.subscribers[event] = this.subscribers[event] || [];
        this.subscribers[event].push(target);
      }
    };

    on.publish = function(event) {
      event = 'on' + event;
      if (this.subscribers && this.subscribers[event]) {
        var subs = this.subscribers[event],
            args = [].slice.call(arguments, 1),
            n, max, target;
        for(n = 0, max = subs.length ; n < max ; n++) {
          target = subs[n];
          target[event].apply(target, args);
        }
      }
    };

    if (arguments.length > 1)
      on.subscribe(on, [].slice.call(arguments, 1));

  }

};

