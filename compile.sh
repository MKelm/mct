#!/bin/bash
cat lib/MCT.js lib/MCT/Util.js lib/MCT/Version.js \
lib/MCT/Game.js lib/MCT/Element.js lib/MCT/Grid.js \
lib/MCT/Layout.js lib/MCT/Space.js lib/MCT/Planet.js lib/MCT/Planet/Grid.js \
lib/MCT/Planet/Layout.js lib/MCT/Player.js lib/MCT/Player/Cpu.js \
lib/MCT/Display/Object.js lib/MCT/Display/Objects.js lib/MCT/Display/Scene.js \
lib/MCT/Display/Scene/Handler.js lib/MCT/Display/UI/Layout.js lib/MCT/Display/UI/Panel.js \
lib/MCT/Display/UI/Panel/Menu.js lib/MCT/Display/UI/Panel/Window.js lib/MCT/Audio/Handler.js \
lib/MCT/Pixi.js lib/MCT/Survey.js lib/mct/jsext.js lib/mct/hotkeys.js lib/mct.js > cat.js
java -jar bin/compiler/compiler.jar --js=cat.js > tmp.js
rm cat.js
cat lib/HEADER tmp.js > lib/mctc.js
rm tmp.js