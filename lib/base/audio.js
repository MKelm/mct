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

  // todo add objects by channelCount ....
  $('body').append('<audio id="audioObject" />');

  // --- audio obj help ---
  // control: audioObj.play() / .pause() / .volume += 0.1 / .volume -= 0.1
  // audioObj.seekable.start() return start time
  // audioObj.seekable.end() end time
  // audioObj.currentTime = 22 seek to 22 seconds
  // audioObj.played.end() browser play time
  // using audio src tage with "#t=[starttime][,endtime]" post fix to limit audio

  if (mct.status.audio.music == 1) {

    // visibility effects
    $("#audioObject").css("display", "block");
    $("#audioObject").fadeTo(7500, 0);
    $("#audioObject").mouseover(function() { $("#audioObject").fadeTo("fast", 1); });
    $("#audioObject").mouseout(function() { $("#audioObject").fadeTo("fast", 0); });

    // options
    $("#audioObject").attr("controls", "controls");
    $("#audioObject").attr("loop", "loop");
    $("#audioObject").attr("autoplay", "autoplay");

    // single file usage, extend this part for playlist support
    $("#audioObject").attr("src", "../sound/Amusia - Orbit (Awakening).ogg");

    // note: you have to unwrap the jquery object to access the audio methods
    $("body").find('#audioObject')[0].play();

  }
});