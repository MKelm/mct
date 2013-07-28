/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mkelm/mct
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

function displayScenePlanetAdd() {

  baseGameInitPlanet();

  var scene = new PIXI.DisplayObjectContainer();

  // add rotating background
  var planet = new PIXI.Sprite.fromFrame("mct_planet.png");
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.scale.x = mct.display.ratio;
  planet.scale.y = mct.display.ratio;

  planet.position.x = (mct.display.width / 2) + 130 * mct.display.ratio;
  planet.position.y = mct.display.height / 2;

  mct.display.animate.push({object:planet,type:"rotation",value:0.0005});

  scene.addChild(planet);

  // set scene, for further planets scenes with planet keys are needed
  displayCurrentSceneToggle();
  mct.pixi.scenes.planet = scene;
  mct.pixi.currentScene = "planet";
  mct.pixi.scenes.planet.visible = true;
  mct.pixi.stage.addChild(mct.pixi.scenes.planet);

  // first attempt to add a planet companies list
  //displayScenePlanetCompaniesListAdd();

  // second attempt to add a planet companies list by using a popup (builder)
  var technologyFieldsTypeElements = [];
  var technologyFieldsTypesElements = [];
  for (var fp in mct.game.data.technologies.fields) {
    if (mct.game.data.technologies.fields[fp].companies.for == 'type') {
      technologyFieldsTypeElements.push([fp, mct.game.data.technologies.fields[fp].title]);
    } else {
      technologyFieldsTypesElements.push([fp, mct.game.data.technologies.fields[fp].title]);
    }
  }
  displayPopupAdd(
    'planetcompanies',
    'popups/planetCompanies.json',
    {}, // dynamic texts
    {
      "technologyfieldstype" : technologyFieldsTypeElements,
      "technologyfieldstypes" : technologyFieldsTypesElements
    } // dynamic button elements
  );
}

function displayScenePlanetToggle() {
  mct.pixi.scenes.planet.visible = (mct.pixi.scenes.planet.visible == true) ?
    false : true;
}