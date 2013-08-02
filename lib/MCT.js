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

/*
 Note:
 To make it not too complex and too slow the MCT framework uses prototyping like the pixi.js framework.
 Prototyping offers a ~19,6x faster speed than ignoring prototyping to make a framework in node-webkit.
 The prototyping speed test is located here -> https://gist.github.com/MKelm/6143399
 Have a look into MCT/Player.js for a parent class and into MCT/Player/Cpu.js for a child class.
 To derivate methods use parentClass.prototype.method.call(this, parameters) !!!
*/

// MCT class framework
var MCT = MCT || {};