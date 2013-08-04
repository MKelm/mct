/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mctteam/mct
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
    current : null
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
  currentScene : "menu", // change to start with a specific scene on start for development purposes
  // limit for fps related to scenes, can decrease the cpu usage, -1 = no limit (fallback)
  maxFps : {
    menu : 50,
    planet : 5
  },
  // "animate": just a dummy option for later extensions to make animations optional
  // can be combined with a lower maxFps profile to reduce CPU usage and improve performance on
  // older systems or systems without webgl support
  animate : true,
  animateCommands : [] // for animate.js
};

mct.status.pixi.scene = {}; // current scene
mct.status.pixi.survey = {}; // current scene

$.ajaxSetup({async:false});
mct.pixi.text.styles = $.parseJSON($.get('txt/styles.json').responseText);
mct.pixi.text.lang = $.parseJSON($.get('txt/lngs/' + mct.status.lang + '.json').responseText);

// add all assets here!
mct.pixi.assetsToLoad = [ "gfx-packed/gfx.atlas", "gfx-packed/spinebird.atlas", "gfx-packed/spinebird.json" ];

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
    displayInitScreenResize();

    // init optional fps counter, see change.js for more
    var style = mct.pixi.text.styles["fpscounter1"];
    style = {font: Math.floor(style[0] * mct.pixi.screen.ratio) + "px " + style[1], fill: style[2]};
    mct.status.pixi.fps = [-1, new PIXI.Text("0", style)]; // fps[0] = -1 => disabled counter
    mct.status.pixi.fps[1].position.x = 5 * mct.pixi.screen.ratio;
    mct.status.pixi.fps[1].position.y = 5 * mct.pixi.screen.ratio;
    mct.status.pixi.fps[1].visible = false;
    mct.pixi.stage.addChild(mct.status.pixi.fps[1]);

    // init / run animation function
    requestAnimFrame(displayChangeAnimate);

    // load assets by array
    loader = new PIXI.AssetLoader(mct.pixi.assetsToLoad);
    delete mct.pixi.assetsToLoad;
    switch (mct.pixi.currentScene) {
      case 'planet':
        var startFunction = displayScenePlanetAdd;
        break;
      case 'menu':
        var startFunction = displaySceneMenuAdd;
        break;
      case 'gameNew':
        var startFunction = startGameNew;
        break;
    }
    loader.onComplete = startFunction;
    loader.load();
  }
});

function displayInitScreenResize() {
  if (mct.pixi.screen.ratio !== 0) {
    // restore default screen size for new resize action
    mct.pixi.screen.width = mct.pixi.screen.width / mct.pixi.screen.ratio;
    mct.pixi.screen.height = mct.pixi.screen.height / mct.pixi.screen.ratio;
  }
  // resize display size by current window size
  mct.pixi.screen.ratio = Math.min(
    window.innerWidth / mct.pixi.screen.width,
    window.innerHeight / mct.pixi.screen.height
  );
  mct.pixi.screen.width = mct.pixi.screen.width * mct.pixi.screen.ratio;
  mct.pixi.screen.height = mct.pixi.screen.height * mct.pixi.screen.ratio;
  mct.pixi.renderer.resize(mct.pixi.screen.width, mct.pixi.screen.height);
}

$(window).resize(function() {
  /*
   * note: the resize function has no effects on stage elements currently
   * a complete resize is possible for new stage objects only
   * the logic needs an more advanced layout manager to change all stage objects on resize
   */
  displayInitScreenResize();
});
