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

// base values object
var baseValues = { display: {}, pixi: {} };

// initialize database and default variables / values in base values object

baseValues.db = openDatabase('mctdb1', '1.0', 'mctdb1', 2 * 1024 * 1024);

var ts = Math.round((new Date()).getTime() / 1000);

// Create table and insert one line
baseValues.db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS player (option unique, value)');
  tx.executeSql('INSERT INTO player (option, value) VALUES ("time", ?)', [ts]);
});
baseValues.db.transaction(function (tx) {
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