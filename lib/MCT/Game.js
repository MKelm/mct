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
  MCT.Element.call(this, "game", false, true);

  this.spaces = {};
  this.planets = { config: mct.util.loadJSON('./lib/data/planets.json') };
  this.technologyTree = new MCT.TechnologyTree();
  this.panels = {};
  this.stepCount = 0;

  mct.intervals.gameStep = setInterval(this.step.curry(this), 1000);
}

MCT.Game.prototype = Object.create(MCT.Element.prototype);
MCT.Game.prototype.constructor = MCT.Game;

MCT.Game.prototype.step = function(scope) {
  scope.stepCount++;
  // each second == 1 step, 180 steps == 1 turn
  if (scope.stepCount % 180 == 0) {
    scope.dispatchEvent({ type: "turn", content: scope });
  }
}

MCT.Game.prototype.initializeSpaces = function() {
  // first we need a planet element for earth / anuka with a space scene!
  this.planets = {
    anuka : new MCT.Planet("anuka", this.planets.config, this.technologyTree)
  };
  this.spaces = {
    "start" : new MCT.Space(1.0, 1.0, this.planets)
  };
}

MCT.Game.prototype.initializePanels = function() {
  var dynEventTexts = {
    dynEventTitle: "lt.dynEventTitle",
    dynEventDescription: "lt.dynEventDescription",
    dynEventWinMessage: "lt.dynEventWinMessage",
    dynEventFailMessage: "lt.dynEventFailMessage"
  };
  var dynPlanetComapaniesTexts = {
    dynPlanetTitle: this.planets.anuka.getName()
  };
  this.panels = {
    mainMenu : new MCT.DisplayUIPanelMainMenu(),
    windowStartMsg : new MCT.DisplayUIPanelWindow(
      "wwelcomemsg", { dynTexts : dynEventTexts }, "event/message"
    ),
    windowSpaceMsg : new MCT.DisplayUIPanelWindow(
      "wspacemsg", { dynTexts: dynEventTexts}, "event/message"
    ),
    windowPlanetCompanies : new MCT.DisplayUIPanelWindow(
      "wplanetcompanies", { dynTexts : dynPlanetComapaniesTexts }, "planet/companies", true
    )
  };
  // set planet listener for window action events
  this.panels.windowPlanetCompanies.addEventListener(
    'windowMenuContent', mct.util.getEventListener(this.planets.anuka, "handleEvent")
  );
  this.panels.windowPlanetCompanies.addEventListener(
    'windowMainContent', mct.util.getEventListener(this.planets.anuka, "handleEvent")
  );
  this.panels.windowPlanetCompanies.initialize();
}

MCT.Game.prototype.start = function() {

  mct.audioHandler.setPlayers();
  mct.audioHandler.nextPlaylistTrack();

  this.initializeSpaces();
  this.initializePanels();

  mct.sceneHandler.addScene(
    'mainmenu', [ this.panels.mainMenu, this.panels.windowStartMsg ]
  );
  mct.sceneHandler.addScene(
    'space', [ this.spaces.start, this.panels.windowPlanetCompanies, this.panels.windowSpaceMsg ]
  );

  mct.sceneHandler.showScene('space');

}