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

// ui menu panel element

MCT.DisplayUIPanelMenu = function() {
  MCT.DisplayUIPanel.call(this, "menu");

  // add node graphics for debugging
  this.layout.addHelperNodes();

  // add menu logo part
  var partOptions = {
    x : this.grid.size.width / 2,
    y : (this.grid.size.height / 2) - (this.grid.size.height * 0.1),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(
    partName, this.layout.displayObjects.add("menuLogo", 'image', { image: "mct_logo" })
  );

  // add start button part
  var partOptions = {
    x : (this.grid.size.width / 2) - (this.grid.size.width * 0.15),
    y : (this.grid.size.height / 2) + (this.grid.size.height * 0.15),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(
    partName, this.layout.displayObjects.add("menuButtonStart", 'button', { image: "mct_menu_button" })
  );

  // add quit button part
  var partOptions = {
    x : (this.grid.size.width / 2) + (this.grid.size.width * 0.15),
    y : (this.grid.size.height / 2) + (this.grid.size.height * 0.15),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(
    partName, this.layout.displayObjects.add("menuButtonQuit", 'button', { image: "mct_menu_button" })
  );
}

MCT.DisplayUIPanelMenu.prototype = Object.create(MCT.DisplayUIPanel.prototype);
MCT.DisplayUIPanelMenu.prototype.constructor = MCT.DisplayUIPanelMenu;