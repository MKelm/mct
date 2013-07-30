#/bin/bash
cat ../../lib/base/init.js ../../lib/base/audio.js ../../lib/base/game.js \
../../lib/display/init.js ../../lib/display/change.js ../../lib/display/window.js \
../../lib/display/scenes/menu.js ../../lib/display/scenes/planet.js > cat.js
java -jar compiler.jar --js=cat.js --js_output_file=../../lib/display/mct.js