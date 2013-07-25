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

// base values for display / pixi
// display properties, width / height / ratio will be overwritten
baseValues.display.width = 1280; // do not change this value, or you have to change all assets too!
baseValues.display.height = 1024; // do not change this value, or you have to change all assets too!
baseValues.display.ratio = 0;

baseValues.pixi = {}; // contains renderer / stage of pixi

// add all assets here!
baseValues.assetsToLoad = [
  "gfx/mct_logo.png", "gfx/mct_planet.png", "gfx/menu_button_start.png", "gfx/menu_button_quit.png"
];

$(document).ready(function() {
  global.setTimeout(displayInit, 0.00000001); // use timeout to detect fullscreen size correctly

  function displayInit() {

    // create an new instance of a pixi stage
    baseValues.pixi.stage = new PIXI.Stage(0x66FF99, true); // interactive

    // create a renderer instance.
    baseValues.pixi.renderer = PIXI.autoDetectRenderer(
      baseValues.display.width, baseValues.display.height, null, true // transparency
    );

    // add the renderer view element to the DOM
    document.body.appendChild(baseValues.pixi.renderer.view);

    // resize display size by current window size
    baseValues.display.ratio = Math.min(
      window.innerWidth / baseValues.display.width,
      window.innerHeight / baseValues.display.height
    );
    baseValues.display.width = baseValues.display.width * baseValues.display.ratio;
    baseValues.display.height = baseValues.display.height * baseValues.display.ratio;
    baseValues.pixi.renderer.resize(baseValues.display.width, baseValues.display.height);

    // init / run animation function
    requestAnimFrame(displayAnimate);

    // create a new loader
    loader = new PIXI.AssetLoader(baseValues.assetsToLoad);
    delete baseValues.assetsToLoad;
    loader.onComplete = displayLogoAdd;
    //begin load
    loader.load();
  }
});
