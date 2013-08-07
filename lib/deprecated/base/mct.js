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

// MCT storage object
var mct = mct || {};

mct.pixi = {}; // display related data / objects
mct.status = { // game status data
  mode : "sandbox", // current game mode
  turn : 0, // current in game turn
  planet : 0, // start planet and further planet selection
  lang : "en-US", // de-DE or en-US for language text values
  pixi : { },
  intervals : { }, // object for intervals status
};
mct.data = { // general game data
  planets : [],
  technologies : {},
  scnenario : {},
  events : {
    list : null,
    history : null,
    current : null
  }
};

// initialize database and default variables / values in base values object
mct.db = openDatabase('mctdb1', '1.0', 'mctdb1', 2 * 1024 * 1024);

var ts = baseUtilTime("unix");

// Create table and insert one line
mct.db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS player (option unique, value)');
  tx.executeSql('INSERT INTO player (option, value) VALUES ("time", ?)', [ts]);
});
mct.db.transaction(function (tx) {
  tx.executeSql('UPDATE player SET value = ? WHERE option = "time"', [ts]);
});

/*
 tx.executeSql('SELECT * FROM foo', [], function (tx, results) {
  var len = results.rows.length, i;
  for (i = 0; i < len; i++) {
    alert(results.rows.item(i).text);
  }
});
*/
