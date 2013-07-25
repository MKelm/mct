// key event to close application
// this is a experimental implementation until the game has a quit buttons
$("html").keyup(function(e){
  if (e.which == 27){
    // Load native UI library
    var gui = require('nw.gui');
    gui.App.closeAllWindows();
  }
});

// use init function from base
baseInit();

baseValues.display = {
  width: 1280, // do not change this value, or you have to change all assets too!
  height: 1024, // do not change this value, or you have to change all assets too!
  ratio: 0
}; // display properties, width / height / ratio will be overwritten

baseValues.pixi = {}; // contains render / stage of pixi

// add all assets here!
baseValues.assetsToLoad = [
  "gfx/mct_logo.png"
];

$(document).ready(function() {
  global.setTimeout(displayInit, 10); // use timeout to detect fullscreen size correctly

  function displayInit() {

    // create an new instance of a pixi stage
    baseValues.pixi.stage = new PIXI.Stage(0x66FF99);

    // create a renderer instance.
    baseValues.pixi.renderer = PIXI.autoDetectRenderer(
      baseValues.display.width, baseValues.display.height
    );

    // add the renderer view element to the DOM
    document.body.appendChild(baseValues.pixi.renderer.view);

    // resize display size by current window size
    baseValues.display.ratio = Math.min(
      window.innerWidth / baseValues.display.width,
      window.innerHeight / baseValues.display.height
    );
    baseValues.display.width = baseValues.display.width * baseValues.display.ratio;
    baseValues.display.height = baseValues.display.height * baseValues.display.ratio;
    baseValues.pixi.renderer.resize(baseValues.display.width, baseValues.display.height);

    // init / run animation function
    requestAnimFrame(animate);
    function animate() {
      requestAnimFrame(animate);
      // render the stage
      baseValues.pixi.renderer.render(baseValues.pixi.stage);
    }

    // create a new loader
    loader = new PIXI.AssetLoader(baseValues.assetsToLoad);
    delete baseValues.assetsToLoad;
    loader.onComplete = displayLogoAdd;
    //begin load
    loader.load();
  }
});