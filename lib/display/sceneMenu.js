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

  planet.scale.x = mct.display.ratio * 1.5;
  planet.scale.y = mct.display.ratio * 1.5;

  planet.position.x = mct.display.width - mct.display.ratio * 100;
  planet.position.y = mct.display.height - mct.display.ratio * 100;

  scene.addChild(planet);
  mct.display.animate.push({object:planet,type:"rotation",value:0.0005});

  // add game logo
  texture = PIXI.Texture.fromImage("gfx/mct_logo.png");
  var logo = new PIXI.Sprite(texture);
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.scale.x = mct.display.ratio;
  logo.scale.y = mct.display.ratio;
  logo.position.x = mct.display.width / 2;
  logo.position.y = mct.display.height / 2;
  scene.addChild(logo);

  // set menu / game title text
  var txts = mct.pixi.text.styles.gametitle1;
  var style = {font: Math.floor(txts[0] * mct.display.ratio) + "px " + txts[1], fill: txts[2]};
  var text = new PIXI.Text(mct.pixi.text.lang.lt00001, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = mct.display.width / 2;
  text.position.y = (mct.display.height / 2) - 250 * mct.display.ratio;
  scene.addChild(text);

  // set start button
  var texture = PIXI.Texture.fromImage("gfx/mct_menu_button.png");
  var startBtn = new PIXI.Sprite(texture);
  startBtn.anchor.x = 0.5;
  startBtn.anchor.y = 0.5;
  startBtn.scale.x = mct.display.ratio;
  startBtn.scale.y = mct.display.ratio;
  startBtn.position.x = (mct.display.width / 2) - 250 * mct.display.ratio;
  startBtn.position.y = (mct.display.height / 2) + 250 * mct.display.ratio;
  startBtn.setInteractive(true);
  startBtn.click = function(mouseData){
     displayScenePlanetAdd();
  }
  scene.addChild(startBtn);
  // add start button language text
  txts = mct.pixi.text.styles.menubutton1;
  style = {font: Math.floor(txts[0] * mct.display.ratio) + "px " + txts[1], fill: txts[2]};
  text = new PIXI.Text(mct.pixi.text.lang.lt00002, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = (mct.display.width / 2) - 250 * mct.display.ratio;
  text.position.y = (mct.display.height / 2) + 250 * mct.display.ratio;
  scene.addChild(text);

  // add quit button
  var quitBtn = new PIXI.Sprite(texture);
  quitBtn.anchor.x = 0.5;
  quitBtn.anchor.y = 0.5;
  quitBtn.scale.x = mct.display.ratio;
  quitBtn.scale.y = mct.display.ratio;
  quitBtn.position.x = (mct.display.width / 2) + 250 * mct.display.ratio;
  quitBtn.position.y = (mct.display.height / 2) + 250 * mct.display.ratio;
  quitBtn.setInteractive(true);
  quitBtn.click = function(mouseData){
    var gui = require('nw.gui');
    gui.App.closeAllWindows();
  }
  scene.addChild(quitBtn);
  // add quit button language text
  text = new PIXI.Text(mct.pixi.text.lang.lt00003, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = (mct.display.width / 2) + 250 * mct.display.ratio;
  text.position.y = (mct.display.height / 2) + 250 * mct.display.ratio;
  scene.addChild(text);

  // set scene
  mct.pixi.scenes.menu = scene;
  mct.pixi.currentScene = "menu";
  mct.pixi.scenes.menu.visible = true;
  mct.pixi.stage.addChild(mct.pixi.scenes.menu);

}

function displaySceneMenuToggle() {
  mct.pixi.scenes.menu.visible = (mct.pixi.scenes.menu.visible == true) ?
    false : true;
}