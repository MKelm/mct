#/bin/bash
java -jar bin/compiler/compiler.jar < cat lib/base/init.js lib/base/audio.js lib/base/game.js \
lib/display/init.js lib/display/change.js lib/display/window.js \
lib/display/scenes/menu.js lib/display/scenes/planet.js > tmp.js
cat lib/base/HEADER tmp.js > lib/display/mct.js
rm tmp.js