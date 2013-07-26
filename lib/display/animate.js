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

// commands for display animate
mct.display.animate = [];

function displayAnimate() {
  requestAnimFrame(displayAnimate);
  if (mct.display.animate.length > 0) {
    for (var i = 0; i < mct.display.animate.length; i++) {
      if (mct.display.animate[i].type == "rotation") {
        mct.display.animate[i].object.rotation += mct.display.animate[i].value;
      }
    }
  }
  // render the stage
  mct.pixi.renderer.render(mct.pixi.stage);
}

function displayCurrentSceneToggle() {
  mct.pixi.scenes[mct.pixi.currentScene].visible =
    (mct.pixi.scenes[mct.pixi.currentScene].visible == true) ? false : true;
}