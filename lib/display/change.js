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

// function for animation changes for renderer
// commands for pixi animate uses mct.pixi.animateCommands from init.js
function displayAnimate() {
  requestAnimFrame(displayAnimate);
  displayFpsCount();
  TWEEN.update();
  if (mct.pixi.animateCommands.length > 0) {
    for (var i = 0; i < mct.pixi.animateCommands.length; i++) {
      if (mct.pixi.animateCommands[i].type == "rotation") {
        mct.pixi.animateCommands[i].object.rotation += mct.pixi.animateCommands[i].value;
      }
    }
  }
  // render the stage
  mct.pixi.renderer.render(mct.pixi.stage);
}

// function for change scene commands
function displaySceneToggle(current) {
  if (typeof current == "undefined") {
    current = mct.pixi.scenes.current;
  }
  mct.pixi.scenes[current].visible = (mct.pixi.scenes[current].visible == true) ? false : true;
  // todo: backup / restore windows interactions to scenes on scene toggle
}

// hotkey F1 to enable / disable fps counter
// this is an implementation for development purposes
$("html").keyup(function(e){
  if (e.which == 112){
    console.log(1);
    if (mct.status.pixi.fps[0] < 0) {
      mct.status.pixi.fps[0] = 0;
      mct.status.pixi.fps[1].visible = true;
      mct.intervals["fpsCounter"] = setInterval(function(){ displayFpsCounter(); }, 1000);
    } else {
      clearInterval(mct.intervals["fpsCounter"]);
      mct.status.pixi.fps[0] = -1;
      mct.status.pixi.fps[1].visible = false;
    }
  }
});

function displayFpsCount() {
  if (mct.status.pixi.fps[0] > -1) {
    mct.status.pixi.fps[0]++;
  }
}

function displayFpsCounter() {
  mct.status.pixi.fps[1].setText(mct.status.pixi.fps[0]);
  mct.status.pixi.fps[0] = 0;
}

