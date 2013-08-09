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
    this.grid, { elementHandle: 'space', size: size, center: true, zoom: true }
  );
  // space background
  var partOptions = {
    x : 0, y : 0, anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  // note: pixi.js has a bug with tiling sprites, you have to add the single image
  this.layout.addDisplayObjectToPart(
    partName,
    this.layout.displayObjects.add(
      "spaceBgStars", 'image',
      { image: "data/display/gfx/splitted/ti_stars.png", tiling: true,
        width: size.width, height: size.height, tileScale: {x: 0.03, y: 0.03 }
      }
    )
  );
  this.layout.addDisplayObjectToPart(
    partName,
    this.layout.displayObjects.add(
      "spaceBgInteractionLayer", 'image',
      { image: "blank",
        interaction : { type: "mousedown", element: this, content: { action: "moveSpace" } },
        width: size.width, height: size.height
      }
    )
  );
  this.addEventListener('mousedown', this.onMouseDown.curry());

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
    partName,
    this.layout.displayObjects.add(
      "planetAnuka", 'container', { owner: this.planets.anuka.layout.displayObjects }
    )
  );
}

MCT.Space.prototype = Object.create(MCT.Element.prototype);
MCT.Space.prototype.constructor = MCT.Space;

// mouse down event to start move space action
MCT.Space.prototype.onMouseDown = function(event) {
  if (event.content.action == "moveSpace") {
    var ect = event.content;
    var callback = function() {
      ect.element.dispatchEvent( { type: 'mousemove', content: ect } );
    };
    ect.sprite.mousemove = callback;
    ect.element.addEventListener('mousemove', ect.element.onMouseMove.curry());
    callback = function() {
      ect.element.dispatchEvent( { type: 'mouseup', content: ect } );
    };
    ect.sprite.mouseup = callback;
    ect.element.addEventListener('mouseup', ect.element.onMouseUp.curry());
    console.log("moveSpace mousedown");
  }
}

// mouse move event for move space action
MCT.Space.prototype.onMouseMove = function(event) {
  if (event.content.action == "moveSpace") {
    console.log("moveSpace mousemove");
  }
}

// mouse move event to stop move space action
MCT.Space.prototype.onMouseUp = function(event) {
  if (event.content.action == "moveSpace") {
    event.content.sprite.mousemove = null;
    event.content.sprite.mouseup = null;
    console.log("moveSpace mouseup");
  }
}
