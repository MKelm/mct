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

// layout class
// to arrange parts on a grid

MCT.Layout = function(grid, displayOptions) {
  if ((grid instanceof MCT.Grid) === false) {
    throw new Error("MCT.Layout, broken grid dependency.");
  }
  this.grid = grid;
  // parts can have a min / max position related to the used grid
  // if a part have only one position it will be used for a single grid node
  // - example 1 - in a UI layout a column is an area part
  // - example 2 - a building on a planet is a part on a single grid node
  this.parts = {};
  // if you want to use display objects related to your layout parts use display objects
  this.displayObjects = new MCT.DisplayObjects();
  if (typeof displayOptions.texturesHandle != "undefined") {
    this.displayObjects.loadTexturesOptions(displayOptions.texturesHandle);
  }
  if (typeof displayOptions.size != "undefined") {
    // set original size to display objects container
    // set the container scale later in scene
    this.displayObjects.size = displayOptions.size;
  }
}

MCT.Layout.prototype.constructor = MCT.Layout;

MCT.Layout.prototype.setScale = function(scale) {
  this.displayObjects.setScale(scale);
}

MCT.Layout.prototype.addPart = function(options) {
  // use an anchor to reduce nodes data on initialization
  // you can add further nodes data later if you want to extent your part, see below
  options.anchor = options.anchor === true ? true : false;
  if (typeof options.name != "undefined" && this.parts[options.name].anchor === true) {
    options.anchor = true;
  }
  if (options.x >= 0 && options.y >= 0) {
    var nodes = [];
    if ((options.anchor == false || (this.parts[options.name] != "undefined" && options.anchor === true))
        && options.width > 0 && options.height > 0) {
      nodes = this.grid.addNodes(
        {x: options.x, y: options.y},
        {x: options.x + options.width - 1, y: options.y + options.height - 1}
      );
    } else {
      nodes = this.grid.addNodes({x: options.x, y: options.y}, {x: options.x, y: options.y});
      if (options.anchor === false) {
        options.width = 1;
        options.height = 1;
      }
    }

    if (nodes.length > 0) {
      if (typeof options.name == "undefined") {
        // z-index like the css property, just a dummy option for further implementations
        var partName = "part"+baseUtilObjectLength(this.parts);
        if (typeof options.namePrefix != "undefined") {
          partName = options.namePrefix + partName;
        }
        this.parts[partName] =
          { x: options.x, y: options.y, width: options.width, height: options.height,
            anchor: options.anchor, zindex: 1, nodes: nodes, displayObject: null
          };
        return partName;
      } else {
        // add nodes which are not already in the part (with anchor)
        for (var i = 0; i < nodes.length; i++) {
          if (this.parts[options.name].nodes.indexOf(nodes[i]) == -1) {
            this.parts[options.name].nodes.push(nodes[i]);
          }
        }
        return partName;
      }
    }
    return null;
  } else {
    throw new Error("MCT.Layout, broken part position dependency.");
  }
}

MCT.Layout.prototype.addDisplayObjectToPart = function(partName, displayObject) {
  if (typeof this.parts[partName] != "undefined") {
    var scale = this.displayObjects.getScale();
    displayObject.setPosition(
      {
        x: this.parts[partName].x * (this.displayObjects.size.width / this.grid.size.width * scale.x),
        y: this.parts[partName].y * (this.displayObjects.size.height / this.grid.size.height * scale.y)
      }
    );
    this.parts[partName].displayObject = displayObject;
  }
}

MCT.Layout.prototype.getPart = function (partName) {
  // just a simple method, derivate and use it if you have more than one type of parts
  if (typeof this.parts[partName] != "undefined") {
    return this.parts[partName];
  }
  return null;
}