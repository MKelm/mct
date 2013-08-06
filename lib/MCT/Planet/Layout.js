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

// planet layout class

MCT.PlanetLayout = function(grid, displayOptions) {
  MCT.Layout.call(this, grid, displayOptions);
  this.buildings = {}; // contains several buildings
  this.areas = {}; // planet map areas
}

MCT.PlanetLayout.prototype = Object.create(MCT.Layout.prototype);
MCT.PlanetLayout.prototype.constructor = MCT.PlanetLayout;

MCT.PlanetLayout.prototype.addBuilding = function(building) {
  building.anchor = true;
  var partId = this.addPart(building); // add part with 1x1 unit size, needs x+y properties
  if (partId == -1) {
    throw new Error("MCT.PlanetLayout, building is out of range.");
  }
  if (typeof building.name == "undefined") {
    throw new Error("MCT.PlanetLayout, broken building name dependency.");
  }
  if (typeof building.image == "undefined") {
    throw new Error("MCT.PlanetLayout, broken building image dependency.");
  }
  this.addDisplayObjectToPart(partId, this.displayObjects.add(building.name, 'button', { image: building.image }));
  this.buildings[building.name] = { part: partId };
  return this.buildings[building.name];
}

MCT.PlanetLayout.prototype.addArea = function(area) {
  var partId = this.addPart(area); // add part with unit size, needs x+y / width+height properties
  if (partId == -1) {
    throw new Error("MCT.PlanetLayout, area is out of range.");
  }
  /*if (typeof area.name == "undefined") {
    throw new Error("MCT.PlanetLayout, broken area name dependency.");
  }*/
  this.areas["area"+partId] = { part: this.parts[partId] };
  if (typeof area.image != "undefined") {
    this.addDisplayObjectToPart(partId, this.displayObjects.add("area"+partId, 'image', { image: area.image }));
  } else {
    this.addDisplayObjectToPart(
      partId, this.displayObjects.add("area"+partId, 'graphic', { fillColor: "FFFFFF", width: 5, height: 5 })
    );
  }
  return this.areas["area"+partId];
}

MCT.PlanetLayout.prototype.getPart = function(type, name) {
  switch (type) {
    case "building":
      this.buildings[name].part;
      break;
    case "area":
      this.areas[name].part;
      break;
  }
  return part;
}