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

// display ui layout class

MCT.DisplayUILayout = function(grid, displayOptions) {
  MCT.Layout.call(this, grid, displayOptions);

  this.frames = [];
}

MCT.DisplayUILayout.prototype = Object.create(MCT.Layout.prototype);
MCT.DisplayUILayout.prototype.constructor = MCT.DisplayUILayout;

MCT.DisplayUILayout.prototype.addDisplayObjectToPart = function(partName, objectName, objectType, objectOptions) {
  if (typeof this.parts[partName].frameId == "number" &&
      typeof this.frames[this.parts[partName].frameId] == "object") {
    objectOptions.reference = true;
  }
  MCT.Layout.prototype.addDisplayObjectToPart.call(this, partName, objectName, objectType, objectOptions);
  if (this.parts[partName].displayObject !== false && objectOptions.reference === true) {
    // add display objects of parts inside a frame to frame!
    this.frames[this.parts[partName].frameId].displayObject.container.addChild(
      this.parts[partName].displayObject.container
    );
  }
}

MCT.DisplayUILayout.prototype.addFrame = function(frame) {
  if (typeof frame != "object") {
    frame = {};
  }
  var partOptions = {
    anchor : true,
    namePrefix : 'frame_',
    x : frame.x || 0,
    y : frame.y || 0,
    width : frame.width || 1,
    height : frame.height || 1,
    zindex : 0
  };
  var partName = this.addPart(partOptions);
  this.addPartOptions(partName, { visible: frame.visible || true, padding: frame.padding || {} });

  // just a graphic for a frame as background yet
  this.addDisplayObjectToPart(
    partName, partName, 'graphic',
    { fillColor: frame.color || "424242", width: frame.width || 1, height: frame.height || 1 }
  );
  this.frames.push(this.parts[partName]);
  return this.frames.length-1;
}

// calculate sizes of parts and their positions in relation to each other depending on location
// and align options and set display object positions
MCT.DisplayUILayout.prototype.calculate = function(frameId) {
  var locations = [];

  for (var pn in this.parts) {
    if (this.parts[pn].visible === true &&  this.parts[pn].frameId == frameId) {
      if (typeof locations[this.parts[pn].zindex-1] == "undefined")
        locations[this.parts[pn].zindex-1] = { top: { parts: [] }, bottom: { parts: [] } };

      if (this.parts[pn].location == "bottom") {
        locations[this.parts[pn].zindex-1].bottom.parts.push(this.parts[pn]);
      } else {
        locations[this.parts[pn].zindex-1].top.parts.push(this.parts[pn]);
      }
    }
  }

  var unitSize = {
    width: this.displayObjects.size.width / this.grid.size.width,
    height: this.displayObjects.size.height / this.grid.size.height
  };

  var frameSize = { width: 0, height: 0 };
  var partSize = null, padding = {};
  // just height and y positioning, no align calculations yet!
  for (var i = 0; i < locations.length; i++) {
    framePadding = (i == 0) ? this.frames[frameId].padding || {} : {};
    locations[i].spaces = { top: 0 + (framePadding.top || 0), bottom: 0};
    for (var spn in locations[i].spaces) {
      if (spn == "bottom") {
        locations[i].spaces.bottom = locations[i].spaces.top;
        var jBase = locations[i].bottom.parts.length-1, jNext = -1, jMin = 0;
      } else {
        var jBase = 0, jNext = 1, jMax = locations[i].top.parts.length-1;
      }
      if (locations[i][spn].parts.length > 0) {
        // get padding for part
        var c = 0;
        do {
          var j = c * jNext + jBase;
          if (locations[i][spn].parts[j].displayObject instanceof MCT.DisplayObject) {
            // get padding for part
            if (typeof locations[i][spn].parts[j].padding == "object") {
              padding.left = (typeof locations[i][spn].parts[j].padding.left != "undefined") ?
                (framePadding.left || 0) + Number(locations[i][spn].parts[j].padding.left) : (framePadding.left || 0);
              padding.right =(typeof locations[i][spn].parts[j].padding.right != "undefined") ?
                Number(locations[i][spn].parts[j].padding.right) : 0;
              padding.top = (typeof locations[i][spn].parts[j].padding.top != "undefined") ?
                Number(locations[i][spn].parts[j].padding.top) : 0;
              padding.bottom = (typeof locations[i][spn].parts[j].padding.bottom != "undefined") ?
                Number(locations[i][spn].parts[j].padding.bottom) : 0;
            } else {
              padding.left = (framePadding.left || 0);
            }

            // calculate positions and spaces
            partSize = locations[i][spn].parts[j].displayObject.getSize();
            locations[i][spn].parts[j].width = Math.ceil(partSize.width / unitSize.width);
            locations[i][spn].parts[j].height = Math.ceil(partSize.height / unitSize.height);
            locations[i][spn].parts[j].x = (padding.left || 0);
            locations[i][spn].parts[j].y = locations[i].spaces[spn] + (padding.top || 0);
            this.setDisplayObjectPositionByPart(locations[i][spn].parts[j]);

            if (frameSize.width < locations[i][spn].parts[j].width + (padding.left || 0) + (padding.right || 0)) {
              frameSize.width = locations[i][spn].parts[j].width + (padding.left || 0) + (padding.right || 0);
            }

            locations[i].spaces[spn] += (padding.bottom || 0) + (padding.top || 0) +
              locations[i][spn].parts[j].height;
          }
          c++;
        } while ((spn == "bottom" && j > jMin) || (spn == "top" && j < jMax));
      }
    }
    var maxLayerWidth = frameSize.width;
    frameSize.width += (framePadding.right || 0);
    frameSize.height += locations[i].spaces.bottom + (framePadding.bottom || 0);

    // calculate align positions, depending on frame width
    for (var spn in locations[i].spaces) {
      for (var j = 0; j < locations[i][spn].parts.length; j++) {
        if (locations[i][spn].parts[j].align != "left" &&
            locations[i][spn].parts[j].displayObject instanceof MCT.DisplayObject) {

          if (locations[i][spn].parts[j].align == "right") {
            locations[i][spn].parts[j].x = maxLayerWidth - locations[i][spn].parts[j].width;
            this.setDisplayObjectPositionByPart(locations[i][spn].parts[j]);
          } else if (locations[i][spn].parts[j].align == "center") {
            locations[i][spn].parts[j].x =
              Math.floor((frameSize.width / 2) - (locations[i][spn].parts[j].width / 2));
            this.setDisplayObjectPositionByPart(locations[i][spn].parts[j]);
          }

        }
      }
    }
  }

  var framePart = this.frames[frameId];
  framePart.x = Math.floor(this.grid.size.width / 2);
  framePart.y = Math.floor(this.grid.size.height / 2);
  framePart.width = frameSize.width;
  framePart.height = frameSize.height;
  this.setDisplayObjectSizeByPart(framePart);
  this.setDisplayObjectPositionByPart(framePart);
}