// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(1024, 768);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// use init function from base
baseInit();

// call logo add function from display
displayLogoAdd();

