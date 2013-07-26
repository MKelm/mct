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

  baseGameInitPlanet();

  var scene = new PIXI.DisplayObjectContainer();

  // add rotating background
  var texture = PIXI.Texture.fromImage("gfx/mct_planet.png");
  var planet = new PIXI.Sprite(texture);
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.scale.x = mct.display.ratio;
  planet.scale.y = mct.display.ratio;

  planet.position.x = (mct.display.width / 2) + 130 * mct.display.ratio;
  planet.position.y = mct.display.height / 2;

  mct.display.animate.push({object:planet,type:"rotation",value:0.0005});

  scene.addChild(planet);

  // set scene, for further planets scenes with planet keys are needed
  displayCurrentSceneToggle();
  mct.pixi.scenes.planet = scene;
  mct.pixi.currentScene = "planet";
  mct.pixi.scenes.planet.visible = true;
  mct.pixi.stage.addChild(mct.pixi.scenes.planet);

  // first attempt to add a planet companies list
  //displayScenePlanetCompaniesListAdd();

  // second attempt to add a planet companies list by using a popup (builder)
  displayPopupAdd(
    'planetcompanies',
    'popups/planetCompanies.json',
    {
      "technologyfieldstype" : [ ],
      "technologyfieldstypes" : [ ]
    }
  );
}

function displayScenePlanetToggle() {
  mct.pixi.scenes.planet.visible = (mct.pixi.scenes.planet.visible == true) ?
    false : true;
}

// experimental content

function displayScenePlanetCompaniesListAdd() {
  mct.pixi.scenes.interactions.planetCompaniesList = {};

  var scene = new PIXI.DisplayObjectContainer();

  var listBoxBaseWidth = 1024;
  var listBoxBaseHeight = 600;
  var listBoxTopLeftX = mct.display.width / 2 - (listBoxBaseWidth / 2) * mct.display.ratio;
  var listBoxTopLeftY = mct.display.height / 2 - (listBoxBaseHeight / 2) * mct.display.ratio;
  var listBoxBorderSize = 4 * mct.display.ratio;
  var listBoxGfx = new PIXI.Graphics();
  listBoxGfx.beginFill(0xFFFF00);
  listBoxGfx.lineStyle(listBoxBorderSize, 0xFF0000);
  listBoxGfx.drawRect(
    listBoxTopLeftX,
    listBoxTopLeftY,
    listBoxBaseWidth * mct.display.ratio,
    listBoxBaseHeight * mct.display.ratio
  );
  scene.addChild(listBoxGfx);

  // set window title text
  var txts = mct.pixi.text.styles.planetcompaniestitle1;
  var style = {font: Math.floor(txts[0] * mct.display.ratio) + "px " + txts[1], fill: txts[2]};
  var planetText = mct.pixi.text.lang[
    mct.game.planets[mct.game.planets.current[0]].name[mct.game.planets.current[1]]
  ];
  var titleText = new PIXI.Text(mct.pixi.text.lang.lt00004 + " " + planetText, style);
  titleText.position.x = listBoxTopLeftX + listBoxBorderSize + 10 * mct.display.ratio;
  titleText.position.y = listBoxTopLeftY + listBoxBorderSize + 10 * mct.display.ratio;
  scene.addChild(titleText);

  // set window menu text
  txts = mct.pixi.text.styles.planetcompaniesmenu1;
  style = {font: Math.floor(txts[0] * mct.display.ratio) + "px " + txts[1], fill: txts[2]};
  var lastTextWidth = 0;
  for (var fp in mct.game.data.technologies.fields) {

    var menuText = new PIXI.Text(mct.pixi.text.lang[mct.game.data.technologies.fields[fp].title], style);
    menuText.position.x = listBoxTopLeftX + listBoxBorderSize + (10 * mct.display.ratio) + lastTextWidth;
    menuText.position.y = listBoxTopLeftY + listBoxBorderSize + (20 * mct.display.ratio) + titleText.height;

    var menuBtn = new PIXI.Sprite(PIXI.Texture.fromImage("gfx/blank.png"));
    menuBtn.width = menuText.width;
    menuBtn.height = menuText.height;
    menuBtn.position.x = menuText.position.x;
    menuBtn.position.y = menuText.position.y;
    menuBtn.setInteractive(true);
    mct.pixi.scenes.interactions.planetCompaniesList[menuBtn.position.x + " " + menuBtn.position.y] = fp;
    menuBtn.click = function(mouseData) {
       var tf = mct.pixi.scenes.interactions.planetCompaniesList[
         mouseData.target.position.x + " " + mouseData.target.position.y
       ];
       // open technology field menu
       if (mct.game.data.technologies.fields[tf].companies.for == "type") {
         displayScenePlanetCompaniesFieldMenuAdd(tf);
       } else {
         // open field companies menu
         displayScenePlanetCompaniesListContentAdd(tf);
       }
    }
    scene.addChild(menuBtn);
    delete menuBtn;

    scene.addChild(menuText);
    lastTextWidth += menuText.width + 10 * mct.display.ratio;
    console.log(lastTextWidth);
  }

  // set scene, for further planets scenes with planet keys are needed
  mct.pixi.scenes.planetCompaniesList = scene;
  mct.pixi.currentScene = "planetCompaniesList";
  mct.pixi.scenes.planetCompaniesList.visible = true;
  mct.pixi.stage.addChild(mct.pixi.scenes.planetCompaniesList);
}

function displayScenePlanetCompaniesFieldMenuAdd(field) {
  displayScenePlanetCompaniesListContentAdd(field, 'type');
}

function displayScenePlanetCompaniesListContentAdd(field, type, topOffset) {
  var txts = mct.pixi.text.styles.planetcompanieslist1;
  var style = {font: Math.floor(txts[0] * mct.display.ratio) + "px " + txts[1], fill: txts[2]};

  if (type == undefined) {
    // show companies with mixed types
    for (var i = 0; i < mct.game.planets.anuka.companies.valid[field].length; i++) {
      console.log(mct.game.planets.anuka.companies.valid[field][i].name);

      var companyText = new PIXI.Text(mct.game.planets.anuka.companies.valid[field][i].name, style);


    }
  } else {
    console.log(2);
  }
}
