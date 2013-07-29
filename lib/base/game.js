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


mct.game = {
  planets : {},
  data : {},
  scnenario : {},
  eventsList : {},
  eventHistory : {}
};

// planet initialization just for first planet earth/anuka yet
function baseGameInitPlanet() {
  mct.game.planets = {
    current : ["anuka", 0], // planet property name and current planet (story) version
    anuka : {
      name : ["lt05000", "lt05001"],
      companies : {
        names : {},
        valid : {}
      }
    }
  };

  $.ajaxSetup({async:false});
  mct.game.data.technologies =
    $.parseJSON($.get('../base/data/technologies.json').responseText);
  mct.game.planets.anuka.companies.names.hardware = {
    used : [], data : $.parseJSON($.get('../base/data/planets/anuka/companies/hardware/names.json').responseText)
  };
  mct.game.planets.anuka.companies.names.software = {
    used : [], data : $.parseJSON($.get('../base/data/planets/anuka/companies/software/names.json').responseText)
  };
  mct.game.planets.anuka.companies.names.advertisements = {
    used : [], data : $.parseJSON($.get('../base/data/planets/anuka/companies/advertisements/names.json').responseText)
  };
  mct.game.planets.anuka.companies.names.drugs = {
    used : [], data : $.parseJSON($.get('../base/data/planets/anuka/companies/drugs/names.json').responseText)
  };

  try {
    mct.game.eventList = {
      used : [], data : $.parseJSON($.get('../base/data/events/sandbox.json').responseText)
    };
  } catch(err) {
    console.log("Failed to load sandbox config");
  }

  for(x = 1; x <= 10; x++) {
    try {
      mct.scnenario[x] = {
        used : [], data : $.parseJSON($.get('../base/data/scnearios/sc'+x+'.json').responseText)
      };
    } catch(err) {
      console.log("Failed to load scenario " + x);
    }
  }

  baseGameInitPlanetCompanies();
}

// initialize random companies on planet, for earth/anuka only yet
function baseGameInitPlanetCompanies() {
  var randomNameNo = -1;

  // go through all fields to collect technology definitions in relation to companies and their amount
  for (var fp in mct.game.data.technologies.fields) {
    // add companies for each field type
    if (mct.game.data.technologies.fields[fp].companies.for == "type") {
      mct.game.planets.anuka.companies.valid[fp] = {};

      for (var tp in mct.game.data.technologies.fields[fp].types) {
        mct.game.planets.anuka.companies.valid[fp][tp] = [];
        for (var i = 0; i < mct.game.data.technologies.fields[fp].companies.amount; i++) {
          randomNameNo = -1;
          do {
            randomNameNo = Math.floor(Math.random() * 1000);
          } while (mct.game.planets.anuka.companies.names[fp].used.indexOf(randomNameNo) > -1);
          mct.game.planets.anuka.companies.names[fp].used.push(randomNameNo);

          mct.game.planets.anuka.companies.valid[fp][tp].push(
            mct.game.planets.anuka.companies.names[fp].data[randomNameNo]
          );
        }
      }
    } else {
      // add companies for all field types
      mct.game.planets.anuka.companies.valid[fp] = [];

      for (var i = 0; i < mct.game.data.technologies.fields[fp].companies.amount; i++) {
        randomNameNo = -1;
        do {
          randomNameNo = Math.floor(Math.random() * 1000);
        } while (mct.game.planets.anuka.companies.names[fp].used.indexOf(randomNameNo) > -1);
        mct.game.planets.anuka.companies.names[fp].used.push(randomNameNo);

        var company = { name : mct.game.planets.anuka.companies.names[fp].data[randomNameNo] };
        for (var tp in mct.game.data.technologies.fields[fp].types) {
          company[tp] = true;
        }
        mct.game.planets.anuka.companies.valid[fp].push(company);
      }
    }
  }
}
