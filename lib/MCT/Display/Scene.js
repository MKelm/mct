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

// display scene class

MCT.DisplayScene = function() {
  if (typeof mct.pixi == "undefined") {
    throw new Error("MCT.DisplayScene, broken pixi dependency.");
  }
  // a scene contains layouts of game elements to perform display actions on their displayObjects
  this.layouts = []; // array list
}

MCT.DisplayScene.prototype.constructor = MCT.DisplayScene;

MCT.DisplayScene.prototype.update = function() {
  // update scene contents in stage depending on visible layout display objects
  // can add missing display objects only yet
  for (var i = 0; i < this.layouts.length; i++) {
    if (this.layouts[i].displayObjects.getVisibility() == true &&
        mct.pixi.stage.children.indexOf(this.layouts[i].displayObjects.container) == -1) {
      mct.pixi.stage.addChild(this.layouts[i].displayObjects.container);
      // this needs more logic to update all single display objects if a display objects container
      // exists already in the stage
    }
  }
}

MCT.DisplayScene.prototype.addLayout = function(layout) {
  // use pixi screen size and related ratio to calculate size of DisplayObjects' container in layouts
  layout.setScale({x: mct.pixi.screen.ratio, y: mct.pixi.screen.ratio});
  this.layouts.push(layout);
}

MCT.DisplayScene.prototype.removeLayout = function(id, partId, keepInBackground) {
  // removes layout / layout part from scene
  if (partId > -1) {
    mct.pixi.stage.removeChild(this.layouts[id].parts[partId].displayObject);
    if (keepInBackground !== true) {
      this.layouts[id].displayObjects.remove(this.layouts[id].parts[partId].displayObject);
    }
  } else {
    for (var partId = 0; partId < this.layouts[id].parts.length; partId++) {
      mct.pixi.stage.removeChild(this.layouts[id].parts[partId].displayObject);
      if (keepInBackground !== true) {
        this.layouts[id].displayObjects.remove(this.layouts[id].parts[partId].displayObject);
      }
    }
  }
}