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

// basic planet grid class

MCT.PlanetGrid = function(planet) {
  this.planet = planet || null;
  if ((this.planet instanceof MCT.Planet) === false) {
    throw new Error("MCT.PlanetGrid, broken planet dependency.")
  }
  this.size = { units: planet.units, radius: planet.units * 1/4 * planet.units };
  this.nodes = [];
}

MCT.PlanetGrid.prototype.constructor = MCT.PlanetGrid;

MCT.PlanetGrid.prototype.initNodes = function() {
  var mPoint = [ this.size.units / 2, this.size.units / 2 ], rSquare = this.size.radius ^ 2, pSquare = 0;

  for (var x = 0; x < this.size.units; x++) {
    for (var y = 0; y < this.size.units; y++) {
      pSquare = Math.pow(x - mPoint[0], 2) + Math.pow(y - mPoint[1], 2);
      if (pSquare < rSquare) {
        this.nodes.push(
          { x : x, y : y }
        );
      }
    }
  }

  //console.log(this.nodes);

}