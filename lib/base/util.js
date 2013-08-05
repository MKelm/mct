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

function baseLoadJSON(json) {
  return JSON.parse(require('fs').readFileSync(json, { encoding : "utf8" }));
}

// curry feature for functions, to create callback functions (with parameters)
Function.prototype.curry = function() {
  if (arguments.length < 1) {
    return this;
  }
  var __method = this;
  var args = Array.prototype.slice.call(arguments); // can be outsourced to toArray(..)
  return function() {
    return __method.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  }
}

function baseUtilTime(type, delay) {
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

// update version hash database on start / should work for the maintainer only
baseUtilUpdateHashes();

function baseUtilUpdateHashes() {
  var hashes = './HASHES';
  var fs = require('fs');
  fs.readFile(hashes, { encoding : "utf8" }, function(err, data) {
    if (err) return;
    var hashesList = data.split("\n");
    var lastHashes = (hashesList.length > 0) ? hashesList[hashesList.length-1].split(" ") : '';
    baseUtilVersionHash(function(lastVersionHash){
      if (lastHashes === '' || lastHashes[0] != "V"+lastVersionHash) {
        baseUtilCommitHash(function(lastCommitHash) {
          if (lastHashes === '' || lastHashes[1] != "C"+lastCommitHash) {
            var newHashes = "V"+lastVersionHash+" C"+lastCommitHash;
            hashesList.push(newHashes);
            var data = "", c = 0;
            for (var i = 0; i < hashesList.length; i++) {
              if ($.trim(hashesList[i]) !== "") {
                if (c > 0) {
                  data += "\n";
                }
                data += hashesList[i];
                c++;
              }
            }
            fs.writeFile(hashes, data, function (err) {
              console.log('Updated version info: ' + newHashes);
            });
          }
        });
      }
    });
  });
}

function baseUtilCommitHash(callback) {
  var fs = require('fs');
  return fs.readFile('./.git/refs/heads/master', { encoding : "utf8" }, function(err, data) {
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
    var tmp = "";
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
  walk('./lib', function(err, results) {
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