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
  this.audioHandler = new MCT.AudioHandler();;
  this.sceneHandler = new MCT.DisplaySceneHandler(pixi); // todo: a seperate pixi class later!!
}

MCT.Game.prototype.constructor = MCT.Game;

MCT.Game.prototype.initialize = function() {

  this.audioHandler.setPlayers();
  this.audioHandler.nextPlaylistTrack();

  // first we need a planet element for earth / anuka
  this.elements.planets = {
    anuka : new MCT.Planet("anuka", 1.0, 1.0)
  }

  // add a new planet scene with anuka
  this.sceneHandler.addScene('planet', this.elements.planets.anuka);

}