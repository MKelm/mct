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
    if(mct.game.data.currentEvent != null) {
      if(mct.game.data.turn > (mct.game.eventHistory + 4) || (mct.game.eventHistory == null && mct.game.data.turn > 4)) {
        $.each(mct.game.eventList, function(index, evt) {
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
        mct.game.eventHistory.last = evt;
        return;
      } else {
       return;
      }
    }
  }

  this.checkScenarioEvent = function() {
    if(mct.game.data.currentEvent != null) {
      $.each(mct.game.scenario[mct.game.data.gameMode].events, function(index, evt) {
        if(eval(evt.trigger)) {
          this.createEvent(evt);
          return;
        } else {
          continue;
        }
        return;
      }
    } else {
    if(mct.game.scenatio[mct.game.data.gameMode].events.event[mct.game.data.currentEvent.id].timeLimit >
         (mct.game.data.turn - mct.game.eventHistory.last.start)) {
      eval(mct.game.scenatio[mct.game.data.gameMode].events.event[mct.game.data.currentEvent.id].fail);
      mct.game.data.currentEvent = null;
      this.failEvent(mct.game.scenatio[mct.game.data.gameMode].events.event[mct.game.data.currentEvent.id]);
      return;
    } else {
      return;
    }
  }

  this.createEvent = function(evt) {
    mct.game.data.currentEvent = evt;
    eval(evt.effect);
    //Not sure about the graphics and
    //Making a popup window appear, so I'll leave that.
  }

  this.winEvent = function(evt) {
    //Popupwindow with event success message
    //winEventWindow(evt.winmsg);
  }

  this.failEvent = function(evt) {
    //Popupwindow with failure event message
    //winEventWindow(evt.failmsg);
  }
}