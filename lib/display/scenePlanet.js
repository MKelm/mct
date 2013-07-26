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

  baseGameInit();

  var scene = new PIXI.DisplayObjectContainer();

  // add rotating background
  var texture = PIXI.Texture.fromImage("gfx/mct_planet.png");
  var planet = new PIXI.Sprite(texture);
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.scale.x = baseValues.display.ratio;
  planet.scale.y = baseValues.display.ratio;

  planet.position.x = (baseValues.display.width / 2) + 130 * baseValues.display.ratio;
  planet.position.y = baseValues.display.height / 2;

  baseValues.display.animate.push({object:planet,type:"rotation",value:0.0005});

  scene.addChild(planet);

  // set scene
  displayCurrentSceneToggle();
  baseValues.pixi.scenes.planet = scene;
  baseValues.pixi.currentScene = "planet";
  baseValues.pixi.scenes.planet.visible = true;
  baseValues.pixi.stage.addChild(baseValues.pixi.scenes.planet);

}

function displayScenePlanetToggle() {
  baseValues.pixi.scenes.planet.visible = (baseValues.pixi.scenes.planet.visible == true) ?
    false : true;
}
