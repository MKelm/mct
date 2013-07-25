function displayLogoAdd() {

  // create a texture from an image path
  var texture = PIXI.Texture.fromImage("gfx/mct_logo.png");
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

  baseValues.display.animate.push({object:logo,type:"rotation",value:0.005});

  // call menu add function
  displayMenuAdd();
}