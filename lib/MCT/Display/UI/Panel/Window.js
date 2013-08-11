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

// display ui panel window class
// a windos is a base panel and can contain layer panels

MCT.DisplayUIPanelWindow = function(name, unitSize, position) {
  MCT.DisplayUIPanel.call(this, name | "window" + Math.random() * 1000, unitSize, position);

  this.layers = {}

}

MCT.DisplayUIPanelWindow.prototype = Object.create(MCT.DisplayUIPanel.prototype);
MCT.DisplayUIPanelWindow.prototype.constructor = MCT.DisplayUIPanelWindow;