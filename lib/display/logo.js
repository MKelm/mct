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

function displayLogoAdd() {

  var texture = PIXI.Texture.fromImage("gfx/mct_planet.png");
  var planet = new PIXI.Sprite(texture);
  planet.anchor.x = 0.5;
  planet.anchor.y = 0.5;

  planet.width = planet.width * baseValues.display.ratio * 1.5;
  planet.height = planet.height * baseValues.display.ratio * 1.5;

  planet.position.x = baseValues.display.width - baseValues.display.ratio * 100;
  planet.position.y = baseValues.display.height - baseValues.display.ratio * 100;

  baseValues.pixi.stage.addChild(planet);

  baseValues.display.animate.push({object:planet,type:"rotation",value:0.0005});

  // create a texture from an image path
  texture = PIXI.Texture.fromImage("gfx/mct_logo.png");
  // create a new Sprite using the texture
  var logo = new PIXI.Sprite(texture);

  // center the sprites anchor point
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;

  logo.width = logo.width * baseValues.display.ratio;
  logo.height = logo.height * baseValues.display.ratio;

  // move the sprite t the center of the screen
  logo.position.x = Math.floor(baseValues.display.width / 2);
  logo.position.y = Math.floor(baseValues.display.height / 2);

  baseValues.pixi.stage.addChild(logo);

  // call menu add function
  displayMenuAdd();
}