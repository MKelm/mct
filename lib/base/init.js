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

// init base values object
var mct = {
  db : {}, // database
  pixi: {}, // display related data / objects
  intervals : { }, // storage object for interval ids
  audio : {
    releaseDelay : 300, // delay to release effect channels in milliseconds
    autoplay : 0, // play music on start
    channelCount : 16, // 16, 32, 48, 64 ...
    objects : []
  },
  status : { // game status data
    mode : "sandbox", // current game mode
    turn : 0, // current in game turn
    planet : 0, // start planet and further planet selection
    lang : "en-US", // de-DE or en-US for language text values
    audio : {
      music : 0, // use to activate audio / music
      effects : {
        active : 0, // use to activate audio / effects
        channels : [] // status of channels playing or pause/end
      }
    },
    pixi : { }
  },
  data : { // general game data
    planets : [],
    technologies : {},
    scnenario : {},
    events : {
      list : null,
      history : null,
      current : null
    }
  }
};


// initialize database and default variables / values in base values object

mct.db = openDatabase('mctdb1', '1.0', 'mctdb1', 2 * 1024 * 1024);

function time(type, delay) {
  var div = 1;
  if (type == "unix") {
    div = 1000;
  }
  if (delay > 0) {
    return Math.round((new Date()).getTime() / div) + delay; // return unix timestamp (seconds)
  } else {
    return Math.round((new Date()).getTime() / div);
  }
}

var ts = time();

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

var date = new Date(ts*1000);
// hours part from the timestamp
var hours = date.getHours();
// minutes part from the timestamp
var minutes = date.getMinutes();
// seconds part from the timestamp
var seconds = date.getSeconds();
