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

// game class so setup and deligate (between) game related objects
// the class can contain re-factored logic from the first pre-alpha phase
// the logic can be sepereted more and more in future

MCT.Game = function(pixi) {
  this.elements = { }; // all game elements
  this.pixi = pixi; // contains wrapper object for pixi elements
}

MCT.Game.prototype.constructor = MCT.Game;

MCT.Game.prototype.initialize = function() {
  // this initialization contains an approach by using new framework classes for the planet scene only yet!
  // the game needs more logic to manage scenes later in a seperate file!!!

  var layouts = [];
  for (var pp in this.elements) {
    if (elements.layout instanceof MCT.Layout) {
      layouts.push(elements.layout);
    }
  }
  var scene = DisplayScene(this.pixi, layouts);

}
