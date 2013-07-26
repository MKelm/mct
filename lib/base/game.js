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

function baseGameInit() {
  mct.game = {
    planets : {
      earth : {
        companies : {}
      }
    },
    data : {}
  };

  $.getJSON('../base/data/technologies.json', function(data) {
    mct.game.data.technologies = data;
    baseGameInitCompanies();
  });
}

function baseGameInitCompanies() {

  // init companies on earth
  // go through all fields to collect technology definitions in relation to companies and their amount
  for (var fp in mct.game.data.technologies.fields) {
    // add companies for each field type
    if (mct.game.data.technologies.fields[fp].companies.for == "type") {
      mct.game.planets.earth.companies[fp] = {};

      for (var tp in mct.game.data.technologies.fields[fp].types) {
        mct.game.planets.earth.companies[fp][tp] = [];
        for (var i = 0; i < mct.game.data.technologies.fields[fp].companies.amount; i++) {
          mct.game.planets.earth.companies[fp][tp].push(fp + " " + tp + " company " + i);
        }
      }
    } else {
      // add companies for all field types
      mct.game.planets.earth.companies[fp] = [];

      for (var i = 0; i < mct.game.data.technologies.fields[fp].companies.amount; i++) {
        var company = { name : fp + " company " + i };
        for (var tp in mct.game.data.technologies.fields[fp].types) {
          company[tp] = true;
        }
        mct.game.planets.earth.companies[fp].push(company);
      }
    }
  }

  console.log(mct.game.planets.earth);
}