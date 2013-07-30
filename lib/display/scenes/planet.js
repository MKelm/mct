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

  // stop loop effect demo
  audioStopEffect("ef.birds1", true);

  baseGameInitPlanet();

  var scene = new PIXI.DisplayObjectContainer();

  // add rotating background
  var planet = new PIXI.Sprite.fromFrame("mct_planet");
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.scale.x = mct.pixi.screen.ratio;
  planet.scale.y = mct.pixi.screen.ratio;

  planet.position.x = (mct.pixi.screen.width / 2) + 130 * mct.pixi.screen.ratio;
  planet.position.y = mct.pixi.screen.height / 2;

  mct.pixi.animateCommands.push({object:planet,type:"rotation",value:0.0005});

  scene.addChild(planet);

  // set scene, for further planets scenes with planet keys are needed
  mct.pixi.scenes.current = "planet";
  mct.pixi.scenes.planet = scene;
  mct.pixi.scenes.planet.visible = true;
  mct.pixi.stage.addChild(mct.pixi.scenes.planet);

  // first attempt to add a planet companies list
  //displayScenePlanetCompaniesListAdd();

  // second attempt to add a planet companies list by using a popup (builder)
  var technologyFieldsForTypeElements = [];
  // the following var contains types for each field for single type
  // it has to be an object, because the properties depend on the parameter (element handle) of the parent layer
  // to get the right menu elements in the new layer
  var technologyFieldTypesElements = {};
  var technologyFieldsForTypesElements = [];
  for (var fp in mct.data.technologies.fields) {
    if (mct.data.technologies.fields[fp].companies.for == 'type') {
      technologyFieldsForTypeElements.push([fp, mct.data.technologies.fields[fp].title]);
      technologyFieldTypesElements[fp] = [];
      for (var tp in mct.data.technologies.fields[fp].types) {
        technologyFieldTypesElements[fp].push([tp, mct.data.technologies.fields[fp].types[tp].title]);
      }
    } else {
      technologyFieldsForTypesElements.push([fp, mct.data.technologies.fields[fp].title]);
    }
  }
  displayWindowAdd(
    'planetcompanies',
    'scenes/planet/windows/companies.json',
    {}, // dynamic texts
    {
      "technologyfieldsfortype" : technologyFieldsForTypeElements,
      "technologyfieldtypes" : technologyFieldTypesElements,
      "technologyfieldsfortypes" : technologyFieldsForTypesElements
    } // dynamic button elements
  );
}