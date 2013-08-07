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

// audio handler class
// handles audios for music and effects

// set all properties by loaded json data and some default values
MCT.AudioHandler = function() {
  try {
    var data = baseLoadJSON('./lib/base/data/audio.json');
    this.meta = data.meta;
    this.meta.channels.status = [];
    this.effects = data.effects;
    this.music = data.music;
    this.players = [];
    this.playlists = data.playlists;
    this.playlists.positions = {};
    for (var theme in this.playlists.theme) {
      this.playlists.positions[theme] = -1; // set theme playlist status to first position
    }
  } catch(err) {
    console.log("Failed to load audio data");
  }
}

MCT.AudioHandler.prototype.constructor = MCT.AudioHandler;

// important method to set all player objects
MCT.AudioHandler.prototype.setPlayers = function() {
  // 1st+2nd object / channel for music, rest for effects
  for (var i = 0; i < this.meta.channels.amount; i++) {
    $('body').append('<audio class="audio" id="audio' + i + '" />');
    this.players.push(
      [ $('#audio' + i), // object for jquery commands
        $('body').find($('#audio' + i))[0] ] // unwrapped object for direct audio commands
    );
    this.meta.channels.status.push(0);
    this.players[i][0].attr("controls", "controls");
    this.players[i][0].hide();
  }
}

// set/unset fade effects for a specific channel player
MCT.AudioHandler.prototype.setPlayerFadeEffects = function(channel, active) {
  if (active == true) {
    this.players[channel][0].fadeTo(7500, 0);
    var scope = this;
    this.players[channel][0].mouseover(function() { scope.players[channel][0].fadeTo("fast", 1); });
    this.players[channel][0].mouseout(function() { scope.players[channel][0].fadeTo("fast", 0); });
  } else {
    this.players[channel][0].unbind('mouseover mouseout');
  }
}

// method to call to player next playlist track of a specific theme
// the method needs an activeChannel id to perform transition effects correctly
MCT.AudioHandler.prototype.nextPlaylistTrack = function(theme, activeChannel) {
  if (this.meta.active.music == 1) {

    if (typeof activeChannel == "number" && (activeChannel === 0 || activeChannel === 1)) {
      nextChannel = (activeChannel == 0) ? 1 : 0;
      this.setPlayerFadeEffects(activeChannel, false);
      clearInterval(mct.status.intervals["audioMusicChannel"+activeChannel]);
      if (typeof this.meta.channels.status[activeChannel] == "string") {
        if (typeof theme != "string") {
          // set new theme from active channel theme if no new theme has set
          theme = this.meta.channels.status[activeChannel];
        } else if (theme != this.meta.channels.status[activeChannel]) {
          // change active channel to new theme to perform transition to next track of new theme
          this.meta.channels.status[activeChannel] = theme;
          this.checkPlaylistTrack(this, activeChannel, true);
          return;
        }
      }
    } else {
      nextChannel = 0;
    }

    this.players[nextChannel][0].show();
    if (typeof activeChannel == "number") {
      this.players[nextChannel][0].css('opacity', 0);
      // more effects on transition complete in checkPlaylistTrack
    } else {
      this.setPlayerFadeEffects(nextChannel, true);
      if (this.playlists.playOnStart == 1) {
        this.players[nextChannel][0].attr("autoplay", "autoplay");
      }
    }

    var theme = (typeof theme == "string") ? theme : "default";
    // set new theme to next channel
    this.meta.channels.status[nextChannel] = theme;

    var plP = this.playlists.positions[theme];
    if (plP < this.playlists.theme[theme].length - 1) {
      plP++;
    } else {
      plP = 0;
    }
    this.playlists.positions[theme] = plP;

    this.players[nextChannel][0].attr(
      "src", "../sound/music/" + this.music[this.playlists.theme[theme][plP]]
    );
    if (typeof activeChannel == "number") {
      this.players[nextChannel][1].volume = 0;
      this.players[nextChannel][1].play();
      // volume changes in transition effect see checkPlaylistTrack
    }

    mct.status.intervals["audioMusicChannel"+nextChannel] = setInterval(
      this.checkPlaylistTrack.curry(this, nextChannel), 1000
    );
  }
}

// check playlist track for end time and can set/initialize transition phase to next playlist track
// the method needs a valid scope parameter to perform actions in relation to the current instance!
MCT.AudioHandler.prototype.checkPlaylistTrack = function(scope, activeChannel, forceTransition) {
  // start transition effect to next/first playlist position with track end range
  var endTime = scope.players[activeChannel][1].currentTime >= scope.players[activeChannel][1].duration - 15;
  if (forceTransition === true || endTime) {
    // note a forced (theme) transition on a running track-to-track transition can cause problems!
    // the logic contains no solution for that problem currently

    scope.nextPlaylistTrack(this.meta.channels.status[activeChannel], activeChannel);
    var nextChannel = (activeChannel === 0) ? 1 : 0;

    var c = 1, changeVisibility = false;
    if (scope.players[activeChannel][0].css('opacity') == 1) {
      changeVisibility = true;
    }
    $(scope.players[nextChannel][0]).animate(
      { opacity : 1 },
      {
        duration : 2500,
        progress : function() {
          if (c <= 150) {
            if (changeVisibility === true) {
              scope.players[activeChannel][0].css('opacity', 1 - (c / 150));
            }
            scope.players[activeChannel][1].volume = 1 - (c / 150);
            scope.players[nextChannel][1].volume = 0 + (c / 150);
            c++;
          }
        },
        complete : function() {
          scope.players[activeChannel][0].hide();
          scope.setPlayerFadeEffects(nextChannel, true);
        }
      }
    );
  }
}

// play a single effect by handle or start an effect loop
MCT.AudioHandler.playEffect = function(effectHandle, loop) {
  // find free channel
  var ci = 1; // 1st / 2nd channel blocked for music with fading/transition function
  do {
    ci++;
  } while (this.meta.channels.status[ci] !== 0 && ci < this.meta.channels.amount);

  if (ci < this.meta.channels.amount) {
    if (loop === true) {
      this.players[ci][0].attr("loop", "loop");
    }
    // set effect src
    this.players[ci][0].attr("src", "../sound/effects/" + this.effects[effectHandle]);
    this.players[ci][1].play();
    // block effect channel
    this.meta.channels.status[ci] = effectHandle;
    // try to release effect channel
    mct.status.intervals["audioEffectChannel"+ci] = setInterval(
      this.releaseEffectChannel.curry(this, ci), 10
    );
  } else {
    console.log("no free channels for "+effectHandle);
  }
}

// function to stop effects by effectHandle, espacially for loop effects
MCT.AudioHandler.stopEffect = function(effectHandle) {
  var ci = 1; // 1st / 2nd channel blocked for music with fading/transition function
  do {
    ci++;
  } while (this.meta.channels.status[ci] != effectHandle && ci < this.meta.channels.amount);
  if (this.meta.channels.status[ci] == effectHandle) {
    this.players[ci][1].pause();
    this.releaseEffectChannel(this, ci);
  }
}

// release an effect channel after a effect has ended or a loop has stopped
// the method needs a valid scope parameter to perform actions in relation to the current instance!
MCT.AudioHandler.releaseEffectChannel = function(scope, channel) {
  if (scope.players[channel][1].ended === true || scope.players[channel][1].paused === true) {
    scope.meta.channels.status[channel] = 0;
    clearInterval(mct.status.intervals["audioEffectChannel"+channel]);
    if (channel > 1 && scope.players[channel][0].attr("loop") !== undefined) {
      scope.players[channel][0].removeAttr("loop"); // audio channels with loop effects
    }
  }
}
