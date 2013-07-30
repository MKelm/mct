/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mkelm/mct
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
  } catch(err) {
    console.log("Failed to load audio data");
  }

  // first object / channel for music, rest for effects
  for (var i = 0; i < mct.audio.channelCount; i++) {
    $('body').append('<audio class="audio" id="audio' + i + '" />');
    mct.audio.objects.push($('#audio' + i));
    mct.status.audio.effects.channels.push(0);
  }

  // --- audio obj help ---
  // control: audioObj.play() / .pause() / .volume += 0.1 / .volume -= 0.1
  // audioObj.seekable.start() return start time
  // audioObj.seekable.end() end time
  // audioObj.currentTime = 22 seek to 22 seconds
  // audioObj.played.end() browser play time
  // using audio src tage with "#t=[starttime][,endtime]" post fix to limit audio

  if (mct.status.audio.music == 1) {
    // visibility effects
    mct.audio.objects[0].css("display", "block");
    mct.audio.objects[0].fadeTo(7500, 0);
    mct.audio.objects[0].mouseover(function() { mct.audio.objects[0].fadeTo("fast", 1); });
    mct.audio.objects[0].mouseout(function() { mct.audio.objects[0].fadeTo("fast", 0); });

    // options
    mct.audio.objects[0].attr("controls", "controls");
    mct.audio.objects[0].attr("loop", "loop");
    mct.audio.objects[0].attr("autoplay", "autoplay");

    // single file usage, extend this part for playlist support
    mct.audio.objects[0].attr(
      "src", "../sound/music/" + mct.audio.data.music[mct.audio.data.meta.music.theme.default[0]]
    );

    // note: you have to unwrap the jquery object to access the audio methods
    if (mct.audio.autoplay == 0) {
      $('body').find(mct.audio.objects[0])[0].pause();
    }
  }

  // note for audio channels status
  // audio objects have a paused state, but it will be activated with a delay
  // the channels status will block the channel on file source definition
  // and will be released when the object paused status gets true again
  // the status value will contain an unix timestamp with a minimum range (to bypass the
  // loading delay) for the next channel release time if a file source definition has been set
  if (mct.status.audio.effects.active == 1) {
    // add more effects logic here

    // effect demo
    var ef = "../sound/effects/" + mct.audio.data.effects["ef.click1"];
    var delay = 0;
    for (var i = 0; i < 100; i++) {
      do {
        delay = Math.floor(Math.random() * 2000)
      } while (delay < 100);
      global.setTimeout(function(){ audioPlayEffect(ef); }, delay);
    }
  }
});

function audioPlayEffect(src) {
  // find free channel
  var ci = 0;
  do {
    ci++;
  } while (mct.status.audio.effects.channels[ci] > 0 && ci < mct.audio.channelCount);

  if (ci < mct.audio.channelCount) {
    // set effect src
    mct.audio.objects[ci].attr("src", src);
    $('body').find(mct.audio.objects[ci])[0].play();
    // block effect channel
    mct.status.audio.effects.channels[ci] = time(mct.audio.releaseDelay);
    // try to release effect channel
    mct.intervals["audio"+ci] = setInterval(function(){ audioReleaseChannel(ci); }, 10);
  } else {
    console.log("no free channels");
  }
}

function audioReleaseChannel(channel) {
  var t = time();
  if (mct.status.audio.effects.channels[channel] != 0 &&
      t > mct.status.audio.effects.channels[channel]) {
    if ($('body').find(mct.audio.objects[channel])[0].paused == true) {
      mct.status.audio.effects.channels[channel] = 0;
      clearInterval(mct.intervals["audio"+channel]);
    }
  }
}
