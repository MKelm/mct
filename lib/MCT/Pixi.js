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

  this.setFpsCounter();

  var scope = this;
  $(window).resize(function() {
    // the logic has no effects on scene contents yet!!!
    scope.autoResizeRenderer();
  });
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
  if (mct.userConfig.fps > -1) {
    global.setTimeout(function() { requestAnimFrame(scope.animate.curry(scope)); }, 1000 / mct.userConfig.fps );
  } else {
    requestAnimFrame(scope.animate.curry(scope));
  }
  // optional fpc counter
  if (scope.fps[0] > -1) {
    scope.fps[0]++;
  }

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

MCT.Pixi.prototype.setFpsCounter = function(keyEvent, scope) {
  if (typeof keyEvent == "undefined") {
    scope = this;
  }
  if (typeof scope.fps == "undefined") {
    style = {font: Math.floor(15 * scope.screen.ratio) + "px " + "Arial", fill: "FFFFFF"};
    scope.fps = [-1, new PIXI.Text("0", style)]; // fps[0] = -1 => disabled counter
    scope.fps[1].position.x = 5 * scope.screen.ratio;
    scope.fps[1].position.y = 5 * scope.screen.ratio;
    scope.fps[1].visible = false;
  } else {
    if (keyEvent === true && scope.fps[0] < 0) {
      scope.fps[0] = 0;
      scope.fps[1].visible = true;
      mct.intervals["fpsCounter"] = setInterval(scope.setFpsCounter.curry(false, scope), 1000);
      keyEvent = false;
      scope.stage.addChild(scope.fps[1]);
    }
    scope.fps[1].setText(scope.fps[0] < 0 ? 0 : scope.fps[0]);
    scope.fps[0] = 0;
    if (keyEvent === true && scope.fps[0] > -1) {
      clearInterval(mct.intervals["fpsCounter"]);
      scope.fps[1].visible = false;
      scope.fps[0] = -1;
      scope.stage.removeChild(scope.fps[1]);
    }
  }
}