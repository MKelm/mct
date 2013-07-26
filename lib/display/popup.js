/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mkelm/mct
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

// this file contains the popup builder and popup functions
// the popup builder can build special display object containers to show in front of a scene
// these containers can contain popups with menus, interactions and references to other sub containers
// popups use PIXI graphics objects to draw rectangles for window / menu elements and use PIXI text elements

/* layers
- a popup can have different layers, layer 0 is visible at the start
- other layers can be shown by action calls or must depend on other conditions e.g. in the first layer
- each layer has a color and a size (width/height) related to the base app size
- additionally the layer can have a border with size/color
- all layers higher than 0 (first) can have a parentLayer index value, if the parent layer is not the previous one
- all layers higher than 0 should not need a size, because they can use the parentLayer size, they can contain a border too
- if a size value is missing, the child layer gets the size value of the parentLayer
- all layers higher than 0 (first) can contain a margin for left/right/top/bottom in relation to the parentLayer size
- a layer can contain a title with "padding", "textStyle", "text" (lt id) like menus / buttons
*/

/* menus and buttons
- each layer can contain menus "top" or "bottom"
- "top" and "bottom" menus have a horizontal align "left" or "right"
- a menu can contain a padding "top" / "bottom" / "left" / "right" in relation to the layer border and other menus
- each menu contains a "textStyle" property and a list of "buttons"
- buttons have a "text" (lt id) and an "action" function name
- the popup builder contains some functions for popups which have the prefix "popup", e.g. "displayPopupClose"
*/

/* dynamic title / menu texts
- if you do not want to use a fixed lt text id, you can set an array with a text container array and a index value
- e.g. "titles", 0 for the first element of the "titles" text container array for the current popup
- if you have a list of dynamic titles for a menu, you can set a callback function name to get a buttons list from
*/

/* popup content
- the first popup content is a list view with list elements
*/

mct.display.popups = { };

// add a text element to the layer
function displayPopupLayerText(orientation, align, position, padding, textStyle, text, popupName) {
  var style = mct.pixi.text.styles[textStyle];
  style = {font: Math.floor(style[0] * mct.display.ratio) + "px " + style[1], fill: style[2]};
  if (typeof text[1] != undefined && text.length == 2) {
    text = mct.display.popups[popupName].texts[text[0]][text[1]];
  }
  text = new PIXI.Text(text, style);
  if (align == "left") {
    text.position.x = position.x;
  } else if (align == "right") {
    text.position.x = position.x - text.width;
  }

  if (padding.left != undefined) {
    text.position.x += padding.left * mct.display.ratio;
  } else if (padding.right != undefined) {
    text.position.x -= padding.right * mct.display.ratio;
  }
  if (orientation == "top") {
    text.position.y = position.y;
  } else if (orientation == "bottom") {
    text.position.y = position.y - text.height;
  }
  if (padding.top != undefined) {
    text.position.y += padding.top * mct.display.ratio;
  } else if (padding.bottom != undefined) {
    text.position.y -= padding.bottom * mct.display.ratio;
  }
  return text;
}

function displayPopupLayerContainer(popupName, currentLayerData) {
  var container = new PIXI.DisplayObjectContainer();

    // use layer definitions to build base popup graphic
    if (currentLayerData.size.width != undefined) {
      var layerWidth = currentLayerData.size.width * mct.display.ratio;
    } else {
      // add parent layer size, todo
    }

    if (currentLayerData.size.height != undefined) {
      var layerHeight = currentLayerData.size.height  * mct.display.ratio;
    } else {
      // add parent layer size, todo
    }
    var layerTopLeftX = mct.display.width / 2 - layerWidth / 2;
    var layerTopLeftY = mct.display.height / 2 - layerHeight / 2;

    if (currentLayerData.border.size != undefined) {
      var layerBorderSize = currentLayerData.border.size * mct.display.ratio;
      var layerBorderColor = currentLayerData.border.color;
    } else {
      var layerBorderSize = 0;
    }

    if (currentLayerData.color != undefined) {
      var layerColor = currentLayerData.color;
    } else {
      // use parent layer color, todo
    }

    var layerGfx = new PIXI.Graphics();
    layerGfx.beginFill(layerColor);
    if (layerBorderSize > 0) {
      layerGfx.lineStyle(layerBorderSize, layerBorderColor);
    }
    layerGfx.drawRect(layerTopLeftX, layerTopLeftY, layerWidth, layerHeight);
    container.addChild(layerGfx);

    // get layer title position by align
    var textPosition = { x : 0, y : 0 };
    if (currentLayerData.title.align == "left") {
      textPosition.x = layerTopLeftX + layerBorderSize;
    } else {
      textPosition.x = layerTopLeftX + layerWidth - layerBorderSize;
    }
    textPosition.y = layerTopLeftY + layerBorderSize;
    // add layer title
    container.addChild(
      displayPopupLayerText(
        "top", // titles have a top orientation always
        currentLayerData.title.align,
        { x : textPosition.x, y : textPosition.y }, // top left corner
        currentLayerData.title.padding,
        currentLayerData.title.textStyle,
        currentLayerData.title.text,
        popupName // popup name to get dynamic texts
      )
    );

    return container;
}

function displayPopupAdd(name, json, texts) {

  mct.display.popups[name] = {
    json : $.parseJSON($.get(json).responseText),
    layers : [],
    texts : texts
  };

  for (var i = 0; i < mct.display.popups[name].json.layers.length; i++) {

    mct.display.popups[name].layers.push(
      displayPopupLayerContainer(name, mct.display.popups[name].json.layers[i])
    );

    mct.pixi.stage.addChild(mct.display.popups[name].layers[0]);
    console.log(1);
  }


}
