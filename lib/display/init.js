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

mct.pixi = {
  renderer : null,
  stage : null,
  text : {}, // text styles and translations to use
  scenes : {
    current : null,
  },
  windows : {
    // global interactions storage for visible interactions
    // note: the interaction handler of windows does not avoid overlapping scene interactions yet
    interactions : { }
  }, // for window.js
  screen : { // display properties, width / height / ratio will be overwritten
    width : 1280, // do not change this value, or you have to change all assets too!
    height : 1024, // do not change this value, or you have to change all assets too!
    ratio : 0
  },
  animateCommands : [] // for animate.js
};

$.ajaxSetup({async:false});
mct.pixi.text.styles = $.parseJSON($.get('txt/styles.json').responseText);
mct.pixi.text.lang = $.parseJSON($.get('txt/lngs/' + mct.game.status.lang + '.json').responseText);

// add all assets here!
mct.assetsToLoad = [ "gfx/sprite_sheet.json" ];

// wait for document ready to get access to all loaded/included files independed by inclusion order
$(document).ready(function() {
  global.setTimeout(displayInit, 0.00000001); // use timeout to detect fullscreen size correctly

  function displayInit() {

    // create an new instance of a pixi stage
    mct.pixi.stage = new PIXI.Stage(0xFFFFFF, true); // interactive

    // create a renderer instance.
    mct.pixi.renderer = PIXI.autoDetectRenderer(
      mct.pixi.screen.width, mct.pixi.screen.height, null, true // transparency
    );

    // add the renderer view element to the DOM
    document.body.appendChild(mct.pixi.renderer.view);

    // resize display size by current window size
    mct.pixi.screen.ratio = Math.min(
      window.innerWidth / mct.pixi.screen.width,
      window.innerHeight / mct.pixi.screen.height
    );
    mct.pixi.screen.width = mct.pixi.screen.width * mct.pixi.screen.ratio;
    mct.pixi.screen.height = mct.pixi.screen.height * mct.pixi.screen.ratio;
    mct.pixi.renderer.resize(mct.pixi.screen.width, mct.pixi.screen.height);

    // init / run animation function
    requestAnimFrame(displayAnimate);

    // load assets by array
    loader = new PIXI.AssetLoader(mct.assetsToLoad);
    delete mct.assetsToLoad;
    loader.onComplete = displaySceneMenuAdd;
    loader.load();
  }
});