function displayMenuAdd() {

  // create a style object..
  var style = {font:"50px Arial", fill:"red"};

  var text = new PIXI.Text("Pixi.js can has text!", style);

  text.position.x = 400;
  text.position.y = 300;

  baseValues.pixi.stage.addChild(text);
}
