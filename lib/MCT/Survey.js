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

// MCT survey class

MCT.Survey = function(type) {
  this.active = false;
  this.type = type;
  this.lngTexts = mct.util.loadJSON(
    "./lib/data/display/txt/externals/surveys/lngs/"+ mct.userConfig.language +".json"
  );
  this.data = mct.util.loadJSON("./lib/data/surveys.json");
  this.bindKey($("html"));
}

MCT.Survey.prototype.constructor = MCT.Survey;

MCT.Survey.prototype.bindKey = function(element) {
  if (typeof this.data[this.type].hotkey != "undefined") {
    var scope = this;
    element.keyup(function(e){ if (e.which == scope.data[scope.type].hotkey) { scope.toggle(); } });
  }
}

MCT.Survey.prototype.toggle = function() {
  if (this.active === true) {
    $('#'+this.type+'Survey').remove();
    $('#'+this.type+'SurveyTitle').remove();
    this.active = false;
  } else {
    var x = Math.ceil(50 * mct.pixi.screen.ratio);
    var y = Math.ceil(50 * mct.pixi.screen.ratio);
    var width = Math.ceil(mct.pixi.screen.width - (100 * mct.pixi.screen.ratio));
    $('body').append(
      '<iframe id="' + this.type + 'Survey" src="'+ this.data[this.type].url +'" frameborder="0" '+
      'style="border: 1px solid white; background-color: white; position: fixed; top: '+
      x + 'px; left: ' + y + 'px; ' +
      'width: ' + width + 'px; height: ' +
      Math.ceil(mct.pixi.screen.height - (100 * mct.pixi.screen.ratio)) + 'px;"/>'
    );
    $('body').append(
      '<div id="' + this.type + 'SurveyTitle" style="background-color: black; opacity: 0.7; position: fixed; top: '
      + (x + Math.ceil(1 * mct.pixi.screen.ratio)) + 'px; left: ' + (y + Math.ceil(mct.pixi.screen.ratio)) +
      'px; width: ' + width + 'px; height: ' + Math.ceil(50 * mct.pixi.screen.ratio) + 'px; color: white;">' +
      '<h2 style="font-size: ' + Math.ceil(25*mct.pixi.screen.ratio) + 'px; margin: '+
      Math.ceil(12*mct.pixi.screen.ratio) +'px ' + Math.ceil(12*mct.pixi.screen.ratio) + 'px">'
      + this.lngTexts["lt.survey."+ this.type] + '</h2></div>'
    );
    this.active = true;
    var scope = this;
    $("#"+this.type+'Survey').load(function (){
      scope.bindKey($("#"+ scope.type +'Survey').contents().find('html').eq(0));
      // set os + cpu + renderer / version hash to validate version for debugging!!
      var qs = scope.data[scope.type].autofill;
      var os = require('os');
      $("#"+ scope.type +'Survey').contents().find('#question'+qs[0]).eq(0).find('.text').eq(0).val(
        os.type() + " " + os.release() + " " + os.arch() + " " + os.cpus()[0]['model']
        + " x" + os.cpus().length + " " +
        ((true === Boolean($('html').find('canvas')[0].getContext("webgl"))) ? "WebGL" : "Canvas")
      );
      mct.version.getVersionHash(function(hash) {
        $("#"+ scope.type +'Survey').contents().find('#question'+qs[1]).eq(0).find('.text').eq(0).val(hash);
      });
    });
  }
}