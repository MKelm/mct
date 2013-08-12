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
  if (typeof this.parts[partName].displayObject != "undefined" && objectOptions.reference === true) {
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
  this.addPartOptions(partName, { visible: frame.visible || true });

  // just a graphic for a frame as background yet
  this.addDisplayObjectToPart(
    partName, partName, 'graphic',
    { fillColor: frame.bgColor || "424242", width: frame.width || 1, height: frame.height || 1 }
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

  var frameSize = { width: 1, height: 1 };
  var partSize = null;
  // just height and y positioning, no align calculations yet!
  for (var i = 0; i < locations.length; i++) {
    locations[i].spaces = { top: 0, bottom: 0};
    for (var j = 0; j < locations[i].top.parts.length; j++) {
      if (locations[i].top.parts[j].displayObject instanceof MCT.DisplayObject) {
        partSize = locations[i].top.parts[j].displayObject.getSize();
        locations[i].top.parts[j].width = Math.ceil(partSize.width / unitSize.width);
        if (frameSize.width < locations[i].top.parts[j].width) {
          frameSize.width = locations[i].top.parts[j].width;
        }
        locations[i].top.parts[j].height = Math.ceil(partSize.height / unitSize.height);
        locations[i].top.parts[j].y = locations[i].spaces.top;
        this.setDisplayObjectPositionByPart(locations[i].top.parts[j]);
        locations[i].spaces.top += locations[i].top.parts[j].height;
      }
    }
    locations[i].spaces.bottom += locations[i].spaces.top;
    for (var j = locations[i].bottom.parts.length-1; j > -1; j--) {
      if (locations[i].bottom.parts[j].displayObject instanceof MCT.DisplayObject) {
        partSize = locations[i].bottom.parts[j].displayObject.getSize();
        locations[i].bottom.parts[j].width = Math.ceil(partSize.width / unitSize.width);
        if (frameSize.width < locations[i].bottom.parts[j].width) {
          frameSize.width = locations[i].bottom.parts[j].width;
        }
        locations[i].bottom.parts[j].height = Math.ceil(partSize.height / unitSize.height);
        locations[i].bottom.parts[j].y = locations[i].spaces.bottom;
        this.setDisplayObjectPositionByPart(locations[i].bottom.parts[j]);
        locations[i].spaces.bottom += locations[i].bottom.parts[j].height;
      }
    }
    frameSize.height += locations[i].spaces.bottom - 1;
  }
  //console.log(frameSize, this.displayObjects, frameId, this.frames[frameId]);

  var framePart = this.frames[frameId];
  framePart.x = Math.floor(this.grid.size.width / 2);
  framePart.y = Math.floor(this.grid.size.height / 2);
  this.setDisplayObjectPositionByPart(framePart);

  framePart.width = frameSize.width;
  framePart.height = frameSize.height;
  this.setDisplayObjectSizeByPart(framePart);
}