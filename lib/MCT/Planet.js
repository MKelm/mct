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

MCT.Planet = function(name, sizeScale, unitsScale) {
  MCT.Element.call(this, name);

  // every planet has a scale size factor from 0-200% or more whatever to calculate the units
  // grid unit size to calculate layout size / nodes
  var units = 25 * unitsScale || 1.0; // default scale 100%
  this.grid = new MCT.PlanetGrid({ width: units, height: units });

  // original layout size to calculate positions and sizes of related display objects
  // the screen ratio from a scene will be used to calculate the real size
  // the element ratio is used to get an original size in relation to the scaled grid units
  var size = { width: 1000 * sizeScale || 1.0, height: 1000 * sizeScale || 1.0 };

  // add layout to arrange planet parts / objects
  // this is just a test with the basic class the planet will
  // get an extended layout class with logic for maps and so on
  this.layout = new MCT.PlanetLayout(
    this.grid, { elementHandle: 'planet', size: size }
  );
  this.layout.addHelperNodes({ image: "mct_planet", scale: { x: sizeScale, y: sizeScale } });
  this.layout.addBuilding(
    {
      name: "investmentsCenter", image: "investments_center",
      x: Math.floor(units * 0.5), y: Math.floor(units * 0.5),
      scale : { x: sizeScale, y: sizeScale }
    }
  );

  // test zoom
  // todo move to DisplayObjects
  var scope = this;
  $('html').bind('mousewheel', function(e) {
      var objectsPos = {};

      scope.layout.displayObjects.container.pivot = {x: 500, y: 500 };
      scope.layout.displayObjects.container.position = {x: 400, y: 400 };

      jQuery.extend(objectsPos, scope.layout.displayObjects.container.position);
      var rendererPos = { x: Number($('body').css("padding-left").replace("px","")), y: 0 };
      objectsPos.x += rendererPos.x;

      var eventPos = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };

      console.log(eventPos.x - objectsPos.x, eventPos.y - objectsPos.y);

      // needs a position change in relation to renderer / objects / mouse position!

      var scale = scope.layout.displayObjects.getScale();
      console.log(e);
      if (e.originalEvent.wheelDelta / 120 > 0) {
        scope.layout.displayObjects.setScale({ x: scale.x * 1.1, y: scale.y * 1.1 });
      } else {
        scope.layout.displayObjects.setScale({ x: scale.x / 1.1, y: scale.y / 1.1 });
      }
  });
}

MCT.Planet.prototype = Object.create(MCT.Element.prototype);
MCT.Planet.prototype.constructor = MCT.Planet;