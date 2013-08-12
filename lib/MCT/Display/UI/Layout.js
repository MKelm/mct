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

// display ui layout class

MCT.DisplayUILayout = function(grid, displayOptions) {
  MCT.Layout.call(this, grid, displayOptions);
}

MCT.DisplayUILayout.prototype = Object.create(MCT.Layout.prototype);
MCT.DisplayUILayout.prototype.constructor = MCT.DisplayUILayout;

// calculate sizes of parts and their positions in relation to each other depending on location
// and align options and set display object positions
MCT.DisplayUILayout.prototype.calculate = function() {

  var locations = [];

  for (var pn in this.parts) {
    if (this.parts[pn].visible === true) {
      if (typeof locations[this.parts[pn].zindex-1] == "undefined")
        locations[this.parts[pn].zindex-1] = { top: { parts: [] }, bottom: { parts: [] } };

      if (this.parts[pn].location == "bottom") {
        locations[this.parts[pn].zindex-1].bottom.parts.push(this.parts[pn]);
      } else {
        locations[this.parts[pn].zindex-1].top.parts.push(this.parts[pn]);
      }
    }
  }

  var unitSize = {
    width: this.displayObjects.size.width / this.grid.size.width,
    height: this.displayObjects.size.height / this.grid.size.height
  };

  // just height calculations and width calculations for first object only!
  var partSize = null;
  for (var i = 0; i < locations.length; i++) {
    locations[i].spaces = { top: 0, bottom: 0 };
    for (var j = 0; j < locations[i].top.parts.length; j++) {
      if (locations[i].top.parts[j].displayObjects.length > 0) {
        partSize = locations[i].top.parts[j].displayObjects[0].getSize();
        locations[i].top.parts[j].width = Math.ceil(partSize.width / unitSize.width);
        locations[i].top.parts[j].height = Math.ceil(partSize.height / unitSize.height);
        locations[i].top.parts[j].y = locations[i].spaces.top;
        locations[i].spaces.top += locations[i].top.parts[j].height;
        this.setDisplayObjectsPositionByPart(locations[i].top.parts[j]);
      }
    }
    locations[i].spaces.bottom += locations[i].spaces.top;
    for (var j = locations[i].bottom.parts.length-1; j > -1; j--) {
      if (locations[i].bottom.parts[j].displayObjects.length > 0) {
        partSize = locations[i].bottom.parts[j].displayObjects[0].getSize();
        locations[i].bottom.parts[j].width = Math.ceil(partSize.width / unitSize.width);
        locations[i].bottom.parts[j].height = Math.ceil(partSize.height / unitSize.height);
        locations[i].bottom.parts[j].y = locations[i].spaces.bottom;
        locations[i].spaces.bottom += locations[i].bottom.parts[j].height;
        this.setDisplayObjectsPositionByPart(locations[i].bottom.parts[j]);
      }
    }
  }

}