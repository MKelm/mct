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

// global mct object initialization

var mct = mct || {};

$(document).ready(function() {
  global.setTimeout(function() {
    mct.util = new MCT.Util();

    mct.version = new MCT.Version();
    mct.version.updateHashesFile(); // for maintainer

    mct.userConfig = mct.util.loadJSON('./user/data/config.json');
    mct.intervals = {};
    mct.pixi = new MCT.Pixi();
    mct.audioHandler = new MCT.AudioHandler();
    mct.sceneHandler = new MCT.DisplaySceneHandler();
    mct.game = new MCT.Game();

    mct.surveys = [
      new MCT.Survey("bugs"), new MCT.Survey("impressions"), new MCT.Survey("suggestions")
    ];

    // add/start the pixi renderer
    document.body.appendChild(mct.pixi.renderer.view);
    requestAnimFrame(mct.pixi.animate.curry(mct.pixi));

    mct.pixi.loadAssets(function() { mct.game.start(); });

  }, 0.00000001); // use timeout to detect fullscreen size correctly
});