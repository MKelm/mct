// commands for display animate
baseValues.display.animate = [];

function displayAnimate() {
  requestAnimFrame(displayAnimate);
  if (baseValues.display.animate.length > 0) {
    for (var i = 0; i < baseValues.display.animate.length; i++) {
      if (baseValues.display.animate[i].type == "rotation") {
        baseValues.display.animate[i].object.rotation += baseValues.display.animate[i].value;
      }
    }
  }
  // render the stage
  baseValues.pixi.renderer.render(baseValues.pixi.stage);
}