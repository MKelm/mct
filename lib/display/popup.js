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
- each layer can contain menus
- menus have a "top" or "bottom" location, do not mix it, define all "top" menus first and then all "bottom" menus
- menus have a "left" or "right" margin, do not mix it, define all "left" menus of a location first and then all "right" menus of this location
- a menu can contain a padding "top" / "bottom" / "left" / "right" in relation to the layer border, the location and other menus
- each menu contains a "textStyle" property and a list of "buttons"
- buttons have a "text" (lt id) and an "action" function name, "text" can contain arrays for concated strings too
- or use "elements" instead, to use dynamic button elements with title and parameter value if you want to use extended button "actions"
- the popup builder contains some functions for popup actions which have the prefix "popup", e.g. "displayPopupClose"
- the function "displayPopupLayerByButton" is an extended button action which needs targetLayer button property and can use element parameters
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
function displayPopupLayerText(location, align, position, padding, textStyle, text, popupName) {
  var style = mct.pixi.text.styles[textStyle];
  style = {font: Math.floor(style[0] * mct.display.ratio) + "px " + style[1], fill: style[2]};
  // concat different text elements by text array
  if (typeof text != String && text.length > 0) {
    var tmp = "";
    for (var i = 0; i < text.length; i++) {
      if (tmp != "") {
        tmp = tmp + " ";
      }
      if (text[i].substring(0, 2) == "lt") {
        // language text part
        tmp = tmp + mct.pixi.text.lang[text[i]];
      } else if (text[i] == "currentPlanet") {
        // special text part, current planet, needs a valid planet scene!
        tmp = tmp + mct.pixi.text.lang[mct.game.planets[mct.game.planets.current[0]].name[mct.game.planets.current[1]]];
      }
    }
    text = tmp;
  } else {
    // language text
    text = mct.pixi.text.lang[text];
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
  if (location == "top") {
    text.position.y = position.y;
  } else if (location == "bottom") {
    text.position.y = position.y - text.height;
  }
  if (padding.top != undefined) {
    text.position.y += padding.top * mct.display.ratio;
  } else if (padding.bottom != undefined) {
    text.position.y -= padding.bottom * mct.display.ratio;
  }
  return text;
}

// add a single popup layer by using popupName and currentLayerData
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

    // layer title
    if (currentLayerData.title != undefined) {
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
          "top", // titles have a top location always
          currentLayerData.title.align,
          { x : textPosition.x, y : textPosition.y }, // top left corner
          currentLayerData.title.padding,
          currentLayerData.title.textStyle,
          currentLayerData.title.text,
          popupName // popup name to get dynamic texts
        )
      );
    }

    // layer menus
    if (currentLayerData.menus != undefined && currentLayerData.menus.length > 0) {
      var menuPosition = { x : 0, y : 0 };
      var lastLocation = "";

      mct.display.popups[popupName].tmp = { width : 0, height : 0 }; // temp values of last menu size

      for (var i = 0; i < currentLayerData.menus.length; i++) {
        var menu = currentLayerData.menus[i];
        // get layer menu position by orientation, align and previous menu at same location
        if (lastLocation != "" && lastLocation != menu.location) {
          menuPosition = { x : 0, y : 0 };
          mct.display.popups[popupName].tmp = { width : 0, height : 0 };
        }
        if (menu.location == "top") {
          if (mct.display.popups[popupName].tmp.height == 0 && menuPosition.y == 0) {
            menuPosition.y = layerTopLeftY + layerBorderSize;
          } else {
            menuPosition.y = menuPosition.y + mct.display.popups[popupName].tmp.height;
          }
        } else {
          if (mct.display.popups[popupName].tmp.height == 0 && menuPosition.y == 0) {
            menuPosition.y = layerTopLeftY + layerHeight - layerBorderSize;
          } else {
            menuPosition.y = menuPosition.y - mct.display.popups[popupName].tmp.height;
          }
        }
        if (menu.align == "left") {
          menuPosition.x = layerTopLeftX + layerBorderSize;
        } else {
          menuPosition.x = layerTopLeftX + layerWidth - layerBorderSize;
        }

        // add layer menu
        displayPopupLayerMenu(
          menu.location,
          menu.align,
          { x : menuPosition.x, y : menuPosition.y },
          menu.padding,
          menu.textStyle,
          menu.buttons,
          popupName // popup name for dynamic button texts / elements
        );
      }
    }

    return container;
}

// add a menu element to the layer
function displayPopupLayerMenu(location, align, position, padding, textStyle, buttons, popupName) {

  /*var buttonPosition = { x : 0, y : 0 };
  if (align == "left") {
    buttonPosition.x = position.x;
  } else if (align == "right") {
    buttonPosition.x = position.x - text.width;
  }

  if (padding.left != undefined) {
    text.position.x += padding.left * mct.display.ratio;
  } else if (padding.right != undefined) {
    text.position.x -= padding.right * mct.display.ratio;
  }
  if (location == "top") {
    text.position.y = position.y;
  } else if (location == "bottom") {
    text.position.y = position.y - text.height;
  }
  if (padding.top != undefined) {
    text.position.y += padding.top * mct.display.ratio;
  } else if (padding.bottom != undefined) {
    text.position.y -= padding.bottom * mct.display.ratio;
  }


  var menuBtn = new PIXI.Sprite(PIXI.Texture.fromImage("gfx/blank.png"));
  menuBtn.width = menuText.width;
  menuBtn.height = menuText.height;
  menuBtn.position.x = menuText.position.x;
  menuBtn.position.y = menuText.position.y;
  menuBtn.setInteractive(true);
  mct.pixi.scenes.interactions.planetCompaniesList[menuBtn.position.x + " " + menuBtn.position.y] = fp;
  menuBtn.click = function(mouseData) {
     var tf = mct.pixi.scenes.interactions.planetCompaniesList[
       mouseData.target.position.x + " " + mouseData.target.position.y
     ];
     // open technology field menu
     if (mct.game.data.technologies.fields[tf].companies.for == "type") {
       displayScenePlanetCompaniesFieldMenuAdd(tf);
     } else {
       // open field companies menu
       displayScenePlanetCompaniesListContentAdd(tf);
     }
  }
  scene.addChild(menuBtn); */

}

// add popup by using internal popup name, json file for popup data and dynamic texts
function displayPopupAdd(name, json, texts) {

  mct.display.popups[name] = {
    json : $.parseJSON($.get(json).responseText),
    layers : [],
    texts : texts,
    tmp : null // e.g. the layer menu creation needs a temp var to store the last menu size
  };

  for (var i = 0; i < mct.display.popups[name].json.layers.length; i++) {

    // just add layers which are not hidden, hidden layers depend on other layers
    if (mct.display.popups[name].json.layers[i].hidden != true) {

      mct.display.popups[name].layers.push(
        displayPopupLayerContainer(name, mct.display.popups[name].json.layers[i])
      );

      if (i > 0) {
        mct.display.popups[name].layers[i].visible = false;
      }
      mct.pixi.stage.addChild(mct.display.popups[name].layers[i]);
    }
  }

}
