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

// ui panel element

MCT.DisplayUIPanel = function(name, unitSize) {
  MCT.Element.call(this, name);

  // 1280x1024 pixels are the default size for an ui panel
  // note: the panel logic does not support widescreen yet!
  // so every panel grid has max 1280x1024 units, unitSize defines the pixel size of each unit
  this.grid = new MCT.Grid({ width: 1280 / (unitSize || 50), height: 1024 / (unitSize || 50) });

  // original layout size to calculate positions and sizes of related display objects
  // the screen ratio from a scene will be used to calculate the real size
  // the element ratio is used to get an original size in relation to the scaled grid units
  var size = { width: 1280, height: 1024 };

  // add layout to arrange planet parts / objects
  // this is just a test with the basic class the planet will
  // get an extended layout class with logic for maps and so on
  this.layout = new MCT.DisplayUILayout(
    this.grid, { elementHandle: name+'panel', size: size }
  );
}

MCT.DisplayUIPanel.prototype = Object.create(MCT.Element.prototype);
MCT.DisplayUIPanel.prototype.constructor = MCT.DisplayUIPanel;