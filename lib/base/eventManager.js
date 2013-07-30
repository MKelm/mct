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

function events() {
  this.checkSandboxEvent = function() {
    if(mct.data.events.current != null) {
      if(mct.status.turn > (mct.data.events.history + 4) || (mct.data.events.history == null && mct.status.turn > 4)) {
        $.each(mct.data.events.list, function(index, evt) {
          if(eval(evt.trigger)) {
            this.createEvent(evt);
            return;
          } else {
            continue;
          }
          return;
        }
      }
    } else {
      if(eval(evt.condition)) {
        eval(evt.success);
        this.winEvent(evt);
        mct.data.events.history.last = evt;
        return;
      } else {
       return;
      }
    }
  }

  this.checkScenarioEvent = function() {
    if(mct.data.events.current != null) {
      $.each(mct.data.scenario[mct.status.mode].events, function(index, evt) {
        if(eval(evt.trigger)) {
          this.createEvent(evt);
          return;
        } else {
          continue;
        }
        return;
      }
    } else {
    if(mct.data.scenatio[mct.status.mode].events.event[mct.data.events.current.id].timeLimit >
         (mct.status.turn - mct.data.events.history.last.start)) {
      eval(mct.data.scenario[mct.status.mode].events.event[mct.data.events.current.id].fail);
      mct.data.events.current = null;
      this.failEvent(mct.data.scenario[mct.status.mode].events.event[mct.data.events.current.id]);
      return;
    } else {
      return;
    }
  }

  this.createEvent = function(evt) {
    mct.data.events.current = evt;
    eval(evt.effect);
    // needs a valid / active scene!
    displayWindowAdd(
      'eventmessage',
      'scenes/events/windows/message.json',
      {
        "dynEventTitle" : evt.title,
        "dynEventDescription" : evt.desc,
        "dynEventWinMessage" : "- You won some experiences in launching a pre-alpha game."
      } // dynamic texts
    );
  }

  this.winEvent = function(evt) {
    // needs a valid / active scene!
    displayWindowAdd(
      'eventmessage',
      'scenes/events/windows/message.json',
      {
        "dynEventTitle" : evt.title,
        "dynEventWinMessage" : evt.winmsg
      } // dynamic texts
    );
  }

  this.failEvent = function(evt) {
    // needs a valid / active scene!
    displayWindowAdd(
      'eventmessage',
      'scenes/events/windows/message.json',
      {
        "dynEventTitle" : evt.title,
        "dynEventFailMessage" : evt.failmsg
      } // dynamic texts
    );
  }
}