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

  // first object / channel for music, rest for effects
  for (var i = 0; i < mct.audio.channelCount; i++) {
    $('body').append('<audio class="audio" id="audio' + i + '" />');
    mct.audio.objects.push($('#audio' + i));
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
    mct.audio.objects[0].attr("src", "../sound/Amusia - Orbit (Awakening).ogg");

    // note: you have to unwrap the jquery object to access the audio methods
    if (mct.audio.autoplay == 0) {
      $('body').find(mct.audio.objects[0])[0].pause();
    }
  }

  if (mct.status.audio.effects == 1) {
    // add more effects logic here
  }
});