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

function displayMenuAdd() {

  // set menu title text
  var style = {font: Math.floor(50 * baseValues.display.ratio) + "px Arial", fill:"red"};
  var text = new PIXI.Text("Mass Control Tycoon", style);

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;

  text.position.x = baseValues.display.width / 2;
  text.position.y = (baseValues.display.height / 2) - 250 * baseValues.display.ratio;

  baseValues.pixi.stage.addChild(text);

  // set start / quit button

  var texture = PIXI.Texture.fromImage("gfx/menu_button_start.png");
  var startBtn = new PIXI.Sprite(texture);
  startBtn.anchor.x = 0.5;
  startBtn.anchor.y = 0.5;
  startBtn.scale.x = baseValues.display.ratio;
  startBtn.scale.y = baseValues.display.ratio;
  startBtn.position.x = (baseValues.display.width / 2) - 250 * baseValues.display.ratio;
  startBtn.position.y = (baseValues.display.height / 2) + 250 * baseValues.display.ratio;

  startBtn.setInteractive(true);
  startBtn.click = function(mouseData){
     alert("START!");
  }

  baseValues.pixi.stage.addChild(startBtn);

  texture = PIXI.Texture.fromImage("gfx/menu_button_quit.png");
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

  baseValues.pixi.stage.addChild(quitBtn);

}
