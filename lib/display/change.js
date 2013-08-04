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
  if (mct.pixi.maxFps[mct.pixi.currentScene] > -1) {
    var maxFps = mct.pixi.maxFps[mct.pixi.currentScene];
    global.setTimeout(function() { requestAnimFrame(displayChangeAnimate); }, 1000 / maxFps );
  } else if (typeof mct.pixi.maxFps[mct.pixi.currentScene] == "undefined") {
    var maxFps = -1;
    requestAnimFrame(displayChangeAnimate);
  }

  displayChangeFpsCount();
  TWEEN.update();
  if (mct.pixi.animateCommands.length > 0) {
    for (var i = 0; i < mct.pixi.animateCommands.length; i++) {
      if (mct.pixi.animateCommands[i].type == "rotation") {
        // note: just an early, simple approach, which is not clean / finished yet
        // if we have no maxFps limit we have to use the fps counter to get a fixed speed
        maxFps = (maxFps == -1) ? 100 : maxFps;
        mct.pixi.animateCommands[i].object.rotation += mct.pixi.animateCommands[i].value * (1*(100 / maxFps));
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
  mct.pixi.scenes[current].visible = (mct.pixi.scenes[current].visible === true) ? false : true;
  // todo: backup / restore windows interactions to scenes on scene toggle
}

// hotkey F1 to enable / disable fps counter
$("html").keyup(function(e){
  if (e.which == 112){
    if (mct.status.pixi.fps[0] < 0) {
      mct.status.pixi.fps[0] = 0;
      mct.status.pixi.fps[1].visible = true;
      mct.status.intervals["fpsCounter"] = setInterval(displayChangeFpsCounter.curry(), 1000);
    } else {
      clearInterval(mct.status.intervals["fpsCounter"]);
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
    if (e.which == 113) {
      // hotkey F2 to enable / disable survey layer for bug reports
      displayChangeToggleSurvey('bugs', 'http://mct.shrt.ws/surveys/index.php/623132/lang-en');
    } else if (e.which == 114) {
      // hotkey F3 to enable / disable survey layer for impressions
      displayChangeToggleSurvey('impressions', 'http://mct.shrt.ws/surveys/index.php/642216/lang-en');
    } else if (e.which == 115) {
      // hotkey F4 to enable / disable survey layer for suggestions
      displayChangeToggleSurvey('suggestions', 'http://mct.shrt.ws/surveys/index.php/933278/lang-en');
    }
  });
}

function displayChangeToggleSurvey(type, url) {
  if (mct.status.pixi.survey[type] === true) {
    $('#'+type+'Survey').remove();
    $('#'+type+'SurveyTitle').remove();
    delete mct.status.pixi.survey[type];
  } else {
    var x = Math.ceil(50 * mct.pixi.screen.ratio);
    var y = Math.ceil(50 * mct.pixi.screen.ratio);
    var width = Math.ceil(mct.pixi.screen.width - (100 * mct.pixi.screen.ratio));
    $('body').append(
      '<iframe id="' + type + 'Survey" src="'+url+'" frameborder="0" '+
      'style="border: 1px solid white; background-color: white; position: fixed; top: '+
      x + 'px; left: ' + y + 'px; ' +
      'width: ' + width + 'px; height: ' +
      Math.ceil(mct.pixi.screen.height - (100 * mct.pixi.screen.ratio)) + 'px;"/>'
    );
    $('body').append(
      '<div id="' + type + 'SurveyTitle" style="background-color: black; opacity: 0.7; position: fixed; top: '
      + (x + Math.ceil(1 * mct.pixi.screen.ratio)) + 'px; left: ' + (y + Math.ceil(1 * mct.pixi.screen.ratio)) +
      'px; width: ' + width + 'px; height: ' + Math.ceil(50 * mct.pixi.screen.ratio) + 'px; color: white;">' +
      '<h2 style="font-size: ' + Math.ceil(25*mct.pixi.screen.ratio) + 'px; margin: '+
      Math.ceil(12*mct.pixi.screen.ratio) +'px ' + Math.ceil(12*mct.pixi.screen.ratio) + 'px">'
      + mct.pixi.text.lang["lt.survey."+type] + '</h2></div>'
    );
    mct.status.pixi.survey[type] = true;
    $("#"+type+'Survey').load(function (){
      displayChangeSurveyBindKeys($("#"+type+'Survey').contents().find('html').eq(0));
      // set os + cpu + renderer / version hash to validate version for debugging!!
      var qs = [];
      switch (type) {
        case "bugs":
          qs = [10, 11];
          break;
        case "impressions":
          qs = [12, 13];
          break;
        case "suggestions":
          qs = [20, 21]
          break;
      }
      var os = require('os');
      $("#"+type+'Survey').contents().find('#question'+qs[0]).eq(0).find('.text').eq(0).val(
        os.type() + " " + os.release() + " " + os.arch() + " " + os.cpus()[0]['model']
        + " x" + os.cpus().length + " " +
        ((true === Boolean($('html').find('canvas')[0].getContext("webgl"))) ? "WebGL" : "Canvas")
      );
      baseUtilVersionHash(function(hash) {
        $("#"+type+'Survey').contents().find('#question'+qs[1]).eq(0).find('.text').eq(0).val(hash);
      });
    });
  }
}