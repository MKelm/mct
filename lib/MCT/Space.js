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

// space element to handle planet elements
// the element is designed for one space only yet
// but can be extended to use it as part of a space handler logic

MCT.Space = function(sizeScale, unitsScale, planets) {
  MCT.Element.call(this, false, "space");

  this.planets = planets || {};

  // every space has a scale size factor from 0-200% or more whatever to calculate the units
  // grid unit size to calculate layout size / nodes
  var units = 25 * unitsScale || 1.0; // default scale 100%
  this.grid = new MCT.Grid({ width: units, height: units });

  // original layout size to calculate positions and sizes of related display objects
  // the screen ratio from a scene will be used to calculate the real size
  // the element ratio is used to get an original size in relation to the scaled grid units
  var size = { width: 1000 * sizeScale || 1.0, height: 1000 * sizeScale || 1.0 };

  // add layout to arrange space parts / objects
  this.layout = new MCT.Layout(
    this.grid, { elementHandle: 'space', size: size, center: true, zoom: true, zoomX: 25, zoomY: 25 }
  );
  // space background
  var partOptions = {
    x : 0, y : 0, anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  // note: pixi.js has a bug with tiling sprites, you have to add the single image
  this.layout.addDisplayObjectToPart(
    partName, "spaceBgStars", 'image',
    { image: "data/display/gfx/splitted/ti_stars.png", tiling: true,
      width: size.width, height: size.height, tileScale: {x: 0.03, y: 0.03 }
    }
  );
  this.layout.addDisplayObjectToPart(
    partName, "spaceBgInteractionLayer", 'image',
    { image: "blank",
      interaction : { type: "mousedown", element: this, content: { action: "moveSpace" } },
      width: size.width, height: size.height
    }
  );
  this.addEventListener('mousedown', mct.util.getEventListener(this, "handleEvent"));

  this.layout.addHelperNodes({ scale: { x: sizeScale, y: sizeScale } });

  // a simple logic as long as we have no more than one planet, add anuka planet to space center
  var partOptions = {
    x : this.grid.size.width / 2,
    y : this.grid.size.height / 2,
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  // a simple approach to get a planet in relation to the unit scale size of the space
  this.planets.anuka.layout.displayObjects.container.scale = { x: 0.03, y: 0.03 };
  this.layout.addDisplayObjectToPart(
    partName, "planetAnuka", 'container', { owner: this.planets.anuka.layout.displayObjects }
  );
}

MCT.Space.prototype = Object.create(MCT.Element.prototype);
MCT.Space.prototype.constructor = MCT.Space;

// mouse down / mouse move / mouse up event handler for move space action
MCT.Space.prototype.handleEvent = function(scope, event) {
  var ect = event.content;
  if (ect.action == "moveSpace") {
    switch (event.type) {
      case "mousedown":
        scope.mouseMoveCoor = { x: 0, y: 0 };
        ect.mouse.target.mousemove = function() {
          scope.dispatchEvent( { type: 'mousemove', content: ect } );
        };
        scope.addEventListener('mousemove', mct.util.getEventListener(scope, "handleEvent"));
        ect.mouse.target.mouseup = function() {
          scope.dispatchEvent( { type: 'mouseup', content: ect } );
        };
        scope.addEventListener('mouseup', mct.util.getEventListener(scope, "handleEvent"));
        break;
      case "mousemove":
        if (scope.mouseMoveCoor.x > 0 && scope.mouseMoveCoor.y > 0) {
          var diff = {
            x: ect.mouse.originalEvent.screenX - scope.mouseMoveCoor.x,
            y: ect.mouse.originalEvent.screenY - scope.mouseMoveCoor.y
          };
          scope.layout.displayObjects.move(diff);
        }
        scope.mouseMoveCoor = {
          x: ect.mouse.originalEvent.screenX,
          y: ect.mouse.originalEvent.screenY
        };
        break;
      case "mouseup":
        ect.mouse.target.mousemove = null;
        scope.removeEventListener('mousemove', mct.util.getEventListener(scope, "handleEvent"));
        ect.mouse.target.mouseup = null;
        scope.removeEventListener('mouseup', mct.util.getEventListener(scope, "handleEvent"));
        break;
    }
  }
}