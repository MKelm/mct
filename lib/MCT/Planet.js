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

// basic planet class

MCT.Planet = function(name, scale) {
  this.name = name || "random" + Math.floor(Math.random() * 1000);
  // every planet has a scale size factor from 0-200% or more whatever to calculate the units
  // all further calculations espacially of the grid depends on the planet units
  var units = 25 * scale || 1.0; // default scale 100%
  this.grid = new MCT.PlanetGrid(this, { width: units, height: units });
  this.grid.initNodes();
}

MCT.Planet.prototype.constructor = MCT.Planet;