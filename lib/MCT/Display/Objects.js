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

// display objects class
// can handle a list of display objects for other parts

MCT.DisplayObjects = function() {
  this.list = {};
}

MCT.DisplayObjects.prototype.constructor = MCT.DisplayObjects;

MCT.DisplayObjects.prototype.add = function(name, type, options) {
  var object = new MCT.DisplayObject(type, options);
  object.create();
  this.list[name] = object;
  return this.get(name);
}

MCT.DisplayObjects.prototype.get = function(name) {
  if (typeof this.list[name] == "undefined") {
    throw new Error("MCT.DisplayObjects, broken object name dependency.");
  }
  return this.list[name];
}

MCT.DisplayObjects.prototype.remove = function(object) {
  if (typeof object == "string") {
    delete this.list[object];
  } else if (object instanceof MCT.DisplayObject) {
    delete object;
  }
  throw new Error("MCT.DisplayObjects, broken object reference dependency to remove object.");
}