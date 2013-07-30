#/bin/bash
cat lib/base/init.js lib/base/audio.js lib/base/game.js \
lib/display/init.js lib/display/change.js lib/display/window.js \
lib/display/scenes/menu.js lib/display/scenes/planet.js > cat.js
java -jar bin/compiler/compiler.jar --js=cat.js > tmp.js
rm cat.js
cat lib/base/HEADER tmp.js > lib/display/mct.js
rm tmp.js