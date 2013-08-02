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

// wait for document ready to get access to loaded/included audio element
$(document).ready(function() {

  try {
    mct.audio.data = $.parseJSON($.get('../base/data/audio.json').responseText);

    for (var theme in mct.audio.data.meta.music.theme) {
      mct.status.audio.music.playlists[theme] = 0; // set theme playlist status to first position
    }

  } catch(err) {
    console.log("Failed to load audio data");
  }

  // first object / channel for music, rest for effects
  for (var i = 0; i < mct.audio.channelCount; i++) {
    $('body').append('<audio class="audio" id="audio' + i + '" />');
    mct.audio.objects.push(
      [ $('#audio' + i), // object for jquery commands
        $('body').find($('#audio' + i))[0] ] // unwrapped object for direct audio commands
    );
    mct.status.audio.effects.channels.push(0);
    mct.audio.objects[i][0].attr("controls", "controls");
    mct.audio.objects[i][0].hide();
  }

  // --- audio obj help ---
  // control: audioObj.play() / .pause() / .volume += 0.1 / .volume -= 0.1
  // audioObj.seekable.start() return start time
  // audioObj.seekable.end() end time
  // audioObj.currentTime = 22 seek to 22 seconds
  // audioObj.played.end() browser play time
  // using audio src tage with "#t=[starttime][,endtime]" post fix to limit audio

  if (mct.status.audio.music.active == 1) {

    // visibility effects
    mct.audio.objects[0][0].show();
    mct.audio.objects[0][0].fadeTo(7500, 0);
    mct.audio.objects[0][0].mouseover(function() { mct.audio.objects[0][0].fadeTo("fast", 1); });
    mct.audio.objects[0][0].mouseout(function() { mct.audio.objects[0][0].fadeTo("fast", 0); });

    // options
    mct.audio.objects[0][0].attr("autoplay", "autoplay");

    // start with first track in default theme playlist
    var plP = mct.status.audio.music.playlists[mct.status.audio.music.theme];
    mct.audio.objects[0][0].attr(
      "src", "../sound/music/" +
        mct.audio.data.music[mct.audio.data.meta.music.theme[mct.status.audio.music.theme][plP]]
    );
    if (mct.audio.autoplay == 0) {
      mct.audio.objects[0][1].pause();
    }
    baseUtilSetTimeout(function(){ audioCheckMusicPlaylist(0); }, 1000, "musicPlaylistCheck");
  }

  if (mct.status.audio.effects.active == 1) {
    // add more effects logic here

    // effect demo
    var delay = 0;
    for (var i = 0; i < 50; i++) {
      do {
        delay = Math.floor(Math.random() * 2000)
      } while (delay < 1000);
      baseUtilSetTimeout(function(){ audioPlayEffect("ef.click1"); }, delay);
    }
  }
});

function audioCheckMusicPlaylist(channel) {
  // start transition effect to next/first playlist position with track end range
  if (mct.audio.objects[channel][1].currentTime >= mct.audio.objects[channel][1].duration - 15) {

    var plP = mct.status.audio.music.playlists[mct.status.audio.music.theme];
    if (plP < mct.audio.data.meta.music.theme[mct.status.audio.music.theme].length - 1) {
      plP++;
    } else {
      plP = 0;
    }
    var newChannel = (channel == 0) ? 1 : 0;

    mct.audio.objects[channel][0].unbind('mouseover mouseout');

    delete mct.status.intervals["musicPlaylistCheck"];
    baseUtilSetTimeout(
      function(){ audioCheckMusicPlaylist(newChannel); }, 1000, "musicPlaylistCheck"
    );

    mct.audio.objects[newChannel][0].show();
    mct.audio.objects[newChannel][0].css('opacity', 0);
    mct.audio.objects[newChannel][0].attr(
      "src", "../sound/music/" +
        mct.audio.data.music[mct.audio.data.meta.music.theme[mct.status.audio.music.theme][plP]]
    );
    mct.audio.objects[channel][1].volume = 0;
    mct.audio.objects[channel][1].play();

    var c = 1, changeVisibility = false;
    if (mct.audio.objects[channel][0].css('opacity') == 1) {
      changeVisibility = true;
    }
    $(mct.audio.objects[newChannel][0]).animate(
      { opacity : 1 },
      {
        duration : 2500,
        progress : function() {
          if (c < 150) {
            if (changeVisibility == true) {
              mct.audio.objects[channel][0].css('opacity', 1 - (c / 150));
            }
            mct.audio.objects[channel][1].volume = 1 - (c / 150);
            mct.audio.objects[channel][1].volume = 0 + (c / 150);
            c++;
          }
        },
        complete : function() {
          mct.audio.objects[channel][0].hide();
          mct.audio.objects[newChannel][0].fadeTo(7500, 0);
          mct.audio.objects[newChannel][0].mouseover(
            function() { mct.audio.objects[newChannel][0].fadeTo("fast", 1); }
          );
          mct.audio.objects[newChannel][0].mouseout(
            function() { mct.audio.objects[newChannel][0].fadeTo("fast", 0); }
          );
        }
      }
    );
  }
}

function audioPlayEffect(effectHandle, loop) {
  // find free channel
  var ci = 1; // 1st / 2nd channel blocked for music with fading/transition function
  do {
    ci++;
  } while (mct.status.audio.effects.channels[ci] != 0 && ci < mct.audio.channelCount);

  if (ci < mct.audio.channelCount) {
    if (loop === true) {
      mct.audio.objects[ci][0].attr("loop", "loop");
    }
    // set effect src
    mct.audio.objects[ci][0].attr("src", "../sound/effects/" + mct.audio.data.effects[effectHandle]);
    mct.audio.objects[ci][1].play();
    // block effect channel
    mct.status.audio.effects.channels[ci] = effectHandle;
    // try to release effect channel
    baseUtilSetTimeout(function(){ audioReleaseEffectChannel(ci); }, 10, "audio"+ci);
  } else {
    console.log("no free channels");
  }
}

// function to stop loop effects by effectHandle
function audioStopEffect(effectHandle) {
  var ci = 1; // 1st / 2nd channel blocked for music with fading/transition function
  do {
    ci++;
  } while (mct.status.audio.effects.channels[ci] != effectHandle && ci < mct.audio.channelCount);
  if (mct.status.audio.effects.channels[ci] == effectHandle) {
    mct.audio.objects[ci][1].pause();
    audioReleaseEffectChannel(ci);
  }
}

// release effect audio channel
function audioReleaseEffectChannel(channel) {
  if (mct.audio.objects[channel][1].ended == true || mct.audio.objects[channel][1].paused == true) {
    mct.status.audio.effects.channels[channel] = 0;
    delete mct.status.intervals["audio"+channel];
    if (channel > 1 && mct.audio.objects[channel][0].attr("loop") !== undefined) {
      mct.audio.objects[channel][0].removeAttr("loop"); // audio channels with loop effects
    }
  }
}
