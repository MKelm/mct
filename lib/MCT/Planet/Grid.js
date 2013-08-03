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
}

MCT.PlanetGrid.prototype = Object.create(MCT.Grid.prototype);
MCT.PlanetGrid.prototype.constructor = MCT.PlanetGrid;

MCT.PlanetGrid.prototype.initNodes = function() {
  var radius = this.size.width / 2;
  var areaSize = Math.floor(this.size.width / 2);
  var mPoint = [ 0, 0 ];
  var minPoint = { x: -1 * areaSize, y: -1 * areaSize };
  var maxPoint = { x: areaSize, y: areaSize };
  MCT.Grid.prototype.initNodes.call(
    this, minPoint, maxPoint,
    function(x, y) { return Math.sqrt(Math.pow(x - mPoint[0], 2) + Math.pow(y - mPoint[1], 2)) < radius; }
  );
}