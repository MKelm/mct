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

// basic display object class
// this is a wrapper for pixi.js display object containers with some object types designed for mct

MCT.DisplayObject = function(type, options) {
  this.type = type || null;
  this.options = options || null;
  this.container = null;
}

MCT.DisplayObject.prototype.constructor = MCT.DisplayObject;

MCT.DisplayObject.prototype.current = function() {
  if (container === null) {
    if (type === null) {
      throw new Error("MCT.DisplayObject, broken type dependency.");
    }
    if (options === null) {
      throw new Error("MCT.DisplayObject, broken options dependency.");
    }
    this.create();
  }
  if (this.container !== null) {
    return this.container;
  }
}

MCT.DisplayObject.prototype.createContainer = function() {
  this.container = new PIXI.DisplayObjectContainer();
  return this.container;
}

MCT.DisplayObject.prototype.create = function() {
  switch (this.type) {
    case 'button':
      this.createButton(this.options);
      break;
  }
}

MCT.DisplayObject.prototype.setInteraction = function(sprite, options) {
  if (typeof options.action != "undefined" && typeof options.type != "undefined") {
    sprite.setInteractive(true);
    switch (options.type) {
      case "click":
        sprite.click = options.action;
        break;
    }
    if (typeof options.data != "undefined") {
      sprite.mctInteractionData = options.data;
    }
  }
}

MCT.DisplayObject.prototype.createButton = function(options) {
  var button = this.createContainer();

  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(options.image || "blank"));
  sprite.width = sprite.texture.width;
  sprite.height = sprite.texture.height;
  if (options.scale > 0) {
    sprite.scale = options.scale;
  }
  sprite.position.x = 0;
  sprite.position.y = 0;

  if (typeof options.interaction != "undefined") {
    this.setInteraction(sprite, options.interaction);
  }

  button.addChild(sprite);
}