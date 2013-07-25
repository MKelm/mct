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