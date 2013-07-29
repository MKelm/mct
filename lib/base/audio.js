// wait for document ready to get access to loaded/included audio element
$(document).ready(function() {

  // --- audio obj help ---
  // control: audioObj.play() / .pause() / .volume += 0.1 / .volume -= 0.1
  // audioObj.seekable.start() return start time
  // audioObj.seekable.end() end time
  // audioObj.currentTime = 22 seek to 22 seconds
  // audioObj.played.end() browser play time
  // using audio src tage with "#t=[starttime][,endtime]" post fix to limit audio

  if (mct.game.status.music == 1) {

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