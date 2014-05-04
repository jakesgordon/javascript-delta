Javascript Delta
=================

This is a small weekend homage to the classic c64 shoot-em-up "Delta".

 * [Read more](http://codeincomplete.com/posts/2014/5/3/javascript_delta/)

TODO
====

 - POWER UPS
   - speed
   - fire rate
   - fire multiple
   - fire up/down/back
   - shield

 - MORE ALIEN VARIETY:
   - rotate around a queen alien
   - pillars with gaps to fly through
   - boss aliens
   - split/multiple waves (e.g. 2 or more independent waves at same time)
   - ddx/ddy accelerating (hyperbolic and elliptical motion)
   - give aliens customizable health so they might take multiple shots before dying
   - give aliens customizable shot rate

 - MORE GRAPHICS
   - alien graphics
   - bullet graphics
   - rock/border graphics
   - title screen graphics

 - CLEANUP and MISC
   - clean up the hideous N^2 collision detection code
   - use a little PUB/SUB event handling for simpler code
   - "are you sure" confirmation on quit
   - high scores
   - performance (avoid garbage, optimize rendering)


DEVELOPMENT
===========

The game is 100% client side javascript and css. It should run when served up by any web server.

Any changes to the following files will be reflected immediately on refresh of the browser

  - js/delta.js
  - css/delta.css
  - images/
  - levels/

However, if you modify the js/game/ or js/vendor/ javascript files, the unified versions need to be regenerated:

    js/vendor.js        # the unified 3rd party vendor scripts (fpsmeter, state-machine, etc)
    js/game.js          # the unified general purpose game engine

If you have the Ruby language available, Rake tasks can be used to auto generate these unified files:

    rake assets:create   # re-create unified javascript/css asset files on demand
    rake assets:server   # run a simple rack server that automatically regenerates the unified files when the underlying source is modified

Attributions
============

All sounds effects are CC licensed from freesound.org

 - [shoot](http://www.freesound.org/people/bubaproducer/sounds/151011/)
 - [explode](http://www.freesound.org/people/Nbs%20Dark/sounds/94185/)

Music is (respectfully) borrowed from [Rob Hubbard's](http://en.wikipedia.org/wiki/Rob_Hubbard)
original because it's ABSOLUTELY FANTASTIC! 

 - [High Voltage SID Collection](http://www.hvsc.de/)

All graphics are (respectfully) ripped from original R-Type arcade games by

 - [http://www.retrogamezone.co.uk/rtype.htm](http://www.retrogamezone.co.uk/rtype.htm)

License
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License) license.

