/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mkelm/mct
 * Author(s) Martin Kelm
 *
 * Mass Control Tycoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Mass Control Tycoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mass Control Tycoon. If not, see <http://www.gnu.org/licenses/>.
 */

// esc key event to close application
// this is an implementation for development purposes
$("html").keyup(function(e){
  if (e.which == 27){
    var gui = require('nw.gui');
    gui.App.closeAllWindows();
  }
});

// base values for display / pixi
// display properties, width / height / ratio will be overwritten
mct.display.width = 1280; // do not change this value, or you have to change all assets too!
mct.display.height = 1024; // do not change this value, or you have to change all assets too!
mct.display.ratio = 0;

mct.pixi = { renderer : null, stage : null, text : {}, currentScene : "", scenes : { interactions : {} } };
$.getJSON('txt/styles.json', function(data) {
  mct.pixi.text.styles = data;
});
$.getJSON('txt/lngs/de-DE.json', function(data) {
  mct.pixi.text.lang = data;
});

// add all assets here!
mct.assetsToLoad = [
  "gfx/mct_logo.png", "gfx/mct_planet.png", "gfx/mct_menu_button.png"
];

$(document).ready(function() {
  global.setTimeout(displayInit, 0.00000001); // use timeout to detect fullscreen size correctly

  function displayInit() {

    // create an new instance of a pixi stage
    mct.pixi.stage = new PIXI.Stage(0x000000, true); // interactive

    // create a renderer instance.
    mct.pixi.renderer = PIXI.autoDetectRenderer(
      mct.display.width, mct.display.height, null, true // transparency
    );

    // add the renderer view element to the DOM
    document.body.appendChild(mct.pixi.renderer.view);

    // resize display size by current window size
    mct.display.ratio = Math.min(
      window.innerWidth / mct.display.width,
      window.innerHeight / mct.display.height
    );
    mct.display.width = mct.display.width * mct.display.ratio;
    mct.display.height = mct.display.height * mct.display.ratio;
    mct.pixi.renderer.resize(mct.display.width, mct.display.height);

    // init / run animation function
    requestAnimFrame(displayAnimate);

    // load assets by array
    loader = new PIXI.AssetLoader(mct.assetsToLoad);
    delete mct.assetsToLoad;
    loader.onComplete = displaySceneMenuAdd;
    loader.load();
  }
});
