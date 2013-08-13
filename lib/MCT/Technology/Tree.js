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

// the technology tree is a structure which uses a base config for technology and can
// extend internal techmology status based on research

MCT.TechnologyTree = function() {
  MCT.Element.call(this, "technologyTree", false, true);

  this.config = this.getConfig();

}

MCT.TechnologyTree.prototype = Object.create(MCT.Element.prototype);
MCT.TechnologyTree.prototype.constructor = MCT.TechnologyTree;

MCT.TechnologyTree.prototype.getConfig = function() {
  var config = mct.util.loadJSON("./lib/data/technologies.json");
  return config;
}
