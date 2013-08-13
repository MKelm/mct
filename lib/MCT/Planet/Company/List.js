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

// planet company list to manage companies on a planet

MCT.PlanetCompanyList = function(planetHandle, planetScale, planetSeed, technologyConfig) {
  this.companies = {};

  // the max amount of companies on a planet depends on the planetScale (units) and the scale
  // value from the planet seed configuration
  var companyScale = planetScale / planetSeed.scale;

  // get company seed configuration by technology fields
  var companyNames = {};
  for (var fn in planetSeed) {
    if (fn != "scale") {
      companyNames = {
        list: mct.util.loadJSON("./lib/data/planets/" + planetHandle + "/companies/"+ fn +"/names.json"),
        used: []
      };

      if (planetSeed[fn].types == "combined") {
        // companies use one tech field with combined technology types
        this.companies[fn] = [];
        for (var i = 0; i < Math.floor(planetSeed[fn].amount * companyScale); i++) {
          this.companies[fn].push(
            new MCT.PlanetCompany(this.getRandomName(companyNames))
          );
        }
      } else if (planetSeed[fn].types == "each") {
        // companies use one tech field with multiple technology types
        this.companies[fn] = {};
        for (var tn in technologyConfig.fields[fn].types) {
          this.companies[fn][tn] = [];
          for (var i = 0; i < Math.floor(planetSeed[fn].amount * companyScale); i++) {
            this.companies[fn][tn].push(
              new MCT.PlanetCompany(this.getRandomName(companyNames))
            );
          }
        }
      } else if (planetSeed[fn].types == "research") {
        // companies use research (e.g. by investments) to gain access to tech fields/types
        this.companies[fn] = [];
        for (var i = 0; i < Math.floor(planetSeed[fn].amount * companyScale); i++) {
          // first company is the players' company with reasearch functionalities
          this.companies[fn].push(
            new MCT.PlanetCompany(this.getRandomName(companyNames), (i === 0) ? "human" : "cpu")
          );
        }
      }
    }
  }

  console.log(this.companies);
}

MCT.PlanetCompanyList.prototype.getRandomName = function(names) {
  randomNameNo = -1;
  do {
    randomNameNo = Math.floor(Math.random() * names.list.length);
  } while (names.used.indexOf(randomNameNo) > -1);
  names.used.push(randomNameNo);
  return names.list[randomNameNo];
}

MCT.PlanetCompanyList.prototype.constructor = MCT.PlanetCompanyList;

