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

// this file contains the window builder and window functions
// the window builder can build special display object containers to show in front of a scene
// these containers can contain windows with menus, interactions and references to other sub containers
// windows use PIXI graphics objects to draw rectangles for window / menu elements and use PIXI text elements

/* layers
- a window can have different layers, layer 0 is visible at the start
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
- the window builder contains some functions for window actions which have the prefix "window", e.g. "displayWindowClose"
- the function "displayWindowLayerByButton" is an extended button action which needs targetLayer button property and can use element parameters
*/

/* dynamic title / menu texts
- if you do not want to use a fixed lt text id, you can set an object for dynamic texts, use a property name from that in the json file
- e.g. "customTitle" for the "customTitle" text of the dynamic texts object for the current window
- you can use dynamic title definitions for button elements too, the second value of an element array is the text definition
- you can set special text definition handles too, which are predefined, look into displayWindowLayerTextSpecial for that
*/

/* window content
- the first window content is a list view with list elements
*/

// uses mct.pixi.windows from init.js

function displayWindowLayerTextSpecial(text) {
  if (text == "currentPlanet") {
    // special text handle, current planet, needs a valid planet scene!
    return mct.pixi.text.lang[mct.game.planets[mct.game.planets.current[0]].name[mct.game.planets.current[1]]];
  }
  return "";
}

function displayWindowLayerTextGet(text, windowName) {
  if (text.substring(0, 2) == "lt") {
    // language text part
    return mct.pixi.text.lang[text];
  } else if (typeof mct.pixi.windows[windowName].texts[text] != "undefined") {
    // dynamic text part
    return mct.pixi.windows[windowName].texts[text];
  } else {
    // get a special text by the handle in the text var
    return displayWindowLayerTextSpecial(text);
  }
}

// add a text element to the layer
function displayWindowLayerText(location, align, position, padding, textStyle, text, windowName) {
  var style = mct.pixi.text.styles[textStyle];
  style = {font: Math.floor(style[0] * mct.pixi.screen.ratio) + "px " + style[1], fill: style[2]};
  // concat different text part results by text definition array
  if (typeof text != "string" && text.length > 0) {
    var tmp = "";
    for (var i = 0; i < text.length; i++) {
      if (tmp != "") {
        tmp = tmp + " ";
      }
      tmp = tmp + displayWindowLayerTextGet(text[i], windowName);
    }
    text = tmp;
  } else {
    // get single text by text definition
    text = displayWindowLayerTextGet(text, windowName);
  }
  text = new PIXI.Text(text, style);
  if (align == "left") {
    text.position.x = position.x;
  } else if (align == "right") {
    text.position.x = position.x - text.width;
  }
  if (typeof padding.left != "undefined") {
    text.position.x += padding.left * mct.pixi.screen.ratio;
  } else if (typeof padding.right != "undefined") {
    text.position.x -= padding.right * mct.pixi.screen.ratio;
  }
  if (location == "top") {
    text.position.y = position.y;
  } else if (location == "bottom") {
    text.position.y = position.y - text.height;
  }
  if (typeof padding.top != "undefined") {
    text.position.y += padding.top * mct.pixi.screen.ratio;
  } else if (typeof padding.bottom != "undefined") {
    text.position.y -= padding.bottom * mct.pixi.screen.ratio;
  }
  return text;
}

// add a single window layer by using windowName and currentLayerData
function displayWindowLayerContainer(windowName, currentLayerData) {
    var container = new PIXI.DisplayObjectContainer();

    // use layer definitions to build base window graphic
    if (typeof currentLayerData.size.width != "undefined") {
      var layerWidth = currentLayerData.size.width * mct.pixi.screen.ratio;
    } else {
      // add parent layer size, todo
    }

    if (typeof currentLayerData.size.height != "undefined") {
      var layerHeight = currentLayerData.size.height  * mct.pixi.screen.ratio;
    } else {
      // add parent layer size, todo
    }
    var layerTopLeftX = mct.pixi.screen.width / 2 - layerWidth / 2;
    var layerTopLeftY = mct.pixi.screen.height / 2 - layerHeight / 2;

    if (typeof currentLayerData.border.size != "undefined") {
      var layerBorderSize = currentLayerData.border.size * mct.pixi.screen.ratio;
      var layerBorderColor = currentLayerData.border.color;
    } else {
      var layerBorderSize = 0;
    }

    if (typeof currentLayerData.color != "undefined") {
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
    var title = null;
    if (typeof currentLayerData.title != "undefined") {
      var textPosition = { x : 0, y : 0 };
      // get layer title position by align
      if (currentLayerData.title.align == "left") {
        textPosition.x = layerTopLeftX + layerBorderSize;
      } else {
        textPosition.x = layerTopLeftX + layerWidth - layerBorderSize;
      }
      textPosition.y = layerTopLeftY + layerBorderSize;

      // add layer title
      title = displayWindowLayerText(
        "top", // titles have a top location always
        currentLayerData.title.align,
        { x : textPosition.x, y : textPosition.y }, // top left corner
        currentLayerData.title.padding,
        currentLayerData.title.textStyle,
        currentLayerData.title.text,
        windowName // window name to get dynamic texts
      );
      container.addChild(title);
    }

    // layer menus
    if (typeof currentLayerData.menus != "undefined" && currentLayerData.menus.length > 0) {
      var menuPosition = { x: 0, y: 0 };
      var lastLocation = "";

      for (var i = 0; i < currentLayerData.menus.length; i++) {
        var menu = currentLayerData.menus[i];
        // get layer menu position by orientation, align and previous menu at same location
        if (lastLocation != "" && lastLocation != menu.location) {
          menuPosition = { x : 0, y : 0 };
        }
        if (menu.location == "top") {
          if (mct.pixi.windows[windowName].padding.top == 0 && menuPosition.y == 0) {
            if (menu.location == "top" && title != null) {
              menuPosition.y = title.position.y + title.height;
            } else {
              menuPosition.y = layerTopLeftY + layerBorderSize;
            }
          } else {
            menuPosition.y = menuPosition.y + mct.pixi.windows[windowName].padding.top;
          }
        } else {
          if (mct.pixi.windows[windowName].padding.bottom == 0 && menuPosition.y == 0) {
            menuPosition.y = layerTopLeftY + layerHeight - layerBorderSize;
          } else {
            menuPosition.y = menuPosition.y - mct.pixi.windows[windowName].padding.bottom;
          }
        }
        lastLocation = menu.location;
        if (menu.align == "left") {
          menuPosition.x = layerTopLeftX + layerBorderSize;
        } else {
          menuPosition.x = layerTopLeftX + layerWidth - layerBorderSize;
        }

        var lastMenu = displayWindowLayerMenu(
          menu.location,
          menu.align,
          { x : menuPosition.x, y : menuPosition.y },
          menu.padding,
          menu.textStyle,
          menu.buttons,
          windowName // window name for dynamic button texts / elements
        );
        if (menu.location == "top") {
          mct.pixi.windows[windowName].padding.top += lastMenu.children[0].height;
        } else {
          mct.pixi.windows[windowName].padding.bottom += lastMenu.children[0].height;
        }
        // add layer menu
        container.addChild(lastMenu);
      }
    }

    return container;
}

// add a menu element to the layer
function displayWindowLayerMenu(location, align, position, padding, textStyle, buttons, windowName) {

  var container = new PIXI.DisplayObjectContainer();

  // load all buttons, support buttons list with mixed simple buttons and button elements definitions
  // the action property has to be renamed in each new button object,
  // because the pixi.js click function overwrites an "action" property in a magical way !!!
  var loadedButtons = [], button = {}, elements = null;
  for (var i = 0; i < buttons.length; i++) {
    if (typeof buttons[i].elements != "undefined") {
      if (mct.pixi.windows[windowName].elements[buttons[i].elements].length > 0) {
        for (var j = 0; j < mct.pixi.windows[windowName].elements[buttons[i].elements].length; j++) {
          elements = mct.pixi.windows[windowName].elements[buttons[i].elements];
          button = {
            text: elements[j][1],
            targetAction: buttons[i].action,
            actionParameter: elements[j][0]
          }
          if (typeof buttons[i].targetLayer != "undefined") {
            button.targetLayer = buttons[i].targetLayer;
          }
          loadedButtons.push(button);
        }
      }
    } else if (typeof buttons[i].text != "undefined") {
      button = {
        text: buttons[i].text,
        targetAction: buttons[i].action
      }
      if (typeof buttons[i].actionParameter != "undefined") {
        button.actionParameter = button[i].actionParameter;
      }
      loadedButtons.push(button);
    }
  }
  buttons = loadedButtons;
  delete loadedButtons;

  // add menu container to combine buttons with interaction sprites and text elements in one element
  var container = new PIXI.DisplayObjectContainer();
  container.position.x = position.x;
  container.position.y = position.y;

  var buttonPosition = { x : 0, y : 0 };
  var text = null;

  for (var i = 0; i < buttons.length; i++) {

    if (text != null) {
      buttonPosition.x = text.position.x + text.width;
    }
    text = displayWindowLayerText(
      location, align, buttonPosition, padding, textStyle, buttons[i].text, windowName
    );

    var menuBtn = new PIXI.Sprite(PIXI.Texture.fromImage("blank.png"));
    menuBtn.width = text.width;
    menuBtn.height = text.height;
    menuBtn.position.x = text.position.x;
    menuBtn.position.y = text.position.y;

    if (typeof buttons[i].targetAction != "undefined") {
      menuBtn.setInteractive(true);
      mct.pixi.windows.interactions[menuBtn.position.x + " " + menuBtn.position.y] = [
        windowName, buttons[i]
      ];
      menuBtn.click = function(mouseData) {
        var interaction = mct.pixi.windows.interactions[
          mouseData.target.position.x + " " + mouseData.target.position.y
        ];

        var actionCall = interaction[1].targetAction + '("' + interaction[0] + '"';
        if (typeof interaction[1].actionParameter != "undefined") {
          actionCall += ',"' + interaction[1].actionParameter + '"';
        }
        if (interaction[1].action = "displayWindowLayerByButton" && interaction[1].targetLayer > 0) {
          actionCall += ',"' + interaction[1].targetLayer + '"';
        }
        actionCall += ");";
        eval(actionCall);
      }
    }

    container.addChild(menuBtn);
    container.addChild(text);
  }

  return container;
}

// add window by using internal window name, json file for window data and dynamic texts
function displayWindowAdd(name, json, texts, elements) {

  mct.pixi.windows[name] = {
    json : $.parseJSON($.get(json).responseText),
    layers : [],
    texts : texts, // can contain dynamic text definitions with dynamic text keys
    elements : elements, // seperated by element groups, each element contains a handle and a text
    padding : { top : 0, bottom : 0 } // titles and menu elements can create padding spaces for sub-layers
  };

  for (var i = 0; i < mct.pixi.windows[name].json.layers.length; i++) {


    if (i > 0) {
      //mct.pixi.windows[name].layers[i].visible = false;
    } else {
      mct.pixi.windows[name].layers.push(
        displayWindowLayerContainer(name, mct.pixi.windows[name].json.layers[i])
      );

      mct.pixi.stage.addChild(mct.pixi.windows[name].layers[i]);
    }

  }
}

// interaction functions

function displayWindowLayerByButton(windowName, parameter, targetLayer) {
  alert(windowName + " " + parameter + " " + targetLayer);
}

function displayWindowClose(windowName, parameter) {
  for (var i = 0; i < mct.pixi.windows[windowName].layers.length; i++) {
    mct.pixi.windows[windowName].layers[i].visible = false;
    for (var j = 0; j < mct.pixi.windows[windowName].layers[i].children.length; j++) {
      // pixi.js has a bug with Graphics inside a container, needs manual visibility change for childs
      // see https://github.com/GoodBoyDigital/pixi.js/issues/234
      mct.pixi.windows[windowName].layers[i].children[j].visible = false;
    }
  }
  console.log(mct.pixi.windows[windowName].layers);
}
