requestAnimFrame(animate);

function animate() {

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}