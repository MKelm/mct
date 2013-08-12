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

MCT.DisplayObject = function(type, options, container) {
  this.type = type || null;
  this.options = options || null;
  this.container = container || null;
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


MCT.DisplayObject.prototype.createContainer = function(center, size) {
  this.container = new PIXI.DisplayObjectContainer();
  if (center === true && typeof size == "object") {
    this.container.pivot.x = size.width / 2;
    this.container.pivot.y = size.height / 2;
  }
  return this.container;
}

MCT.DisplayObject.prototype.create = function() {
  switch (this.type) {
    case 'text':
      var text = this.getText(this.options);
      if (text instanceof PIXI.Text) {
        this.createContainer().addChild(text);
      } else {
        return false;
      }
      break;
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
  return true;
}

MCT.DisplayObject.prototype.createImage = function(options) {
  // use multiple images with alpha transparency for color layers
  // example: image: [ "mct_planet_grey", "mct_planet_layer_red" ], alpha : [ 1, 0.2 ]
  // note: pixi.js has no color filters yet, this is a first simple approach for color layers ...
  var image = this.createContainer();
  if (typeof options.image != "object") {
    options.images = [ options.image ];
  } else {
    options.images = options.image;
  }
  if (typeof options.alpha != "undefined" && typeof options.alpha != "object") {
    options.alphas = [ options.alpha ];
  } else if (typeof options.alpha != "undefined") {
    options.alphas = options.alpha;
  }
  for (var i = 0; i < options.images.length; i++) {
    options.image = options.images[i];
    if (typeof options.alphas != "undefined") {
      if (typeof options.alphas[i] != "undefined") {
        options.alpha = options.alphas[i];
      } else {
        delete options.alpha;
      }
    }
    image.addChild(this.getSprite(options));
  }
}

MCT.DisplayObject.prototype.getSprite = function(options) {
  var texture = PIXI.Texture.fromFrame(options.image || "blank");
  if (options.tiling === true) {
    var sprite = new PIXI.TilingSprite(texture);
    if (typeof options.tileScale != "undefined") {
      sprite.tileScale = options.tileScale;
    }
  } else {
    var sprite = new PIXI.Sprite(texture);
  }
  if (typeof options.width == "undefined") {
    sprite.width = sprite.texture.width;
  } else {
    sprite.width = options.width;
  }
  if (typeof options.height == "undefined") {
    sprite.height = sprite.texture.height;
  } else {
    sprite.height = options.height;
  }
  if (typeof options.scale != "undefined") {
    if (options.scale.x > 0) {
      sprite.scale.x = options.scale.x;
    }
    if (options.scale.y > 0) {
      sprite.scale.y = options.scale.y;
    }
  }
  if (typeof options.anchor == "object") {
    if (options.anchor.x > 0) {
      sprite.anchor.x = options.anchor.x;
    }
    if (options.anchor.y > 0) {
      sprite.anchor.y = options.anchor.y;
    }
  }
  if (typeof options.alpha != "undefined") {
    sprite.alpha = options.alpha;
  }
  sprite.position.x = 0;
  sprite.position.y = 0;
  if (typeof options.interaction != "undefined") {
    this.setInteraction(sprite, options.interaction);
  }
  return sprite;
}

MCT.DisplayObject.prototype.getText = function(options) {
  var lineLength = 100;
  if (typeof options.style != "undefined") {
    style = {
      font: options.style[0] + "px " + options.style[1], fill: options.style[2]
    };
    lineLength = Number(options.style[3]);
  } else {
    style = null;
  }

  // multi line support with word wrap
  if (typeof options.value == "object" && options.value.length > 0) {
    var tmp = "";
    for (var i = 0; i < options.value.length; i++) {
      if (i > 0) {
        tmp += " ";
      }
      tmp += options.value[i];
    }
    options.value = tmp;
    delete tmp;
  }
  if (options.value.length > lineLength) {
    var tmp = "";
    var i = -1, j = 0, lines = [];
    do {
      i++;
      if (i < options.value.length) {
        if (tmp.length > 0 || options.value.substring(i, i+1) != " ") {
          tmp += options.value.substring(i, i+1);
          if (tmp.length == lineLength) {
            j = 0;
            var tmp2 = options.value.substring(i+1, i+2);
            if (tmp.substring(tmp.length-1) !== "" && tmp2 != " ") {
              j = tmp.length - 1;
              do {
                j--;
              } while (tmp.substring(j, j+1) != " ");
            }
            if (j > 0) {
              lines.push(tmp.substring(0, j+1));
              tmp = tmp.substring(j+1);
            } else {
              lines.push(tmp);
              tmp = "";
            }
          }
        }
      }
    } while (i < options.value.length - 1);
    if (tmp !== "") {
      lines.push(tmp);
    }
    if (lines.length > 0) {
      options.value = "";
      for (i = 0; i < lines.length; i++) {
        if (i > 0) {
          options.value += "\n";
        }
        options.value += lines[i];
      }
    }
  }


  if (options.value.substring(0, 3) === "lt.") {
    return false;
  }

  var text = new PIXI.Text(options.value, style);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  if (typeof options.anchor != "undefined") {
    if (typeof options.anchor.x != "undefined") {
      text.anchor.x = options.anchor.x;
    }
    if (typeof options.anchor.y != "undefined") {
      text.anchor.y = options.anchor.y;
    }
  }
  if (typeof options.position != "undefined") {
    if (options.position.x != "undefined") {
      text.position.x = options.position.x;
    }
    if (options.position.y != "undefined") {
      text.position.y = options.position.y;
    }
  }
  return text;
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
  var container = this.createContainer(
    options.center, { width: options.width, height: options.height }
  );
  container.addChild(graphic);
}

MCT.DisplayObject.prototype.createButton = function(options) {
  var button = this.createContainer();

  if (typeof options.text != "undefined") {
    var text = this.getText(options.text);
  }

  var sprite = this.getSprite(options);
  if (typeof text != "undefined") {
    // just a simple logic to get a fixed border space inside a button with text
    // text buttons in different languages have different sizes
    // the logic does not correct the button position on size change yet
    // and it has no dependencies to other layout logic yet
    if (typeof options.text.borderSize != "undefined" &&
        typeof options.text.borderSize.vertical != "undefined") {
      var space = options.text.borderSize.vertical * options.text.style[0];
      sprite.width = text.width + space + space;
    } else {
      sprite.width = text.width;
    }
    if (typeof options.text.borderSize != "undefined" &&
        typeof options.text.borderSize.horizontal != "undefined") {
      var space = options.text.borderSize.horizontal * options.text.style[0];
      sprite.height = text.height + space + space;
    } else {
      sprite.height = text.height;
    }
  }
  button.addChild(sprite);

  if (typeof text != "undefined") {
    text.position.x = sprite.width / 2;
    text.position.y = sprite.height / 2;
    if (typeof options.anchor == "object") {
      if (options.anchor.x > 0) {
        text.anchor.x = options.anchor.x;
        text.position.x = 0;
      }
      if (options.anchor.y > 0) {
        text.anchor.y = options.anchor.y;
        text.position.y = 0;
      }
    }
    button.addChild(text);
  }
}

MCT.DisplayObject.prototype.setInteraction = function(sprite, options) {
  if (options.element instanceof MCT.Element && typeof options.type != "undefined") {
    sprite.setInteractive(true);
    var eventContent = { element: options.element };
    $.extend(eventContent, options.content);
    var callback = function(mouse) {
      $.extend(eventContent, { mouse: mouse });
      options.element.dispatchEvent( { type: options.type, content: eventContent } );
    };
    switch (options.type) {
      case "click":
        sprite.click = callback;
        break;
      case "mousedown":
        sprite.mousedown = callback;
        break;
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

MCT.DisplayObject.prototype.getSize = function() {
  var width = 0, height = 0;
  if (typeof this.container.children[0] != "undefined" &&
      typeof this.container.children[0].width == "number" &&
      typeof this.container.children[0].height == "number") {
    // todo: use container size instead of children size
    // needs a resetting of container size on children creation
    width = this.container.children[0].width;
    height = this.container.children[0].height;
  }
  return { width: width, height: height };
}

MCT.DisplayObject.prototype.setSize = function(size) {
  if (typeof this.container.children[0] != "undefined" &&
      typeof size.width == "number" && typeof size.height == "number") {
    // just for simple display objects like a graphic or image!
    if (this.type == "graphic") {
      // note the graphic should have a 1x1px size!
      this.container.children[0].scale = { x: size.width, y: size.height };
      this.container.pivot = { x: size.width / 2, y: size.height / 2 };
    } else if (this.type == "image") {
      this.container.children[0].width = size.width;
      this.container.children[0].height = size.height;
    }
  }
}