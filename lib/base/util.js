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

// update version hash database on start / should work for the maintainer only
baseUtilUpdateHashes();

function baseUtilUpdateHashes() {
  var hashes = window.location.pathname.replace('lib/display/default.html','') + 'HASHES';
  var fs = require('fs');
  fs.readFile(hashes, { encoding : "utf8" }, function(err, data) {
    if (err) return;
    var hashList = data.split("\n");
    if (hashList.length > 0) {
      var lastHash = hashList[hashList.length-1].split(" ");
    } else {
      var lastHash = '';
    }
    baseUtilCommitHash(function(lastCommitHash) {
      if (lastCommitHash != "" && (lastHash == '' || lastHash[1] != "C"+lastCommitHash)) {
        baseUtilVersionHash(function(hash){
          var newVersionHashes = "V"+hash+" C"+lastCommitHash;
          hashList.push(newVersionHashes);
          var data = "";
          for (var i = 0; i < hashList.length; i++) {
            if (i > 0) {
              data += "\n";
            }
            data += hashList[i];
          }
          fs.writeFile(hashes, data, function (err) {
            console.log('Updated version info: ' + newVersionHashes);
          });
        });
      }
    });
  });
}

function baseUtilCommitHash(callback) {
  var master = window.location.pathname.replace('lib/display/default.html','') + '.git/refs/heads/master';
  var fs = require('fs');
  return fs.readFile(master, { encoding : "utf8" }, function(err, data) {
    if (err) return;
    callback(data.replace("\n", ""));
  });
}

function baseUtilVersionHash(callback) {
  var walk = function(dir, done) {
    var fs = require('fs');
    var crypt = require('crypto');
    var shasum = null;
    var results = {};
    var s = null;
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];

        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              for (var op in res) {
                if (res.hasOwnProperty(op)) {
                  results[op] = res[op];
                }
              }
              next();
            });
          } else if (file.substring(file.length - 3) == '.js' ||
                     file.substring(file.length - 5) == '.json' ||
                     file.substring(file.length - 5) == '.html') {
            // just add logic/game content related lib files for version info
            shasum = crypt.createHash('sha1');
            s = fs.ReadStream(file);
            s.on('data', function(d) {
              shasum.update(d);
            });
            s.on('end', function() {
              results[file] = shasum.digest('hex');
              next();
            });
          } else {
            next();
          }
        });

      })();
    });
  };

  var basePath = window.location.pathname.replace('/display/default.html','');
  walk(basePath, function(err, results) {
    if (err) throw err;
    var crypt = require('crypto');
    var keys = Object.keys(results);
    keys.sort();
    var hashConcatination = "";
    for (var i = 0; i < keys.length; i++) {
      hashConcatination += results[keys[i]];
    }
    callback(crypt.createHash('sha1').update(hashConcatination).digest('hex'));
  });
}