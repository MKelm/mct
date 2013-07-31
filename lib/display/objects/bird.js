/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mctteam/mct
 * Author(s) Martin Kelm
 *
 * Mass Control Tycoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Mass Control Tycoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mass Control Tycoon. If not, see <http://www.gnu.org/licenses/>.
 */

function displayObjectBirdMoveTween(bird, moves, currentMove, startX, startY) {
  bird.state.queue = [];
  bird.state.addAnimationByName("right", false);
  bird.state.addAnimationByName("left", false);
  bird.state.addAnimationByName("right", false);
  bird.state.addAnimationByName("left", false);
  bird.state.addAnimationByName("right", false);
  bird.state.addAnimationByName("left", false);

  var tween = new TWEEN.Tween( { x: startX, y: startY  } )
    .to(
      {
        x: moves[currentMove][2] * mct.pixi.screen.ratio,
        y: moves[currentMove][3] * mct.pixi.screen.ratio

      }, 10000
    )
    .onUpdate( function () {
        bird.position.x = this.x;
        bird.position.y = this.y;
    })
    .onComplete( function() {
      if (currentMove < moves.length - 1) {
        currentMove++;
      } else {
        currentMove = 0;
      }
      bird.position.x = moves[currentMove][0] * mct.pixi.screen.ratio;
      bird.position.y = moves[currentMove][1] * mct.pixi.screen.ratio;
      if (moves[currentMove][4] > 0) {
        bird.rotation += moves[currentMove][4];
      }
      displayObjectBirdMoveTween(bird, moves, currentMove, bird.position.x, bird.position.y);
    })
    .start();
}

function displayObjectBirdAdd(scene) {
  var maxMoves = 4;
  var moveRatioX = 1280 / 4;
  var birdMoves = [
    [ 1 * moveRatioX - moveRatioX / 4, 1200, 1 * moveRatioX - moveRatioX / 4, -200, Math.PI ],
    [ 2 * moveRatioX - moveRatioX / 4, -200, 2 * moveRatioX - moveRatioX / 4, 1200, Math.PI ],
    [ 3 * moveRatioX - moveRatioX / 4, 1200, 3 * moveRatioX - moveRatioX / 4, -200, Math.PI ],
    [ 4 * moveRatioX - moveRatioX / 4, -200, 4 * moveRatioX - moveRatioX / 4, 1200, Math.PI ]
  ];

  var bird = new PIXI.Spine("gfx-packed/spinebird.json");
  bird.position.x = birdMoves[0][0] * mct.pixi.screen.ratio;
  bird.position.y = birdMoves[0][1] * mct.pixi.screen.ratio;
  bird.scale.x = 0.2;
  bird.scale.y = 0.2;
  scene.addChild(bird);
  displayObjectBirdMoveTween(bird, birdMoves, 0, bird.position.x, bird.position.y);

  var birdMoves2 = [
    [ 4 * moveRatioX - moveRatioX / 4, -200, 4 * moveRatioX - moveRatioX / 4, 1200, Math.PI ],
    [ 3 * moveRatioX - moveRatioX / 4, 1200, 3 * moveRatioX - moveRatioX / 4, -200, Math.PI ],
    [ 2 * moveRatioX - moveRatioX / 4, -200, 2 * moveRatioX - moveRatioX / 4, 1200, Math.PI ],
    [ 1 * moveRatioX - moveRatioX / 4, 1200, 1 * moveRatioX - moveRatioX / 4, -200, Math.PI ]
  ];

  var bird2 = new PIXI.Spine("gfx-packed/spinebird.json");
  bird2.position.x = birdMoves2[0][0] * mct.pixi.screen.ratio;
  bird2.position.y = birdMoves2[0][1] * mct.pixi.screen.ratio;
  bird2.scale.x = 0.2;
  bird2.scale.y = 0.2;
  bird2.rotation = Math.PI;
  scene.addChild(bird2);
  displayObjectBirdMoveTween(bird2, birdMoves2, 0, bird2.position.x, bird2.position.y);


}