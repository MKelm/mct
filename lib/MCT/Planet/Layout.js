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
}

MCT.PlanetLayout.prototype = Object.create(MCT.Layout.prototype);
MCT.PlanetLayout.prototype.constructor = MCT.PlanetLayout;

MCT.PlanetLayout.prototype.addBuilding = function(building) {
  var partOptions = {
    anchor : true,
    namePrefix : 'building_',
    x : building.x,
    y : building.y
  };
  var partName = this.addPart(partOptions); // add part with 1x1 unit size, needs x+y properties
  if (partName === null) {
    throw new Error("MCT.PlanetLayout, building is out of range.");
  }
  if (typeof building.name == "undefined") {
    throw new Error("MCT.PlanetLayout, broken building name dependency.");
  }
  if (typeof building.image == "undefined") {
    throw new Error("MCT.PlanetLayout, broken building image dependency.");
  }
  this.addDisplayObjectToPart(
    partName, building.name, 'button',
    { image: "building_"+building.image,  scale : building.scale, interaction: building.interaction }
  );
  return this.parts[partName];
}

MCT.PlanetLayout.prototype.addArea = function(area) {
  var partOptions = {
    namePrefix : 'area_',
    x : area.x,
    y : area.y,
    width : area.width,
    height : area.height
  }
  var partName = this.addPart(partOptions); // add part with unit size, needs x+y / width+height properties
  if (partName === null) {
    throw new Error("MCT.PlanetLayout, area is out of range.");
  }
  if (typeof area.image != "undefined") {
    this.addDisplayObjectToPart(
      partName, partName, 'image', { image: area.image, scale : area.scale }
    );
  } else {
    this.addDisplayObjectToPart(
      partName, partName, 'graphic', { fillColor: "FFFFFF", width: 5, height: 5 }
    );
  }
  return this.parts[partName];
}

MCT.PlanetLayout.prototype.getPart = function(type, name) {
  var partName = "";
  switch (type) {
    case "building":
      partName = "building_"+name;
      break;
    case "area":
      partName = "area_"+name;
      break;
  }
  MCT.Layout.prototype.getPart.call(this, partName);
}