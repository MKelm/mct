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

MCT.DisplayObject.prototype.setPosition = function(position) {
  this.container.position.x = position.x;
  this.container.position.y = position.y;
}


MCT.DisplayObject.prototype.createContainer = function() {
  this.container = new PIXI.DisplayObjectContainer();
  return this.container;
}

MCT.DisplayObject.prototype.create = function() {
  switch (this.type) {
    case 'image':
      this.createImage(this.options);
      break;
    case 'graphic':
      this.createGraphic(this.options);
      break;
    case 'button':
      this.createButton(this.options);
      break;
  }
}

MCT.DisplayObject.prototype.getSprite = function(options) {
  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(options.image || "blank"));
  sprite.width = sprite.texture.width;
  sprite.height = sprite.texture.height;
  if (options.scale.x > 0) {
    sprite.scale.x = options.scale.x;
  }
  if (options.scale.y > 0) {
    sprite.scale.y = options.scale.y;
  }
  if (typeof options.anchor == "object") {
    if (options.anchor.x > 0) {
      sprite.anchor.x = options.anchor.x;
    }
    if (options.anchor.y > 0) {
      sprite.anchor.y = options.anchor.y;
    }
  }
  sprite.position.x = 0;
  sprite.position.y = 0;
  return sprite;
}

MCT.DisplayObject.prototype.createGraphic = function(options) {
  var graphic = new PIXI.Graphics();
  graphic.position.x = 0;
  graphic.position.y = 0;
  graphic.beginFill("0x"+options.fillColor);
  if (typeof options.border != "undefined") {
    graphic.lineStyle(options.border.size, "0x"+options.border.color);
  }
  graphic.drawRect(0, 0, options.width, options.height);
  this.createContainer().addChild(graphic);

}

MCT.DisplayObject.prototype.createImage = function(options) {
  var image = this.createContainer();
  var sprite = this.getSprite(options);
  image.addChild(sprite);
}

MCT.DisplayObject.prototype.createButton = function(options) {
  var button = this.createContainer();
  var sprite = this.getSprite(options);
  if (typeof options.interaction != "undefined") {
    this.setInteraction(sprite, options.interaction);
  }
  button.addChild(sprite);
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

MCT.DisplayObject.prototype.setVisibility = function(value) {
  this.container.visible = value;
  // workaround for pixi.js issue #202: https://github.com/GoodBoyDigital/pixi.js/issues/202
  for (var i = 0; i < this.container.children.length; i++) {
    this.container.children[i].visibility = value;
    // this workaround makes graphics invisible too, but maybe we need another workaround to
    // disable click events from invisible objects, I have noticed such a bug in my window
    // implementation!
  }
}

MCT.DisplayObject.prototype.getVisibility = function() {
  return this.container.visible;
}
