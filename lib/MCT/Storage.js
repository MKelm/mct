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

// storage class to perform database actions

MCT.Storage = function() {
  this.db = openDatabase('mctdb1', '1.0', 'mctdb1', 2 * 1024 * 1024);
}

MCT.Storage.prototype.constructor = MCT.Storage;

MCT.Storage.prototype.setPlayerTime = function() {
  this.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS player (option unique, value)');
    tx.executeSql('INSERT INTO player (option, value) VALUES ("time", ?)', [ts]);
  });
  this.db.transaction(function (tx) {
    tx.executeSql('UPDATE player SET value = ? WHERE option = "time"', [ts]);
  });
}

MCT.Storage.prototype.getPlayerTime = function() {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM player WHERE option = "time"', [], function (tx, results) {
      var len = results.rows.length, i;
      for (i = 0; i < len; i++) {
        alert(results.rows.item(i).text);
      }
    });
  });
}