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

// planet grid class

MCT.PlanetGrid = function(planet, size) {
  MCT.Grid.call(this, planet, size);
  this.radius = this.size.width / 2;
}

MCT.PlanetGrid.prototype = Object.create(MCT.Grid.prototype);
MCT.PlanetGrid.prototype.constructor = MCT.PlanetGrid;

MCT.PlanetGrid.prototype.checkNode = function(node) {
  try {
    var check = MCT.Grid.prototype.checkNode.call(
      this,
      {x: node.x, y: node.y, gridRadius: this.radius},
      function(node) {
        if (Math.sqrt(Math.pow(node.x - node.gridRadius, 2) + Math.pow(node.y - node.gridRadius, 2)) < node.gridRadius
            === false) {
          throw new Error("MCT.PlanetGrid, node.position out of range.");
        }
      }
    );
    return check;
  } catch (err) {
    return -2;
  }
}

MCT.PlanetGrid.prototype.addNodes = function() {
  var radius = this.size.width / 2;
  var minPoint = { x: 0, y: 0 };
  var maxPoint = { x: this.size.width - 1, y: this.size.height - 1 }
  return MCT.Grid.prototype.addNodes.call(this, minPoint, maxPoint);
}