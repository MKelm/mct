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
      delete mct.intervals["fpsCounter"];
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

      // set last file modification time to validate version for debugging
      if (id == "surveyBugs") {
        String.prototype.replaceArray = function(find, replace) {
          var replaceString = this;
          for (var i = 0; i < find.length; i++) {
            replaceString = replaceString.replace(find[i], replace[i]);
          }
          return replaceString;
        };
        var fs = require('fs');
        var walk = function(dir, done) {
          var results = [];
          var str = "";
          var monthIn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          var monthOut = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
          fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
              var file = list[i++];
              if (file != '.git') {
                if (!file) return done(null, results);
                file = dir + '/' + file;
                fs.stat(file, function(err, stat) {
                  if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                      results = results.concat(res);
                      next();
                    });
                  } else {
                    str = String(stat.mtime).substring(4, 24).replaceArray(monthIn, monthOut);
                    results.push(
                      Number(str.substring(6,10) + str.substring(0,2) + str.substring(3,5) +
                        str.substring(11,13) + str.substring(14,16) + str.substring(17,19))
                    );
                    next();
                  }
                });
              } else {
                next();
              }
            })();
          });
        };
        var basePath = window.location.pathname.replace('/lib/display/default.html','');
        walk(basePath, function(err, results) {
          if (err) throw err;
          var lastMTime = String(Math.max.apply(null, results));
          lastMTime = lastMTime.substring(0, 4) + "-" + lastMTime.substring(4, 6) + "-" +
            lastMTime.substring(6, 8) + " " + lastMTime.substring(8, 10) + ":" +
            lastMTime.substring(10, 12) + ":" + lastMTime.substring(12, 14);
          $("#"+id).contents().find('#question8').eq(0).find('.text').eq(0).val(lastMTime);
        });
      }
    });

  }
}

