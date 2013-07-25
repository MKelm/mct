function displayLogoAdd() {
  // create a texture from an image path
  var texture = PIXI.Texture.fromImage("gfx/mct_logo.png");
  // create a new Sprite using the texture
  var logo = new PIXI.Sprite(texture);

  // center the sprites anchor point
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;

  // move the sprite t the center of the screen
  logo.position.x = 512;
  logo.position.y = 334;

  stage.addChild(logo);
}