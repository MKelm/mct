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

function displaySceneMenuAdd() {

  // start loop effect demo
  audioPlayEffect("ef.birds1", true);

  var scene = new PIXI.DisplayObjectContainer();

  // add rotating background
  var planet = new PIXI.Sprite.fromFrame("mct_planet");
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.scale.x = mct.pixi.screen.ratio * 1.5;
  planet.scale.y = mct.pixi.screen.ratio * 1.5;

  planet.position.x = mct.pixi.screen.width - mct.pixi.screen.ratio * 100;
  planet.position.y = mct.pixi.screen.height - mct.pixi.screen.ratio * 100;

  scene.addChild(planet);
  mct.pixi.animateCommands.push({object:planet,type:"rotation",value:0.0005});

  // tween test implementation
  var tween = new TWEEN.Tween( { x: planet.position.x, y: planet.position.x  } )
    .to( { y: planet.position.y - 100, x: planet.position.x - 100 }, 10000 )
    .easing( TWEEN.Easing.Elastic.InOut )
    .onUpdate( function () {
        planet.position.x = this.x;
        planet.position.y = this.y;
    } )
    .start()
    .delay(1000);

  // add game logo
  var logo = new PIXI.Sprite.fromFrame("mct_logo");
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.scale.x = mct.pixi.screen.ratio;
  logo.scale.y = mct.pixi.screen.ratio;
  logo.position.x = mct.pixi.screen.width / 2;
  logo.position.y = mct.pixi.screen.height / 2;
  scene.addChild(logo);

  // set menu / game title text
  var txts = mct.pixi.text.styles.gametitle1;
  var style = {font: Math.floor(txts[0] * mct.pixi.screen.ratio) + "px " + txts[1], fill: txts[2]};
  var text = new PIXI.Text(mct.pixi.text.lang["lt.1.1.1"], style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = mct.pixi.screen.width / 2;
  text.position.y = (mct.pixi.screen.height / 2) - 250 * mct.pixi.screen.ratio;
  scene.addChild(text);

  // set start button
  var startBtn = new PIXI.Sprite.fromFrame("mct_menu_button");
  startBtn.anchor.x = 0.5;
  startBtn.anchor.y = 0.5;
  startBtn.scale.x = mct.pixi.screen.ratio;
  startBtn.scale.y = mct.pixi.screen.ratio;
  startBtn.position.x = (mct.pixi.screen.width / 2) - 250 * mct.pixi.screen.ratio;
  startBtn.position.y = (mct.pixi.screen.height / 2) + 250 * mct.pixi.screen.ratio;
  startBtn.setInteractive(true);
  startBtn.click = function(mouseData){
     audioPlayEffect("ef.click2");
     displaySceneToggle();
     displayScenePlanetAdd();
  }
  scene.addChild(startBtn);
  // add start button language text
  txts = mct.pixi.text.styles.menubutton1;
  style = {font: Math.floor(txts[0] * mct.pixi.screen.ratio) + "px " + txts[1], fill: txts[2]};
  text = new PIXI.Text(mct.pixi.text.lang["lt.1.1.2"], style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = (mct.pixi.screen.width / 2) - 250 * mct.pixi.screen.ratio;
  text.position.y = (mct.pixi.screen.height / 2) + 250 * mct.pixi.screen.ratio;
  scene.addChild(text);

  // add quit button
  var quitBtn = new PIXI.Sprite.fromFrame("mct_menu_button");
  quitBtn.anchor.x = 0.5;
  quitBtn.anchor.y = 0.5;
  quitBtn.scale.x = mct.pixi.screen.ratio;
  quitBtn.scale.y = mct.pixi.screen.ratio;
  quitBtn.position.x = (mct.pixi.screen.width / 2) + 250 * mct.pixi.screen.ratio;
  quitBtn.position.y = (mct.pixi.screen.height / 2) + 250 * mct.pixi.screen.ratio;
  quitBtn.setInteractive(true);
  quitBtn.click = function(mouseData){
    audioPlayEffect("ef.click2");
    global.setTimeout(
      function() {
        var gui = require('nw.gui');
        gui.App.closeAllWindows();
      }, 500
    );
  }
  scene.addChild(quitBtn);
  // add quit button language text
  text = new PIXI.Text(mct.pixi.text.lang["lt.1.1.3"], style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = (mct.pixi.screen.width / 2) + 250 * mct.pixi.screen.ratio;
  text.position.y = (mct.pixi.screen.height / 2) + 250 * mct.pixi.screen.ratio;
  scene.addChild(text);

  // set scene
  mct.pixi.scenes.current = "menu";
  mct.pixi.scenes.menu = scene;
  mct.pixi.scenes.menu.visible = true;
  mct.pixi.stage.addChild(mct.pixi.scenes.menu);

  displayObjectBirdAdd(scene);

  // event message window, a welcome event for pre-alpha testers :)
  displayWindowAdd(
    'eventmessage',
    'scenes/events/windows/message.json',
    {
      "dynEventTitle" : "Welcome to your control center",
      "dynEventDescription" :
        ["You are a master of control, you can click on start and quit or ",
         "listen to the crazy birds all around this acid planet in the background. ",
         "Their chemical reactions migth be critical, but be becalmed that is not a ",
         "bug. If you want to listen to music use the controls in the lower ",
         "right corner."],
      "dynEventWinMessage" : "- You won some experiences in launching a pre-alpha game.",
      "dynEventFailMessage" :
        ["- But you failed to react quickly enough to close it, ",
         "now you are addicted to play more of it."]
    } // dynamic texts
  );
}