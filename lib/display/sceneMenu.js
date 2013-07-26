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

function displaySceneMenuAdd() {

  var scene = new PIXI.DisplayObjectContainer();

  // add rotating background
  var texture = PIXI.Texture.fromImage("gfx/mct_planet.png");
  var planet = new PIXI.Sprite(texture);
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.scale.x = baseValues.display.ratio * 1.5;
  planet.scale.y = baseValues.display.ratio * 1.5;

  planet.position.x = baseValues.display.width - baseValues.display.ratio * 100;
  planet.position.y = baseValues.display.height - baseValues.display.ratio * 100;

  scene.addChild(planet);
  baseValues.display.animate.push({object:planet,type:"rotation",value:0.0005});

  // add game logo
  texture = PIXI.Texture.fromImage("gfx/mct_logo.png");
  var logo = new PIXI.Sprite(texture);
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.scale.x = baseValues.display.ratio;
  logo.scale.y = baseValues.display.ratio;
  logo.position.x = baseValues.display.width / 2;
  logo.position.y = baseValues.display.height / 2;
  scene.addChild(logo);

  var txts = baseValues.pixi.text.styles.menutext1;

  // set menu title text
  var style = {font: Math.floor(txts[0] * baseValues.display.ratio) + "px " + txts[1], fill: txts[2]};
  var text = new PIXI.Text(baseValues.pixi.text.lang.lt00001, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = baseValues.display.width / 2;
  text.position.y = (baseValues.display.height / 2) - 250 * baseValues.display.ratio;
  scene.addChild(text);

  // set start button
  var texture = PIXI.Texture.fromImage("gfx/mct_menu_button.png");
  var startBtn = new PIXI.Sprite(texture);
  startBtn.anchor.x = 0.5;
  startBtn.anchor.y = 0.5;
  startBtn.scale.x = baseValues.display.ratio;
  startBtn.scale.y = baseValues.display.ratio;
  startBtn.position.x = (baseValues.display.width / 2) - 250 * baseValues.display.ratio;
  startBtn.position.y = (baseValues.display.height / 2) + 250 * baseValues.display.ratio;
  startBtn.setInteractive(true);
  startBtn.click = function(mouseData){
     displayScenePlanetAdd();
  }
  scene.addChild(startBtn);
  // add start button language text
  text = new PIXI.Text(baseValues.pixi.text.lang.lt00002, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = (baseValues.display.width / 2) - 250 * baseValues.display.ratio;
  text.position.y = (baseValues.display.height / 2) + 250 * baseValues.display.ratio;
  scene.addChild(text);

  // add quit button
  var quitBtn = new PIXI.Sprite(texture);
  quitBtn.anchor.x = 0.5;
  quitBtn.anchor.y = 0.5;
  quitBtn.scale.x = baseValues.display.ratio;
  quitBtn.scale.y = baseValues.display.ratio;
  quitBtn.position.x = (baseValues.display.width / 2) + 250 * baseValues.display.ratio;
  quitBtn.position.y = (baseValues.display.height / 2) + 250 * baseValues.display.ratio;
  quitBtn.setInteractive(true);
  quitBtn.click = function(mouseData){
    var gui = require('nw.gui');
    gui.App.closeAllWindows();
  }
  scene.addChild(quitBtn);
  // add quit button language text
  text = new PIXI.Text(baseValues.pixi.text.lang.lt00003, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = (baseValues.display.width / 2) + 250 * baseValues.display.ratio;
  text.position.y = (baseValues.display.height / 2) + 250 * baseValues.display.ratio;
  scene.addChild(text);

  // set scene
  baseValues.pixi.scenes.menu = scene;
  baseValues.pixi.currentScene = "menu";
  baseValues.pixi.scenes.menu.visible = true;
  baseValues.pixi.stage.addChild(baseValues.pixi.scenes.menu);

}

function displaySceneMenuToggle() {
  baseValues.pixi.scenes.menu.visible = (baseValues.pixi.scenes.menu.visible == true) ?
    false : true;
}