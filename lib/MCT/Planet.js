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

// basic planet class is a game element

MCT.Planet = function(handle, metaConfig, technologyTree) {
  MCT.Element.call(this, handle);
  this.config = this.getConfig(handle, metaConfig);
  sizeScale = this.config.scale;
  unitsScale = this.config.scale;

  this.technologyTree = technologyTree;

  this.companyList = new MCT.PlanetCompanyList(
    handle, unitsScale, this.config.seed.companies, this.technologyTree.getConfig()
  );

  // every planet has a scale size factor from 0-200% or more whatever to calculate the units
  // grid unit size to calculate layout size / nodes
  var units = 25 * (unitsScale || 1.0); // default scale 100%
  this.grid = new MCT.PlanetGrid({ width: units, height: units });

  // original layout size to calculate positions and sizes of related display objects
  // the screen ratio from a scene will be used to calculate the real size
  // the element ratio is used to get an original size in relation to the scaled grid units
  var size = { width: 1000 * (sizeScale || 1.0), height: 1000 * (sizeScale || 1.0) };

  // add layout to arrange planet parts / objects
  this.layout = new MCT.PlanetLayout(
    this.grid, { elementHandle: 'planet', size: size, center: true }
  );
  this.layout.addHelperNodes({ image: "mct_planet_anuka", scale: { x: sizeScale, y: sizeScale } });

  // note: the click events for buildings ignores the move space interaction, like all
  // interactive sprites in front of the space background, but it might be useful to register an
  // additional mousedown interaction for buildings to dispatch the move space action event for
  // the space element, that might need some extensions ...
  this.layout.addBuilding(
    {
      name: "investmentsCenter", image: "investments_center",
      x: Math.floor(units * 0.5), y: Math.floor(units * 0.5),
      scale : { x: sizeScale, y: sizeScale },
      interaction : { type: "click", element: this, content: { action: "openInvestmentCenter" } }
    }
  );
  this.addEventListener('click', mct.util.getEventListener(this, "handleEvent"));
}

MCT.Planet.prototype = Object.create(MCT.Element.prototype);
MCT.Planet.prototype.constructor = MCT.Planet;

MCT.Planet.prototype.getConfig = function(handle, metaConfig) {
  var config = mct.util.loadJSON("./lib/data/planets/" + handle + ".json");
  // set language dependend names / descriptions
  for (var i = 0; i < config.name.length; i++) {
    if (typeof config.name[i] == "object") {
      config.name[i] = config.name[i][mct.userConfig.language];
    }
  }
  for (var i = 0; i < config.description.length; i++) {
    if (typeof config.description[i] == "object") {
      config.description[i] = config.description[i][mct.userConfig.language];
    }
  }
  $.extend(config, metaConfig);
  return config;
}

MCT.Planet.prototype.getName = function() {
  return this.config.name[this.config.currentVersion];
}

MCT.Planet.prototype.getDescription = function() {
  return this.config.description[this.config.currentVersion];
}

MCT.Planet.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "click":
      if (event.content.action == "openInvestmentCenter") {
        mct.audioHandler.playEffect("ef.click1");
      }
      break;
    case "windowMenuContent":
      if (typeof event.content.position == "number" && typeof event.content.buttons != "undefined") {
        switch (event.content.buttons[event.content.position].content) {
          case "technologyFieldTitles":
            var action = event.content.buttons[event.content.position].action;
            var technologyConfig = scope.technologyTree.getConfig();
            var p = 1;
            for (var fn in technologyConfig.fields) {
              if (typeof action[technologyConfig.fields[fn].typesMode] != "undefined") {
                var currentAction = action[technologyConfig.fields[fn].typesMode].slice(0);
                currentAction.push(fn);
                event.content.buttons.splice(
                  event.content.position + p, 0,
                  {
                    text : technologyConfig.fields[fn].title,
                    action : currentAction
                  }
                );
                p++;
              }
            }
            event.content.buttons.splice(event.content.position, 1);
            break;
          case "technologyFieldTypeTitles":
            if (typeof event.content.currentActionStatus != "undefined") {
              var currentTechField = event.content.currentActionStatus[0][2];
              var action = event.content.buttons[event.content.position].action;
              var technologyConfig = scope.technologyTree.getConfig();
              var p = 1;
              for (var tn in technologyConfig.fields[currentTechField].types) {
                var currentAction = action.slice(0);
                currentAction.push(tn);
                event.content.buttons.splice(
                  event.content.position + p, 0,
                  {
                    text : technologyConfig.fields[currentTechField].types[tn].title,
                    action : currentAction
                  }
                );
                p++;
              }
              event.content.buttons.splice(event.content.position, 1);
            }
            break;
        }
      }
      break;
    case "windowMainContent":
      if (typeof event.content.list != "undefined") {
        switch (event.content.list.content) {
          case "technologyCompanies":
            if (typeof event.content.currentActionStatus != "undefined") {
              var as = event.content.currentActionStatus;
              if (typeof as[1] == "object") {
                var list = scope.companyList.companies[as[0][2]][as[1][2]];
              } else {
                var list = scope.companyList.companies[as[0][2]];
              }

              var action = event.content.list.action;
              event.content.list = [];
              for (var i = 0; i < list.length; i++) {
                var currentAction = action.slice(0);
                currentAction.push(scope);
                currentAction.push(list[i]);
                event.content.list.push(
                  {
                    text : list[i].name,
                    action : currentAction
                  }
                );
              }
            }
            break;
        }
      }
      break;
  }
}