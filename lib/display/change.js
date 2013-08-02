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

// function for animation changes for renderer
// commands for pixi animate uses mct.pixi.animateCommands from init.js
function displayChangeAnimate() {
  requestAnimFrame(displayChangeAnimate);
  displayChangeFpsCount();
  TWEEN.update();
  if (mct.pixi.animateCommands.length > 0) {
    for (var i = 0; i < mct.pixi.animateCommands.length; i++) {
      if (mct.pixi.animateCommands[i].type == "rotation") {
        mct.pixi.animateCommands[i].object.rotation += mct.pixi.animateCommands[i].value;
      }
    }
  }
  // render the stage
  mct.pixi.renderer.render(mct.pixi.stage);
}

// function for change scene commands
function displaySceneToggle(current) {
  if (typeof current == "undefined") {
    current = mct.pixi.scenes.current;
  }
  mct.pixi.scenes[current].visible = (mct.pixi.scenes[current].visible == true) ? false : true;
  // todo: backup / restore windows interactions to scenes on scene toggle
}

// hotkey F1 to enable / disable fps counter
$("html").keyup(function(e){
  if (e.which == 112){
    if (mct.status.pixi.fps[0] < 0) {
      mct.status.pixi.fps[0] = 0;
      mct.status.pixi.fps[1].visible = true;
      mct.setTimeout(function(){ displayChangeFpsCounter(); }, 1000, "fpsCounter");
    } else {
      delete mct.status.intervals["fpsCounter"];
      mct.status.pixi.fps[0] = -1;
      mct.status.pixi.fps[1].visible = false;
    }
  }
});

function displayChangeFpsCount() {
  if (mct.status.pixi.fps[0] > -1) {
    mct.status.pixi.fps[0]++;
  }
}

function displayChangeFpsCounter() {
  mct.status.pixi.fps[1].setText(mct.status.pixi.fps[0]);
  mct.status.pixi.fps[0] = 0;
}

displayChangeSurveyBindKeys($("html"));

function displayChangeSurveyBindKeys(element) {
  element.keyup(function(e){
    if (e.which == 113){
      // hotkey F2 to enable / disable survey layer for bug reports
      displayChangeToggleSurvey('surveyBugs', 'http://mct.shrt.ws/surveys/index.php/623132/lang-en');
    } else if (e.which == 114){
      // hotkey F3 to enable / disable survey layer for general questions
      displayChangeToggleSurvey('surveyGeneral', 'http://mct.shrt.ws/surveys/index.php/642216/lang-en');
    }
  });
}

function displayChangeToggleSurvey(id, url) {
  if (mct.status.pixi.survey[id] == true) {
    $('#'+id).remove();
    delete mct.status.pixi.survey[id];
  } else {
    $('body').append(
      '<iframe id="' + id + '" src="'+url+'" style="position: fixed; top: '+
      Math.ceil(50 * mct.pixi.screen.ratio) + 'px; left: ' + Math.ceil(50 * mct.pixi.screen.ratio) + 'px; ' +
      'width: ' + Math.ceil(mct.pixi.screen.width - (100 * mct.pixi.screen.ratio)) + 'px; height: ' +
      Math.ceil(mct.pixi.screen.height - (100 * mct.pixi.screen.ratio)) + 'px;"/>'
    );
    mct.status.pixi.survey[id] = true;
    $("#"+id).load(function (){
      displayChangeSurveyBindKeys($("#"+id).contents().find('html').eq(0));
      // set os + cpu + renderer / version hash to validate version for debugging!!
      var os = require('os');
      $("#"+id).contents().find('#question10').eq(0).find('.text').eq(0).val(
        os.type() + " " + os.release() + " " + os.arch() + " " + os.cpus()[0]['model']
        + " x" + os.cpus().length + " " +
        ((false === !$('html').find('canvas')[0].getContext("webgl")) ? "WebGL" : "Canvas")
      );
      baseUtilVersionHash(function(hash) {
        $("#"+id).contents().find('#question11').eq(0).find('.text').eq(0).val(hash)
      });
    });
  }
}