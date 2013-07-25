function displayMenuAdd() {

  // create a style object..
  var style = {font: Math.floor(50 * baseValues.display.ratio) + "px Arial", fill:"red"};

  var text = new PIXI.Text("Mass Control Tycoon", style);

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;

  text.position.x = Math.floor(baseValues.display.width / 2);
  text.position.y = Math.floor((baseValues.display.height / 2) - 250 * baseValues.display.ratio);

  baseValues.pixi.stage.addChild(text);
}
