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

MCT.DisplayObjects = function(options) {
  if (typeof mct.userConfig == "undefined") {
    throw new Error("MCT.DisplayObjects, broken user config dependency.");
  }
  this.list = {};

  this.texturesOptions = {};
  this.textStylesOptions = {};
  this.textTranslations = {};
  if (typeof options.elementHandle != "undefined") {
    this.loadTexturesOptions(options.elementHandle);
    this.loadTextStylesOptions(options.elementHandle);
    this.loadTextTranslations(options.elementHandle);
  }

  this.size = null;
  if (typeof options.size != "undefined") {
    // set original size to display objects container
    // set the container scale later in scene
    this.size = options.size;
  }

  this.center = options.center || false;

  this.container = this.createContainer();

  this.baseScale = { x: 0, y: 0 };
  // contains scale steps and scale step size for zoom
  this.zoomScale = { x: [0, 1.1], y: [0, 1.1] };
  if (options.zoom === true) {
    this.activateZoom();
  }
}

MCT.DisplayObjects.prototype.constructor = MCT.DisplayObjects;

MCT.DisplayObjects.prototype.createContainer = function() {
  this.container = new PIXI.DisplayObjectContainer();
  if (this.center !== false && typeof this.center == "object") {
    // does not work correctly atm because the grid center can differ from the DisplayObjects center
    this.container.pivot = {x: this.center.x, y: this.center.y };
    this.container.position = {x: mct.pixi.screen.width/2, y: mct.pixi.screen.height/2 };
  } else {
    this.container.position.x = 0;
    this.container.position.y = 0;
  }
  // set visibility to false to hide scenes on add
  this.container.visible = false;
  return this.container;
}

MCT.DisplayObjects.prototype.activateZoom = function() {
  var scope = this;
  $('html').bind('mousewheel', function(e) {
    if (e.originalEvent.wheelDelta / 120 > 0) {
      scope.zoomScale.x[0]++;
      scope.zoomScale.y[0]++;
    } else {
      scope.zoomScale.x[0]--;
      scope.zoomScale.y[0]--;
    }
    scope.setScale();
  });
}

MCT.DisplayObjects.prototype.setScale = function(scale) {
  if (typeof scale != "undefined") {
    this.baseScale = scale;
  }
  // a logic to recalculate the scale with baseScale in relation to the current zoom scale
  // on scale change or just zoom correctly
  if (typeof this.zoomScale != "undefined") {
    if (this.zoomScale.x[0] > 0) {
      this.container.scale.x = this.baseScale.x * (Math.pow(this.zoomScale.x[1], this.zoomScale.x[0]));
    } else if (this.zoomScale.x[0] < 0) {
      this.container.scale.x = this.baseScale.x / (Math.pow(this.zoomScale.x[1], Math.abs(this.zoomScale.x[0])));
    } else {
      this.container.scale.x = this.baseScale.x;
    }
    if (this.zoomScale.y[0] > 0) {
      this.container.scale.y = this.baseScale.y * (Math.pow(this.zoomScale.y[1], this.zoomScale.y[0]));
    } else if (this.zoomScale.y[0] < 0) {
      this.container.scale.y = this.baseScale.y / (Math.pow(this.zoomScale.y[1], Math.abs(this.zoomScale.y[0])));
    } else {
      this.container.scale.y = this.baseScale.y;
    }
  }
}

MCT.DisplayObjects.prototype.getScale = function() {
  return this.container.scale;
}

MCT.DisplayObjects.prototype.loadTextStylesOptions = function(fileHandle) {
  try {
    this.textStylesOptions = mct.util.loadJSON(
      './lib/data/display/txt/elements/'+ fileHandle +'/styles.json'
    );
    if (typeof this.textStylesOptions.externals == "object" &&
        this.textStylesOptions.externals.length > 0) {
      for (var i = 0; i < this.textStylesOptions.externals.length; i++) {
        var styles = mct.util.loadJSON(
          './lib/data/display/txt/externals/'+ this.textStylesOptions.externals[i] +'/styles.json'
        );
        for (var sp in styles) {
          this.textStylesOptions[sp] = styles[sp];
        }
      }
      delete this.textStylesOptions.externals;
    }
  } catch(err) {
    this.textStylesOptions = {};
  }
}

MCT.DisplayObjects.prototype.loadTextStyleOptions = function(options) {
  if (typeof options.text != "undefined") {
    var opts = options.text;
  } else {
    var opts = options;
  }
  if (typeof opts.style != "undefined") {
    if (typeof this.textStylesOptions[opts.style] != "undefined") {
      opts.style = this.textStylesOptions[opts.style];
    }
  }
}

MCT.DisplayObjects.prototype.loadTextTranslations = function(fileHandle) {
  try {
    this.textTranslations = mct.util.loadJSON(
      './lib/data/display/txt/elements/'+ fileHandle +'/lngs/'+ mct.userConfig.language +'.json'
    );
    if (typeof this.textTranslations.externals == "object" &&
        this.textTranslations.externals.length > 0) {
      for (var i = 0; i < this.textTranslations.externals.length; i++) {
        var translations = mct.util.loadJSON(
          './lib/data/display/txt/externals/'+ this.textTranslations.externals[i] +'/lngs/'+
            mct.userConfig.language +'.json'
        );
        for (var tp in translations) {
          this.textTranslations[tp] = translations[tp];
        }
      }
      delete this.textTranslations.externals;
    }
  } catch(err) {
    this.textTranslations = {};
  }
}

MCT.DisplayObjects.prototype.loadTextTranslation = function(options) {
  if (typeof options.text != "undefined") {
    var opts = options.text;
  } else {
    var opts = options;
  }
  if (typeof opts.value != "undefined") {
    if (typeof this.textTranslations[opts.value] != "undefined") {
      opts.value = this.textTranslations[opts.value];
    }
  }
}

MCT.DisplayObjects.prototype.loadTexturesOptions = function(fileHandle) {
  try {
    var json = mct.util.loadJSON('./lib/data/display/gfx/elements/'+ fileHandle +'/options.json');
    this.texturesOptions = json.textures;
  } catch(err) {
    this.texturesOptions = {};
  }
}

MCT.DisplayObjects.prototype.loadTextureOptions = function(options) {
  if (typeof options.image == "object" && options.image.length > 0) {
    var image = options.image[0];
  } else {
    var image = options.image;
  }
  if (typeof image == "string" && typeof this.texturesOptions[image] != "undefined") {
    if (typeof this.texturesOptions[image].scale != "undefined") {
      if (typeof options.scale == "undefined") {
        options.scale = { x: 1.0, y: 1.0 };
      }
      options.scale.x = options.scale.x * this.texturesOptions[image].scale.x;
      options.scale.y = options.scale.y * this.texturesOptions[image].scale.y;
    }
    if (typeof this.texturesOptions[image].anchor != "undefined") {
      options.anchor = this.texturesOptions[image].anchor;
    }
  }
}

MCT.DisplayObjects.prototype.add = function(name, type, options) {
  if (type != "container") {
    this.loadTextureOptions(options);
    this.loadTextStyleOptions(options);
    this.loadTextTranslation(options);
    var object = new MCT.DisplayObject(type, options);
    object.create();
    this.list[name] = object;
  } else {
    this.list[name] = new MCT.DisplayObject("container", null, options.owner.container);
  }
  this.container.addChild(this.list[name].container);
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
    this.container.removeChild(this.list[object]);
    delete this.list[object];
  } else if (object instanceof MCT.DisplayObject) {
    this.container.removeChild(object);
    delete object;
  }
  throw new Error("MCT.DisplayObjects, broken object reference dependency to remove object.");
}

MCT.DisplayObjects.prototype.setVisibility = function(value) {
  // note changes visibility status of all sub objects too!
  this.container.visible = value;
  for (var pp in this.list) {
    this.list[pp].setVisibility(value);
  }
}

MCT.DisplayObjects.prototype.getVisibility = function() {
  // note: sub objects can have different visibility status
  return this.container.visible;
}

MCT.DisplayObjects.prototype.move = function(diff) {
  this.container.position.x = this.container.position.x + diff.x;
  this.container.position.y = this.container.position.y + diff.y;
}
