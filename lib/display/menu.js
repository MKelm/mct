function displayMenuAdd() {

  // set menu title text
  var style = {font: Math.floor(50 * baseValues.display.ratio) + "px Arial", fill:"red"};
  var text = new PIXI.Text("Mass Control Tycoon", style);

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;

  text.position.x = Math.floor(baseValues.display.width / 2);
  text.position.y = Math.floor((baseValues.display.height / 2) - 250 * baseValues.display.ratio);

  baseValues.pixi.stage.addChild(text);

  // set start / quit button

  var texture = PIXI.Texture.fromImage("gfx/menu_button_start.png");
  var startBtn = new PIXI.Sprite(texture);
  startBtn.anchor.x = 0.5;
  startBtn.anchor.y = 0.5;
  startBtn.width = startBtn.width * baseValues.display.ratio;
  startBtn.height = startBtn.height * baseValues.display.ratio;
  startBtn.position.x = Math.floor((baseValues.display.width / 2) - 250 * baseValues.display.ratio);
  startBtn.position.y = Math.floor((baseValues.display.height / 2) + 250 * baseValues.display.ratio);

  startBtn.setInteractive(true);
  startBtn.click = function(mouseData){
     alert("START!");
  }

  baseValues.pixi.stage.addChild(startBtn);

  texture = PIXI.Texture.fromImage("gfx/menu_button_quit.png");
  var quitBtn = new PIXI.Sprite(texture);
  quitBtn.anchor.x = 0.5;
  quitBtn.anchor.y = 0.5;
  quitBtn.width = quitBtn.width * baseValues.display.ratio;
  quitBtn.height = quitBtn.height * baseValues.display.ratio;
  quitBtn.position.x = Math.floor((baseValues.display.width / 2) + 250 * baseValues.display.ratio);
  quitBtn.position.y = Math.floor((baseValues.display.height / 2) + 250 * baseValues.display.ratio);

  quitBtn.setInteractive(true);
  quitBtn.click = function(mouseData){
    var gui = require('nw.gui');
    gui.App.closeAllWindows();
  }

  baseValues.pixi.stage.addChild(quitBtn);

}
