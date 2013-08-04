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

MCT.Layout = function(grid) {
  if ((grid instanceof MCT.Grid) === false) {
    throw new Error("MCT.Layout, broken grid dependency.");
  }
  this.grid = grid;
  // parts can have a min / max position related to the used grid
  // if a part have only one position it will be used for a single grid node
  // - example 1 - in a UI layout a column is an area part
  // - example 2 - a building on a planet is a part on a single grid node
  this.parts = [];
}

MCT.Layout.prototype.constructor = MCT.Layout;

MCT.Layout.prototype.addPart = function(part) {
  if (part.x >= 0 && part.y >= 0) {
    var nodeIds = [];
    if (part.width > 0 && part.height > 0) {
      nodeIds = this.grid.initNodes({x: part.x, y: part.y}, {x: part.height - 1, y: part.width - 1});
    } else {
      nodeIds = this.grid.initNodes({x: part.x, y: part.y}, {x: part.x, y: part.y});
      part.width = 1;
      part.height = 1;
    }
    if (nodeIds.length > 0) {
      this.parts.push({ x: part.y, y: part.y, width: part.width, height: part.height, nodes: nodeIds });
      return this.parts.length - 1;
    }
    return -1;
  } else {
    throw new Error("MCT.Layout, broken part position dependency.");
  }
}

MCT.Layout.prototype.getPart = function (partId) {
  // just a simple method, derivate and use it if you have more than one type of parts
  if (typeof partId != "undefined" && partId > -1) {
    return this.parts[partId];
  }
}