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

// basic planet class is a game element

MCT.Planet = function(handle, sizeScale, unitsScale) {
  MCT.Element.call(this, handle);
  this.config = this.getConfig(handle);

  // every planet has a scale size factor from 0-200% or more whatever to calculate the units
  // grid unit size to calculate layout size / nodes
  var units = 25 * unitsScale || 1.0; // default scale 100%
  this.grid = new MCT.PlanetGrid({ width: units, height: units });

  // original layout size to calculate positions and sizes of related display objects
  // the screen ratio from a scene will be used to calculate the real size
  // the element ratio is used to get an original size in relation to the scaled grid units
  var size = { width: 1000 * sizeScale || 1.0, height: 1000 * sizeScale || 1.0 };

  // add layout to arrange planet parts / objects
  this.layout = new MCT.PlanetLayout(
    this.grid, { elementHandle: 'planet', size: size, center: true }
  );
  this.layout.addHelperNodes({ image: "mct_planet_anuka", scale: { x: sizeScale, y: sizeScale } });

  // note: the click events for buildings ignores the move space interaction, like all
  // interactive sprites in front of the space background, but it might be useful to register an
  // additional mousedown interaction for buildings to dispatch the move space action event for
  // the space element, that might need some extensions ...
  this.layout.addBuilding(
    {
      name: "investmentsCenter", image: "investments_center",
      x: Math.floor(units * 0.5), y: Math.floor(units * 0.5),
      scale : { x: sizeScale, y: sizeScale },
      interaction : { type: "click", element: this, content: { action: "openInvestmentCenter" } }
    }
  );
  this.addEventListener('click', this.onMouseClick.curry());
}

MCT.Planet.prototype = Object.create(MCT.Element.prototype);
MCT.Planet.prototype.constructor = MCT.Planet;

MCT.Planet.prototype.getConfig = function(handle) {
  var config = mct.util.loadJSON("./lib/data/planets/" + handle + ".json");
  // set language dependend names / descriptions
  for (var i = 0; i < config.name.length; i++) {
    if (typeof config.name[i] == "object") {
      config.name[i] = config.name[i][mct.userConfig.language];
    }
  }
  for (var i = 0; i < config.description.length; i++) {
    if (typeof config.description[i] == "object") {
      config.description[i] = config.description[i][mct.userConfig.language];
    }
  }
  return config;
}

MCT.Planet.prototype.getName = function() {
  return this.config.name[this.config.currentVersion];
}

MCT.Planet.prototype.getDescription = function() {
  return this.config.description[this.config.currentVersion];
}

MCT.Planet.prototype.onMouseClick = function(event) {
  if (event.content.action == "openInvestmentCenter") {
    mct.audioHandler.playEffect("ef.click1");
  }
}