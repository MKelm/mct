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

// display ui panel window class
// a windos is a base panel and can contain layer panels

MCT.DisplayUIPanelWindow = function(name, unitSize, position, jsonHandle) {
  MCT.DisplayUIPanel.call(this, name || "window" + (Math.random() * 1000), unitSize, position);

  this.config = mct.util.loadJSON("./lib/data/display/window/" + jsonHandle + ".json");

  for (var i = 0; i < this.config.layers.length; i++) {
    this.initializeLayer(i);
    this.setTitles(i);
    this.setMenus(i);
  }

  this.addEventListener('click', this.onButtonClick.curry());

  this.layout.calculate();
}

MCT.DisplayUIPanelWindow.prototype = Object.create(MCT.DisplayUIPanel.prototype);
MCT.DisplayUIPanelWindow.prototype.constructor = MCT.DisplayUIPanelWindow;

// initialize panel layout by using layer configuration
MCT.DisplayUIPanelWindow.prototype.initializeLayer = function(layerId) {

  var layer = this.config.layers[layerId];
  layer.visible = Boolean(layer.visible);

  // interaction status values contain a sourceZIndex,targetZindex,parameter key and can
  // contain a chain of parameter values inside an array if the status depends on further
  // source layer interactions, e.g. layerInteractions[3].status."1,3,reaction".["nose","sel","reaction"]
  // the status.current value would be "1,3,reaction" and the related interaction status
  // contains a layer connection between layer 1 and 3 with 2 parent layer status values
  // (from layer 1 and 0) and the current "reaction" status which defines the whole layers'
  // interaction chain status
  layer.interactions = { status : { current : "" } };

  if (typeof layer.titles == "object" && layer.titles.length > 0) {
    for (var i = 0; i < layer.titles.length; i++) {
      layer.titles[i].partName = this.layout.addPart({ x: 0, y: 0, anchor: true, zindex: layerId+1 });
      this.layout.addPartOptions(
        layer.titles[i].partName, { location: "top", visible: layer.visible  }
      );
    }
  }
  if (typeof layer.menus == "object" && layer.menus.length > 0) {
    for (var i = 0; i < layer.menus.length; i++) {
      layer.menus[i].partName = this.layout.addPart({ x: 0, y: 0, anchor: true, zindex: layerId+1 });
      this.layout.addPartOptions(
        layer.menus[i].partName,
        { location: layer.menus[i].location || "top", visible: layer.visible }
      );
    }
  }
  if (typeof layer.contents == "object" && layer.contents.length > 0) {
    for (var i = 0; i < layer.contents.length; i++) {
      layer.contents[i].partName = this.layout.addPart({ x: 0, y: 0, anchor: true, zindex: layerId+1 });
      this.layout.addPartOptions(
        layer.contents[i].partName,
        { location: layer.contents[i].location || "top", visible: layer.visible }
      );
    }
  }

}

// sets title display objects for all visible layers to layout parts
MCT.DisplayUIPanelWindow.prototype.setTitles = function(layerId) {
  var layer = this.config.layers[layerId], pn = "";

  if (layer.visible === true) {
    if (typeof layer.titles == "object" && layer.titles.length > 0) {
      for (var i = 0; i < layer.titles.length; i++) {
        pn = layer.titles[i].partName;
        if (!(this.layout.parts[pn].displayObject instanceof MCT.DisplayObject)) {
          this.layout.addDisplayObjectToPart(
            pn,
            this.layout.displayObjects.add(
              "layer"+layerId+"title"+i, "text",
              { style: layer.titles[i].textStyle, value: layer.titles[i].text, anchor: {x: 0, y: 0} }
            )
          );
        }
      }
    }
  }
}

// sets menu display objects for all visible layers to layout parts
MCT.DisplayUIPanelWindow.prototype.setMenus = function(layerId) {
  var layer = this.config.layers[layerId], pn = "";

  if (layer.visible === true) {
    if (typeof layer.menus == "object" && layer.menus.length > 0) {
      for (var i = 0; i < layer.menus.length; i++) {
        pn = layer.menus[i].partName;
        if (!(this.layout.parts[pn].displayObject instanceof MCT.DisplayObject)) {
          this.layout.addDisplayObjectToPart(
            pn,
            // just one button support yet
            this.layout.displayObjects.add(
              "layer"+layerId+"menu"+i+"button"+0, "button",
              {
                interaction : { type: "click", element: this, content: { action: layer.menus[i].buttons[0].action } },
                text: { style: layer.menus[i].textStyle, value: layer.menus[i].buttons[0].text },
                anchor: {x: 0, y: 0}
              }
            )
          );
        }
      }
    }
  }
}

MCT.DisplayUIPanelWindow.prototype.onButtonClick = function(event) {
  if (typeof event.content.action != "undefined") {
    switch (event.content.action) {
      case "windowClose":
        event.content.element.layout.setVisibility(false);
        mct.sceneHandler.update();
        break;
    }
  }
}