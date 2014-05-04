require 'unified_assets/tasks'

UnifiedAssets::Tasks.new do |t|
  t.minify = false
  t.assets = {

    "js/vendor.js" => [
      "js/vendor/fpsmeter.js",          # http://darsa.in/fpsmeter/
      "js/vendor/sizzle.js",            # http://sizzlejs.com/
      "js/vendor/audio-fx.js",          # https://github.com/jakesgordon/audio-fx
      "js/vendor/state-machine.js",     # https://github.com/jakesgordon/javascript-state-machine
      "js/vendor/animator.js",          # http://berniesumption.com/software/animator/
      "js/vendor/pubsub.js"             # not published yet
    ],

    "js/game.js" => [
      "js/game/base.js",
      "js/game/game.js",
      "js/game/math.js",
      "js/game/dom.js",
      "js/game/event.js",
      "js/game/canvas.js",
      "js/game/key.js",
      "js/game/pool.js"
    ]

  }
end
