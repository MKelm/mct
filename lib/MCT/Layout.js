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
  this.parts = [];
  // if you want to use display objects related to your layout parts use display objects
  this.displayObjects = new MCT.DisplayObjects();
  if (typeof displayOptions.texturesHandle != "undefined") {
    this.displayObjects.loadTextureScaling(displayOptions.texturesHandle);
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

MCT.Layout.prototype.addPart = function(part) {
  // use an anchor to reduce nodes data on initialization
  // you can add further nodes data later if you want to extent your part, see below
  part.anchor = part.anchor === true ? true : false;
  if (part.partId > 0 && this.parts[part.partId].anchor === true) {
    part.anchor = true;
  }
  if (part.x >= 0 && part.y >= 0) {
    var nodeIds = [];
    if ((part.anchor == false || (part.partId > 0 && this.parts[part.partId].anchor === true))
        && part.width > 0 && part.height > 0) {
      nodeIds = this.grid.addNodes({x: part.x, y: part.y}, {x: part.x + part.width - 1, y: part.y + part.height - 1});
    } else {
      nodeIds = this.grid.addNodes({x: part.x, y: part.y}, {x: part.x, y: part.y});
      if (part.anchor === false) {
        part.width = 1;
        part.height = 1;
      }
    }

    if (nodeIds.length > 0) {
      if (part.partId > 0 && this.parts[partId].anchor === true) {
        // extend nodes of anchor parts by using existing partId
        for (var i = 0; i < this.parts[part.partId].nodes.length; i++) {
          if (nodeIds.indexOf(this.parts[part.partId].nodes[i]) > -1) {
            nodeIds.splice(nodeIds.indexOf(this.parts[part.partId].nodes[i]),1);
          }
        }
        if (nodeIds.length > 0) {
          this.parts[part.partId].nodes.concat(nodeIds);
        }
      }
      // z-index like the css property, just a dummy option for further implementations
      this.parts.push(
        { x: part.x, y: part.y, width: part.width, height: part.height,
          anchor: part.anchor, zindex: 1, nodes: nodeIds, displayObject: null
        }
      );
      return this.parts.length - 1;
    }
    return -1;
  } else {
    throw new Error("MCT.Layout, broken part position dependency.");
  }
}

MCT.Layout.prototype.addDisplayObjectToPart = function(partId, displayObject) {
  if (typeof this.parts[partId] != "undefined") {
    var scale = this.displayObjects.getScale();
    displayObject.setPosition(
      {
        x: this.parts[partId].x * (this.displayObjects.size.width / this.grid.size.width * scale.x),
        y: this.parts[partId].y * (this.displayObjects.size.height / this.grid.size.height * scale.y)
      }
    );
    this.parts[partId].displayObject = displayObject;
  }
}

MCT.Layout.prototype.getPart = function (partId) {
  // just a simple method, derivate and use it if you have more than one type of parts
  if (typeof this.parts[partId] != "undefined") {
    return this.parts[partId];
  }
}