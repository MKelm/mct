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

    var name = mct.data.planets[mct.status.planet].name[
      mct.data.planets[mct.status.planet].storyVersion
    ];
    if (typeof name == "string") {
      return name;
    } else {
      return name[mct.status.lang];
    }
  }
  return text; // no special text, return given text value
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
function displayWindowLayerText(location, align, position, padding, textStyle, textLineLength, text, windowName) {
  var style = mct.pixi.text.styles[textStyle];
  style = {font: Math.floor(style[0] * mct.pixi.screen.ratio) + "px " + style[1], fill: style[2]};
  // concat different text part results by text definition array
  if (typeof text == "string") {
    // get single text by text definition, or concatened / multiline line text by dyntext value
    text = displayWindowLayerTextGet(text, windowName);
  }

  var tmp = "";
  if (typeof text != "string" && text.length > 0) {
    for (var i = 0; i < text.length; i++) {
      if (i > 0 && (
          (typeof textLineLength != "undefined" && text[i].substring(text[i].length-1) != " ") ||
          (typeof textLineLength == "undefined" && tmp !== "")
         )) {
        tmp = tmp + " ";
      }
      tmp = tmp + displayWindowLayerTextGet(text[i], windowName);
    }
    text = tmp;
  }

  // multi line support by using a given text line length
  if (typeof textLineLength == "number") {
    tmp = "";
    var i = -1, j = 0, lines = [];
    do {
      i++;
      if (i < text.length) {
        if (tmp.length > 0 || text.substring(i, i+1) != " ") {
          tmp += text.substring(i, i+1);
          if (tmp.length == textLineLength) {
            j = 0;
            var tmp2 = text.substring(i+1, i+2);
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
    } while (i < text.length - 1);
    if (tmp !== "") {
      lines.push(tmp);
    }
    if (lines.length > 0) {
      text = "";
      for (i = 0; i < lines.length; i++) {
        text += lines[i];
        if (i < lines.length - 1) {
          text += "\n";
        }
      }
    }
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
function displayWindowLayerContainer(windowName, currentLayer, currentLayerData) {
    var container = new PIXI.DisplayObjectContainer();

    // use layer definitions to build base window graphic
    var layerWidth = 0;
    if (typeof currentLayerData.size.width != "undefined") {
      layerWidth = currentLayerData.size.width * mct.pixi.screen.ratio;
    }
    var layerHeight = 0;
    if (typeof currentLayerData.size.height != "undefined") {
      layerHeight = currentLayerData.size.height  * mct.pixi.screen.ratio;
    }
    if (typeof currentLayerData.position == "undefined") {
      var layerTopLeftX = mct.pixi.screen.width / 2 - layerWidth / 2;
      var layerTopLeftY = mct.pixi.screen.height / 2 - layerHeight / 2;
    } else {
      // use fixed position for (sub) layers, espacially important in relation to top/bottom layerCover
      var layerTopLeftX = currentLayerData.position.x;
      var layerTopLeftY = currentLayerData.position.y;
    }

    if (typeof currentLayerData.border.size != "undefined") {
      var layerBorderSize = currentLayerData.border.size * mct.pixi.screen.ratio;
      var layerBorderColor = currentLayerData.border.color;
    } else {
      var layerBorderSize = 0;
    }

    if (typeof currentLayerData.color != "undefined") {
      var layerColor = currentLayerData.color;
    }

    var layerGfx = new PIXI.Graphics();
    layerGfx.position.x = layerTopLeftX;
    layerGfx.position.y = layerTopLeftY;
    layerGfx.beginFill(layerColor);
    if (layerBorderSize > 0) {
      layerGfx.lineStyle(layerBorderSize, layerBorderColor);
    }
    layerGfx.drawRect(0, 0, layerWidth, layerHeight);
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
        null,
        currentLayerData.title.text,
        windowName // window name to get dynamic texts
      );
      container.addChild(title);

      mct.pixi.windows[windowName].layerCovers[currentLayer].top +=
        (title.position.y - (layerTopLeftY + layerBorderSize)) + title.height;
    }

    // layer menus
    if (typeof currentLayerData.menus != "undefined" && currentLayerData.menus.length > 0) {
      var menuSpace = { top: 0, bottom : 0 };
      var menuPosition = { x: 0, y: 0 };
      var lastLocation = "";

      for (var i = 0; i < currentLayerData.menus.length; i++) {
        var menu = currentLayerData.menus[i];
        // get layer menu position by orientation, align and previous menu at same location
        if (lastLocation !== "" && lastLocation != menu.location) {
          menuPosition = { x : 0, y : 0 };
        }
        if (menu.location == "top") {
          if (menuSpace.top === 0 && menuPosition.y === 0) {
            if (menu.location == "top" && title !== null) {
              menuPosition.y = title.position.y + title.height;
            } else {
              menuPosition.y = layerTopLeftY + layerBorderSize;
            }
          } else {
            menuPosition.y = menuPosition.y + menuSpace.top;
          }
        } else {
          if (menuSpace.bottom === 0 && menuPosition.y === 0) {
            menuPosition.y = layerTopLeftY + layerHeight - layerBorderSize;
          } else {
            menuPosition.y = menuPosition.y - menuSpace.bottom;
          }
        }
        if (menu.align == "left") {
          menuPosition.x = layerTopLeftX + layerBorderSize;
        } else {
          menuPosition.x = layerTopLeftX + layerWidth - layerBorderSize;
        }

        var lastMenu = displayWindowLayerElements(
          menu.location,
          menu.align,
          { x : menuPosition.x, y : menuPosition.y },
          menu.padding,
          menu.textStyle,
          null,
          menu.buttons,
          'buttons',
          windowName, // window name for dynamic button texts / elements
          currentLayer // current layer id for dynamic button actions
        );
        if (menu.location == "top" && lastMenu.children.length > 0) {
          mct.pixi.windows[windowName].layerCovers[currentLayer].top =
            (lastMenu.position.y - (layerTopLeftY + layerBorderSize)) +
            (lastMenu.children[0].position.y + lastMenu.children[0].height);
          menuSpace.top += lastMenu.children[0].height;
        } else if (lastMenu.children.length > 0) {
          mct.pixi.windows[windowName].layerCovers[currentLayer].bottom =
            ((layerTopLeftY + layerHeight - layerBorderSize) - lastMenu.position.y) -
              lastMenu.children[0].position.y;
          menuSpace.bottom += lastMenu.children[0].height;
        }
        // add layer menu
        container.addChild(lastMenu);
        lastLocation = menu.location;
      }
    }

    // layer contents
    if (typeof currentLayerData.contents != "undefined" && currentLayerData.contents.length > 0) {
      var contentSpacePosition = {
        top: mct.pixi.windows[windowName].layerCovers[currentLayer].top + layerTopLeftY + layerBorderSize,
        bottom : (layerTopLeftY + layerHeight) -
          (mct.pixi.windows[windowName].layerCovers[currentLayer].bottom + layerBorderSize)
      };
      var contentPosition = { x: 0, y: 0 };
      var lastLocation = "";

      for (var i = 0; i < currentLayerData.contents.length; i++) {
        var content = currentLayerData.contents[i];
        // get layer content position by orientation, align and previous content at same location
        if (lastLocation !== "" && lastLocation != content.location) {
          contentPosition = { x : 0, y : 0 };
        }
        if (content.location == "top") {
          if (contentPosition.y === 0) {
            contentPosition.y = contentSpacePosition.top;
          } else {
            contentPosition.y += lastContent.children[0].height +
              (lastContent.children[0].position.y - contentPosition.y);
          }
        } else {
          if (contentPosition.y === 0) {
            contentPosition.y = contentSpacePosition.bottom;
          } else {
            contentPosition.y = lastContent.children[0].position.y;
          }
        }
        if (content.align == "left") {
          contentPosition.x = layerTopLeftX + layerBorderSize;
        } else {
          contentPosition.x = layerTopLeftX + layerWidth - layerBorderSize;
        }

        // the textLineLenght / columns values usage is not clean,
        // but it will become obsolete in a later step, if the calculation of max text lenghts
        // by window / layer area width will be implemented!
        var lastContent = displayWindowLayerElements(
          content.location,
          content.align,
          { x : contentPosition.x, y : contentPosition.y },
          content.padding,
          content.textStyle,
          (typeof content.textLineLength != "undefined") ? content.textLineLength : content.maxListSize,
          (typeof content.text != "undefined") ? content.text : content.elements,
          (typeof content.maxListSize != "undefined") ? "list" : 'text',
          windowName, // window name for dynamic texts / elements
          currentLayer
        );
        // add layer content
        container.addChild(lastContent);
        lastLocation = content.location;
      }
    }

    return container;
}

function displayWindowLayerElementsGetByStatus(elements, status, statusPosition) {
  if (typeof statusPosition == "undefined") {
    statusPosition = 0;
  }
  if (typeof elements[status[statusPosition]] != "undefined") {
    return displayWindowLayerElementsGetByStatus(elements[status[statusPosition]], status, statusPosition + 1);
  } else {
    return elements;
  }
}

// add menu / content elements to the layer
function displayWindowLayerElements(
           location, align, position, padding, textStyle, textLineLength,
           elements, elementsType, windowName, currentLayer
         ) {

  // add menu container to combine elements with further text and/or interaction sprites
  var container = new PIXI.DisplayObjectContainer();
  container.position.x = position.x;
  container.position.y = position.y;

  if (elementsType == "text") {
    // text elements can be extended with list-text elements later
    container = new PIXI.DisplayObjectContainer();
    container.addChild(
      displayWindowLayerText(
        location, align, position, padding, textStyle, textLineLength, elements, windowName
      )
    );
  } else if (elementsType == "list") {
    // lists can have buttons to so the implementation of lists will be mixed with the buttons
    // implementation in a later step, the first implementation of lists is for non interactive
    // text elements only!
    var layerStatus = [];
    var actionStatusHandle = mct.pixi.windows[windowName].layerInteractions[currentLayer].status.current;
    var chain = mct.pixi.windows[windowName].layerInteractions[currentLayer].status[actionStatusHandle];
    for (var o = 0; o < chain.length; o++) {
      layerStatus.push(chain[o][1]);
    }

    elements = displayWindowLayerElementsGetByStatus(
      mct.pixi.windows[windowName].elements[elements], layerStatus
    );
    if (elements.length > 0) {
      var text = null;
      var elementPosition = { x : 0, y : 0 };
      // just a test with 5 elements until column / paging support is implemented
      for (var i = 0; i < textLineLength[1]; i++) {
        if (text !== null) {
          elementPosition.y += text.height;
        }
        text = displayWindowLayerText(
          location, align, elementPosition, padding, textStyle, null, elements[i][1], windowName
        );
        container.addChild(text);
      }
    }

  } else if (elementsType == "buttons") {
    // load all buttons, support buttons list with mixed simple buttons and button elements definitions
    // the action property has to be renamed in each new button object,
    // because the pixi.js click function overwrites an "action" property in a magical way !!!
    var loadedButtons = [], button = {}, items = [];
    // note this implementation does not support button elements definition with a single buttons set yet
    // you have to set an array in the buttons defintion in every case
    for (var i = 0; i < elements.length; i++) {
      if (typeof elements[i].elements != "undefined") {

        if (mct.pixi.windows[windowName].elements[elements[i].elements].length > 0) {
          for (var j = 0; j < mct.pixi.windows[windowName].elements[elements[i].elements].length; j++) {
            items = mct.pixi.windows[windowName].elements[elements[i].elements];
            button = {
              text: items[j][1],
              targetAction: elements[i].action,
              actionParameter: items[j][0]
            };
            if (typeof elements[i].targetLayer != "undefined") {
              button.targetLayer = elements[i].targetLayer;
            }
            loadedButtons.push(button);
          }
        } else if (typeof elements[i].targetLayer != "undefined") {
          var actionStatusHandle = mct.pixi.windows[windowName].layerInteractions[currentLayer].status.current;
          // just an implementation for interactions chains with one parent layer yet!!!
          var currentActionParameter =
            mct.pixi.windows[windowName].layerInteractions[currentLayer].status[actionStatusHandle][
              mct.pixi.windows[windowName].layerInteractions[currentLayer].status[actionStatusHandle].length - 1
            ];
          if (mct.pixi.windows[windowName].elements[elements[i].elements][currentActionParameter[1]].length > 0) {
            for (var j = 0; j < mct.pixi.windows[windowName].elements[elements[i].elements][currentActionParameter[1]].length; j++) {
              items = mct.pixi.windows[windowName].elements[elements[i].elements][currentActionParameter[1]];
              button = {
                text: items[j][1],
                targetAction: elements[i].action,
                actionParameter: items[j][0]
              };
              if (typeof elements[i].targetLayer != "undefined") {
                button.targetLayer = elements[i].targetLayer;
              }
              loadedButtons.push(button);
            }
          }
        }
      } else if (typeof elements[i].text != "undefined") {
        button = {
          text: elements[i].text,
          targetAction: elements[i].action
        };
        if (typeof elements[i].actionParameter != "undefined") {
          button.actionParameter = button[i].actionParameter;
        }
        loadedButtons.push(button);
      }
    }
    var buttons = loadedButtons;

    var buttonPosition = { x : 0, y : 0 };
    var text = null;
    for (var i = 0; i < buttons.length; i++) {
      if (text !== null) {
        buttonPosition.x = text.position.x + text.width;
      }
      text = displayWindowLayerText(
        location, align, buttonPosition, padding, textStyle, null, buttons[i].text, windowName
      );

      var menuBtn = new PIXI.Sprite(PIXI.Texture.fromImage("blank"));
      menuBtn.width = text.width;
      menuBtn.height = text.height;
      menuBtn.position.x = text.position.x;
      menuBtn.position.y = text.position.y;

      if (typeof buttons[i].targetAction != "undefined") {
        menuBtn.setInteractive(true);
        menuBtn.elementData = [windowName, currentLayer, buttons[i]];
        menuBtn.click = displayWindowLayerElementClick;
      }

      container.addChild(menuBtn);
      container.addChild(text);
    }
  }
  return container;
}

function displayWindowLayerElementClick(mouseData) {
  audioPlayEffect("ef.click2");
  var data = mouseData.target.elementData, actionParameter = null, targetLayer = null;
  if (typeof data[2].actionParameter != "undefined") {
    actionParameter = data[2].actionParameter;
  }
  if (data[2].targetAction == "displayWindowLayer" && data[2].targetLayer > 0) {
    targetLayer = data[2].targetLayer;
  }
  window[data[2].targetAction](data[0], data[1], actionParameter, targetLayer);
}

// add window by using internal window name, json file for window data and dynamic texts
function displayWindowAdd(name, json, texts, elements) {

  mct.pixi.windows[name] = {
    json : $.parseJSON($.get(json).responseText),
    layers : [],
    layerCovers : [], // titles and menu elements of layers can create cover spaces for sub-layers
    layerInteractions : [], // storage for interactions of invisible layers
    texts : texts, // can contain dynamic text definitions with dynamic text keys
    elements : elements // seperated by element groups, each element contains a handle and a text
  };

  for (var i = 0; i < mct.pixi.windows[name].json.layers.length; i++) {
    displayWindowLayer(name, -1, "default", i);
  }
}

// interaction functions

function displayWindowLayer(windowName, sourceLayer, parameter, targetLayer) {
  // note layers with "default" parameter value needs a source layer property! [implementation todo]
  var perform = false, customPosition = null, statusChain = [];

  if (typeof targetLayer != "undefined" && targetLayer > 0 &&
      typeof sourceLayer != "undefined" && sourceLayer > -1) {
    // open sub layer
    perform = true;

    // create sub layer data with dependencies
    if (typeof mct.pixi.windows[windowName].layers[targetLayer].placeholder != "undefined") {

      var position = { // use Graphic child object, because the layer container does not have a position yet!
        x : mct.pixi.windows[windowName].layers[sourceLayer].children[0].position.x,
        y : mct.pixi.windows[windowName].layerCovers[sourceLayer].top +
          mct.pixi.windows[windowName].layers[sourceLayer].children[0].position.y
      };

      // the new layer size depends on the source layer size and the layers' cover spaces
      var w = mct.pixi.windows[windowName].json.layers[sourceLayer].size.width;
      var h = mct.pixi.windows[windowName].json.layers[sourceLayer].size.height;
      if (typeof mct.pixi.windows[windowName].json.layers[sourceLayer].border.size != "undefined") {
        w -= (2 * mct.pixi.windows[windowName].json.layers[sourceLayer].border.size);
        h -= (2 * mct.pixi.windows[windowName].json.layers[sourceLayer].border.size);

        position.x += mct.pixi.windows[windowName].json.layers[sourceLayer].border.size;
        position.y += mct.pixi.windows[windowName].json.layers[sourceLayer].border.size;
      }
      // use ratio to get default size here, because the ratio will be used later to scale again
      h -= mct.pixi.windows[windowName].layerCovers[sourceLayer].top / mct.pixi.screen.ratio;
      h -= mct.pixi.windows[windowName].layerCovers[sourceLayer].bottom / mct.pixi.screen.ratio;
      mct.pixi.windows[windowName].json.layers[targetLayer].size = { width : w, height : h };
      mct.pixi.windows[windowName].json.layers[targetLayer].position = position;

      mct.pixi.windows[windowName].json.layers[targetLayer].parentLayer = Number(sourceLayer);
    }

    // update interaction status in target layer by current interaction and parent layer status values
    // without these informations a window / layer does not know different layer states by different
    // interaction chains and can not show different types of contents (data) in the related window/layer
    var actionStatusHandle = sourceLayer + "," + targetLayer + "," + parameter;

    if (mct.pixi.windows[windowName].layerInteractions[targetLayer].status.current != actionStatusHandle) {

      // optional: add action status chain from parent layer
      if (mct.pixi.windows[windowName].layerInteractions[sourceLayer].status.current !== "") {
        var actionStatusKey = mct.pixi.windows[windowName].layerInteractions[sourceLayer].status.current;
        if (mct.pixi.windows[windowName].layerInteractions[sourceLayer].status[actionStatusKey].length > 0) {
          statusChain = mct.pixi.windows[windowName].layerInteractions[sourceLayer].status[actionStatusKey];
        }
      }

      // avoid duplicated entries of a target layer in the action status chain if the layer will
      // be activated and overwrite an existing entry with the new action parameter to change the status
      var exists = false;
      if (statusChain.length > 0) {
        for (var p = 0; p < statusChain.length; p++) {
          if (statusChain[p][0] == targetLayer) {
            exists = true;
            statusChain[p] = [targetLayer, parameter];
            break;
          }
        }
      }
      if (exists === false) {
        statusChain.push([targetLayer, parameter]);
      }

      // an existing target layer must be deleted to create a new one with contents depending on the
      // current action parameter (acstion status)
      if (typeof mct.pixi.windows[windowName].layers[targetLayer].placeholder == "undefined") {
        mct.pixi.stage.removeChild(mct.pixi.windows[windowName].layers[targetLayer]);
        delete mct.pixi.windows[windowName].layers[targetLayer];
        mct.pixi.windows[windowName].layers[targetLayer] = { placeholder : 1 };
        console.log("remove layer " + targetLayer);
      }

      mct.pixi.windows[windowName].layerInteractions[targetLayer].status[actionStatusHandle] = statusChain;
      mct.pixi.windows[windowName].layerInteractions[targetLayer].status.current = actionStatusHandle;
    }
    // all parent layers and the target layer have to be visible
    var layersToShow = (sourceLayer === 0) ? [0] : [0, sourceLayer];
    if (mct.pixi.windows[windowName].layerInteractions[targetLayer].status[actionStatusHandle].length > 0) {
      for (var m = 0; m < mct.pixi.windows[windowName].layerInteractions[targetLayer].status[actionStatusHandle].length; m++) {
        layersToShow.push(mct.pixi.windows[windowName].layerInteractions[targetLayer].status[actionStatusHandle][m][0]);
      }
    } else {
      layersToShow.push(targetLayer);
    }
  } else if (sourceLayer == -1) {
    perform = true;
  }
  if (perform === true) {
    if (sourceLayer == -1) {
      mct.pixi.windows[windowName].layerCovers.push({ top : 0, bottom : 0 });
      // interaction status values contain a sourceLayer,targetLayer,parameter key and can
      // contain a chain of parameter values inside an array if the status depends on further
      // source layer interactions, e.g. layerInteractions[3].status."1,3,reaction".["nose","sel","reaction"]
      // the status.current value would be "1,3,reaction" and the related interaction status
      // contains a layer connection between layer 1 and 3 with 2 parent layer status values
      // (from layer 1 and 0) and the current "reaction" status which defines the whole layers'
      // interaction chain status
      mct.pixi.windows[windowName].layerInteractions.push({ status : { current : "" } });
      mct.pixi.windows[windowName].layers.push(
        (typeof mct.pixi.windows[windowName].json.layers[targetLayer].visible != "undefined") ?
          displayWindowLayerContainer(
            windowName, targetLayer, mct.pixi.windows[windowName].json.layers[targetLayer]
          )
          : { placeholder : 1 } // depends on display layer action call by button
      );
      if (typeof mct.pixi.windows[windowName].layers[targetLayer].placeholder == "undefined") {
        mct.pixi.stage.addChild(mct.pixi.windows[windowName].layers[targetLayer]);
        displayWindowLayerShow(windowName, { show : [ Number(targetLayer) ] });
      }
    } else if (typeof mct.pixi.windows[windowName].layers[targetLayer].placeholder != "undefined") {
      mct.pixi.windows[windowName].layers[targetLayer] = displayWindowLayerContainer(
        windowName, targetLayer, mct.pixi.windows[windowName].json.layers[targetLayer]
      );
      mct.pixi.stage.addChild(mct.pixi.windows[windowName].layers[targetLayer]);
      displayWindowLayerShow(windowName, { hide : [ "all" ], show : layersToShow });
      console.log("create layer " + targetLayer);
    } else {
      console.log("show layer " + targetLayer);
      displayWindowLayerShow(windowName, { hide : [ "all" ], show : layersToShow });
    }
  }
}

// update active window interactions depending on visible layers to avoid overwritten interactions
// in global windows interaction storage object
function displayWindowLayerInteractions(windowName) {
  var visibility = false;
  var coor = "";
  for (var i = 0; i < mct.pixi.windows[windowName].layers.length; i++) {
    visibility = mct.pixi.windows[windowName].layers[i].visible;
    if (typeof mct.pixi.windows[windowName].layers[i].children != "undefined") {
      for (var j = 0; j < mct.pixi.windows[windowName].layers[i].children.length; j++) {
        if (mct.pixi.windows[windowName].layers[i].children[j].interactive) {
          coor = mct.pixi.windows[windowName].layers[i].children[j].position.x + " " +
            mct.pixi.windows[windowName].layers[i].children[j].position.y;
          if (visibility === true) {
            if (typeof mct.pixi.windows[windowName].layerInteractions[i][coor] != "undefined") {
              mct.pixi.windows.interactions[coor] = mct.pixi.windows[windowName].layerInteractions[i][coor];
            }
          } else {
            if (typeof mct.pixi.windows.interactions[coor] != "undefined") {
              mct.pixi.windows[windowName].layerInteractions[i][coor] = mct.pixi.windows.interactions[coor];
              delete mct.pixi.windows.interactions[coor];
            }
          }
        }
      }
    }
  }
}

function displayWindowLayerShow(windowName, settings) {
  var visibility = false;
  for (var i = 0; i < mct.pixi.windows[windowName].layers.length; i++) {
    if ((typeof settings.hide != "undefined" && (settings.hide[0] == "all" || settings.hide.indexOf(i) > -1)) &&
        (typeof settings.show == "undefined" || (settings.show[0] != "all" && settings.show.indexOf(i) == -1))) {
      visibility = false;
    } else {
      visibility = true;
    }
    mct.pixi.windows[windowName].layers[i].visible = visibility;
    if (typeof mct.pixi.windows[windowName].layers[i].children != "undefined") {
      for (var j = 0; j < mct.pixi.windows[windowName].layers[i].children.length; j++) {
        // pixi.js has a bug with Graphics inside a container, needs manual visibility change for childs
        // see https://github.com/GoodBoyDigital/pixi.js/issues/234
        mct.pixi.windows[windowName].layers[i].children[j].visible = visibility;
      }
    }
  }
  displayWindowLayerInteractions(windowName);
}

function displayWindowClose(windowName, currentLayer, parameter) {
  displayWindowLayerShow(windowName, { hide : [ "all" ] });
}
