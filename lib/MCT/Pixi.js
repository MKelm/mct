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

// wrapper class for mct pixi stuff

MCT.Pixi = function() {
  this.screen = { width: 1280, height: 1024, ratio: 0 };

  // create an new instance of a pixi stage
  this.stage = new PIXI.Stage(0xFFFFFF, true); // interactive

  // create a renderer instance.
  this.renderer = PIXI.autoDetectRenderer(
    this.screen.width, this.screen.height, null, true // transparency
  );
  this.autoResizeRenderer();
}

MCT.Pixi.prototype.constructor = MCT.Pixi;

MCT.Pixi.prototype.autoResizeRenderer = function() {
  if (this.screen.ratio !== 0) {
    // restore default screen size for new resize action
    this.screen.width = this.screen.originalSize.width;
    this.screen.height = this.screen.originalSize.height;
  } else {
    this.screen.baseSize = { width: this.screen.width, height: this.screen.height };
  }
  // resize display size by current window size
  this.screen.ratio = Math.min(
    window.innerWidth / this.screen.width, window.innerHeight / this.screen.height
  );
  this.screen.width = this.screen.width * this.screen.ratio;
  this.screen.height = this.screen.height * this.screen.ratio;
  this.renderer.resize(this.screen.width, this.screen.height);
}

// needs a valid scope to get the active pixi instance!
MCT.Pixi.prototype.animate = function(scope) {
  requestAnimFrame(scope.animate.curry(scope));
  TWEEN.update();
  scope.renderer.render(scope.stage);
}

MCT.Pixi.prototype.loadAssets = function(callback) {
  var assetsToLoad = [
    "data/display/gfx/packed/gfx.atlas",
    "data/display/gfx/packed/spinebird.atlas",
    "data/display/gfx/packed/spinebird.json"
  ];
  loader = new PIXI.AssetLoader(assetsToLoad);
  loader.onComplete = callback;
  loader.load();
}