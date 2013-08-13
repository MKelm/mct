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

MCT.Game = function() {
  this.elements = {}; // all game elements

  this.technologyTree = new MCT.TechnologyTree();
}

MCT.Game.prototype.constructor = MCT.Game;

MCT.Game.prototype.start = function() {

  mct.audioHandler.setPlayers();
  mct.audioHandler.nextPlaylistTrack();

  // first we need a planet element for earth / anuka with a space scene!
  this.elements.planets = {
    anuka : new MCT.Planet("anuka")
  };
  var dynTexts = {
    dynPlanetTitle: this.elements.planets.anuka.name // todo: use a title from a config file later
  };
  var dynEventTexts = {
    dynEventTitle: "lt.dynEventTitle",
    dynEventDescription: "lt.dynEventDescription",
    dynEventWinMessage: "lt.dynEventWinMessage",
    dynEventFailMessage: "lt.dynEventFailMessage"
  };
  this.elements.panels = {
    windowPlanetCompanies : new MCT.DisplayUIPanelWindow("wplanetcompanies", { dynTexts : dynTexts }, "planet/companies"),
    windowSpaceMsg : new MCT.DisplayUIPanelWindow("wspacemsg", { dynTexts: dynEventTexts}, "event/message")
  };
  this.elements.space = new MCT.Space(1.0, 1.0, this.elements.planets);
  mct.sceneHandler.addScene('space',
    { space: this.elements.space,
      window: this.elements.panels.windowPlanetCompanies,
      windowSpaceMsg: this.elements.panels.windowSpaceMsg  }
  );

  // and a menu scene to show first
  this.elements.panels.menu = new MCT.DisplayUIPanelMenu();
  this.elements.panels.windowWelcomeMsg = new MCT.DisplayUIPanelWindow(
    "wwelcomemsg", { dynTexts : dynEventTexts }, "event/message"
  );
  mct.sceneHandler.addScene(
    'menu', { menu: this.elements.panels.menu, window: this.elements.panels.windowWelcomeMsg }
  );
  mct.sceneHandler.showScene('space');

}