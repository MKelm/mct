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
        this.companies[fn] = [];
        for (var i = 0; i < planetSeed[fn].amount; i++) {
          randomNameNo = -1;
          do {
            randomNameNo = Math.floor(Math.random() * companyNames.list.length);
          } while (companyNames.used.indexOf(randomNameNo) > -1);
          companyNames.used.push(randomNameNo);
          this.companies[fn].push(companyNames.list[randomNameNo]);
        }
      } else {
        this.companies[fn] = {};
        for (var tn in technologyConfig.fields[fn].types) {
          this.companies[fn][tn] = [];
          for (var i = 0; i < planetSeed[fn].amount; i++) {
            randomNameNo = -1;
            do {
              randomNameNo = Math.floor(Math.random() * companyNames.list.length);
            } while (companyNames.used.indexOf(randomNameNo) > -1);
            companyNames.used.push(randomNameNo);
            this.companies[fn][tn].push(
              new MCT.PlanetCompany(companyNames.list[randomNameNo])
            );
          }
        }
      }
    }
  }

  console.log(this.companies);
}

MCT.PlanetCompanyList.prototype.constructor = MCT.PlanetCompanyList;