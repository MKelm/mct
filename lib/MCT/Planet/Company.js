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

// planet company for company related functionality

MCT.PlanetCompany = function(name, player) {
  MCT.Element.call(this, name, false, true);

  // just an approach to add cpu/human player logic for companies
  // the implementation can change if another place is better for this
  if (typeof player == "string") {
    this.player = (player === "human") ? new MCT.Player() : new MCT.PlayerCpu();
  } else if (player instanceof MCT.Player) {
    this.player = player;
  }
}

MCT.PlanetCompany.prototype = Object.create(MCT.Element.prototype);
MCT.PlanetCompany.prototype.constructor = MCT.PlanetCompany;