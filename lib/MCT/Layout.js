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

  if (displayOptions.center === true && typeof displayOptions.size == "object") {
    displayOptions.center = {
      x: Math.floor(this.grid.size.width / 2) * (displayOptions.size.width / this.grid.size.width),
      y: Math.floor(this.grid.size.height / 2) * (displayOptions.size.height / this.grid.size.height)
    };
  } else {
    displayOptions.center = false;
  }
  this.displayObjects = new MCT.DisplayObjects(displayOptions);
  if (typeof displayOptions.position == "object") {
    this.displayObjects.move(displayOptions.position, true);
  }
}

MCT.Layout.prototype.constructor = MCT.Layout;

MCT.Layout.prototype.addPart = function(options) {
  // use an anchor to reduce nodes data on initialization
  // you can add further nodes data later if you want to extent your part, see below
  options.anchor = options.anchor === true ? true : false;
  if (typeof options.name != "undefined" && this.parts[options.name].anchor === true) {
    options.anchor = true;
  }
  if (options.x >= 0 && options.y >= 0) {
    options.x = Math.floor(options.x);
    options.y = Math.floor(options.y);
    var nodes = [];
    if ((options.anchor == false || (this.parts[options.name] != "undefined" && options.anchor === true))
        && options.width > 0 && options.height > 0) {
      options.width = Math.floor(options.width);
      options.height = Math.floor(options.height);
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
        var partName = "part"+mct.util.objectLength(this.parts);
        if (typeof options.namePrefix != "undefined") {
          partName = options.namePrefix + partName;
        }
        this.parts[partName] =
          { x: options.x, y: options.y, width: options.width, height: options.height,
            anchor: options.anchor, zindex: options.zindex || 1, nodes: nodes, displayObjects: []
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

MCT.Layout.prototype.addPartOptions = function(partName, options) {
  this.parts[partName] = $.extend(this.parts[partName], options);
}

MCT.Layout.prototype.addDisplayObjectToPart = function(partName, displayObject) {
  if (typeof this.parts[partName] != "undefined") {
    this.parts[partName].displayObjects.push(displayObject);
    this.setDisplayObjectsPositionByPart(partName, this.parts[partName].displayObjects.length-1);
  }
}

MCT.Layout.prototype.setDisplayObjectsPositionByPart = function(partName, displayObjectId) {
  if (typeof partName == "string") {
    var part = this.parts[partName];
  } else {
    var part = partName;
  }
  delete partName;

  if (typeof part != "undefined") {
    var scale = this.displayObjects.getScale();
    var unitSize = {
      x: this.displayObjects.size.width / this.grid.size.width * scale.x,
      y: this.displayObjects.size.height / this.grid.size.height * scale.y
    }
    if (typeof displayObjectId == "number") {
      part.displayObjects[displayObjectId].setPosition(
        { x: part.x * unitSize.x, y: part.y * unitSize.y }
      );
    } else {
      for (var i = 0; i < part.displayObjects.length; i++) {
        // not clean yet, because all display objects get the same position
        // needs another solution to handle more than one display object in one part
        // or use one display object for each part only again!
        part.displayObjects[i].setPosition(
          { x: part.x * unitSize.x, y: part.y * unitSize.y }
        );
      }
    }
  }
}

MCT.Layout.prototype.getPart = function(partName) {
  // just a simple method, derivate and use it if you have more than one type of parts
  if (typeof this.parts[partName] != "undefined") {
    return this.parts[partName];
  }
  return null;
}

// wrapper to set visibility with layout part option support
MCT.Layout.prototype.setVisibility = function(visible) {
  if (visible === false) {
    this.displayObjects.setVisibility(visible);
  } else {
    // use visibility options of parts to activate display object visibility
    for (var pn in this.parts) {
      if (this.parts[pn].visible !== false && this.parts[pn].displayObjects.length > 0) {
        for (var i = 0; i < this.parts[pn].displayObjects.length; i++) {
          this.parts[pn].displayObjects[i].setVisibility(visible);
        }
      }
    }
    this.displayObjects.setVisibility(visible, true);
  }
}

MCT.Layout.prototype.addHelperNodes = function(options) {
  // add helper nodes for all grid nodes / debugging
  var partOptions = {
    x : 0,
    y : 0,
    width : this.grid.size.width,
    height : this.grid.size.height
  };
  var partName = this.addPart(partOptions);
  if (typeof options != "undefined") {
    this.addDisplayObjectToPart(
      partName, this.displayObjects.add(partName, 'image', { image: options.image, scale : options.scale })
    );
  }
  for (var i = 0; i < this.grid.nodes.length; i++) {
    var partOptions = {
      x : this.grid.nodes[i].x,
      y : this.grid.nodes[i].y,
      anchor : true
    };
    var partName = this.addPart(partOptions);
    this.addDisplayObjectToPart(
      partName,
      this.displayObjects.add(
        partName+i, 'graphic', { fillColor: "FFFFFF", width: 5, height: 5, center: true }
      )
    );
  }
}