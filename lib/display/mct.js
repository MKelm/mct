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
var mct={db:{},pixi:{},intervals:{},audio:{autoplay:0,channelCount:16,objects:[],data:{}},status:{mode:"sandbox",turn:0,planet:0,lang:"en-US",audio:{music:{active:1,theme:"default",playlists:{}},effects:{active:1,channels:[]}},pixi:{}},data:{planets:[],technologies:{},scnenario:{},events:{list:null,history:null,current:null}}};mct.db=openDatabase("mctdb1","1.0","mctdb1",2097152);
function time(a,c){var b=1;"unix"==a&&(b=1E3);return 0<c?Math.round((new Date).getTime()/b)+c:Math.round((new Date).getTime()/b)}var ts=time("unix");mct.db.transaction(function(a){a.executeSql("CREATE TABLE IF NOT EXISTS player (option unique, value)");a.executeSql('INSERT INTO player (option, value) VALUES ("time", ?)',[ts])});mct.db.transaction(function(a){a.executeSql('UPDATE player SET value = ? WHERE option = "time"',[ts])});
var date=new Date(1E3*ts),hours=date.getHours(),minutes=date.getMinutes(),seconds=date.getSeconds();
$(document).ready(function(){try{mct.audio.data=$.parseJSON($.get("../base/data/audio.json").responseText);for(var a in mct.audio.data.meta.music.theme)mct.status.audio.music.playlists[a]=0}catch(c){console.log("Failed to load audio data")}for(a=0;a<mct.audio.channelCount;a++)$("body").append('<audio class="audio" id="audio'+a+'" />'),mct.audio.objects.push([$("#audio"+a),$("body").find($("#audio"+a))[0]]),mct.status.audio.effects.channels.push(0),mct.audio.objects[a][0].attr("controls","controls"),
mct.audio.objects[a][0].hide();1==mct.status.audio.music.active&&(mct.audio.objects[0][0].show(),mct.audio.objects[0][0].fadeTo(7500,0),mct.audio.objects[0][0].mouseover(function(){mct.audio.objects[0][0].fadeTo("fast",1)}),mct.audio.objects[0][0].mouseout(function(){mct.audio.objects[0][0].fadeTo("fast",0)}),mct.audio.objects[0][0].attr("autoplay","autoplay"),mct.audio.objects[0][0].attr("src","../sound/music/"+mct.audio.data.music[mct.audio.data.meta.music.theme[mct.status.audio.music.theme][mct.status.audio.music.playlists[mct.status.audio.music.theme]]]),
0==mct.audio.autoplay&&mct.audio.objects[0][1].pause(),mct.intervals.musicPlaylistCheck=setInterval(function(){audioCheckMusicPlaylist(0)},1E3));if(1==mct.status.audio.effects.active){var b=0;for(a=0;50>a;a++){do b=Math.floor(2E3*Math.random());while(1E3>b);global.setTimeout(function(){audioPlayEffect("ef.click1")},b)}}});
function audioCheckMusicPlaylist(a){if(mct.audio.objects[a][1].currentTime>=mct.audio.objects[a][1].duration-15){var c=mct.status.audio.music.playlists[mct.status.audio.music.theme];c<mct.audio.data.meta.music.theme[mct.status.audio.music.theme].length-1?c++:c=0;var b=0==a?1:0;mct.audio.objects[a][0].unbind("mouseover mouseout");clearInterval(mct.intervals.musicPlaylistCheck);mct.intervals.musicPlaylistCheck=setInterval(function(){audioCheckMusicPlaylist(b)},1E3);mct.audio.objects[b][0].show();mct.audio.objects[b][0].css("opacity",
0);mct.audio.objects[b][0].attr("src","../sound/music/"+mct.audio.data.music[mct.audio.data.meta.music.theme[mct.status.audio.music.theme][c]]);mct.audio.objects[a][1].volume=0;mct.audio.objects[a][1].play();var d=1,m=!1;1==mct.audio.objects[a][0].css("opacity")&&(m=!0);$(mct.audio.objects[b][0]).animate({opacity:1},{duration:2500,progress:function(){150>d&&(!0==m&&mct.audio.objects[a][0].css("opacity",1-d/150),mct.audio.objects[a][1].volume=1-d/150,mct.audio.objects[a][1].volume=0+d/150,d++)},complete:function(){mct.audio.objects[a][0].hide();
mct.audio.objects[b][0].fadeTo(7500,0);mct.audio.objects[b][0].mouseover(function(){mct.audio.objects[b][0].fadeTo("fast",1)});mct.audio.objects[b][0].mouseout(function(){mct.audio.objects[b][0].fadeTo("fast",0)})}})}}
function audioPlayEffect(a,c){var b=1;do b++;while(0!=mct.status.audio.effects.channels[b]&&b<mct.audio.channelCount);b<mct.audio.channelCount?(!0===c&&mct.audio.objects[b][0].attr("loop","loop"),mct.audio.objects[b][0].attr("src","../sound/effects/"+mct.audio.data.effects[a]),mct.audio.objects[b][1].play(),mct.status.audio.effects.channels[b]=a,mct.intervals["audio"+b]=setInterval(function(){audioReleaseEffectChannel(b)},10)):console.log("no free channels")}
function audioStopEffect(a){var c=1;do c++;while(mct.status.audio.effects.channels[c]!=a&&c<mct.audio.channelCount);mct.status.audio.effects.channels[c]==a&&(mct.audio.objects[c][1].pause(),audioReleaseEffectChannel(c))}
function audioReleaseEffectChannel(a){time();if(!0==mct.audio.objects[a][1].ended||!0==mct.audio.objects[a][1].paused)mct.status.audio.effects.channels[a]=0,clearInterval(mct.intervals["audio"+a]),1<a&&void 0!==mct.audio.objects[a][0].attr("loop")&&mct.audio.objects[a][0].removeAttr("loop")}
function baseGameInitPlanet(){$.ajaxSetup({async:!1});try{mct.data.technologies=$.parseJSON($.get("../base/data/technologies.json").responseText);var a=$.parseJSON($.get("../base/data/planets.json").responseText);mct.data.planets=a.data;for(a=0;a<mct.data.planets.length;a++){mct.data.planets[a].companies={names:{},valid:{}};var c=mct.data.planets[a].handle;mct.data.planets[mct.status.planet].companies.names.hardware={used:[],data:$.parseJSON($.get("../base/data/planets/"+c+"/companies/hardware/names.json").responseText)};
mct.data.planets[mct.status.planet].companies.names.software={used:[],data:$.parseJSON($.get("../base/data/planets/"+c+"/companies/software/names.json").responseText)};mct.data.planets[mct.status.planet].companies.names.advertisements={used:[],data:$.parseJSON($.get("../base/data/planets/"+c+"/companies/advertisements/names.json").responseText)};mct.data.planets[mct.status.planet].companies.names.drugs={used:[],data:$.parseJSON($.get("../base/data/planets/"+c+"/companies/drugs/names.json").responseText)};
mct.data.events.list={used:[],data:$.parseJSON($.get("../base/data/events/sandbox.json").responseText)}}}catch(b){console.log("Failed to load json configuration files.")}for(x=1;10>=x;x++)try{mct.data.scnenario[x]={used:[],data:$.parseJSON($.get("../base/data/scenarios/sc"+x+".json").responseText)}}catch(d){console.log("Failed to load scenario "+x)}baseGameInitPlanetCompanies()}
function baseGameInitPlanetCompanies(){var a=-1,c;for(c in mct.data.technologies.fields)if("type"==mct.data.technologies.fields[c].companies["for"]){mct.data.planets[mct.status.planet].companies.valid[c]={};for(var b in mct.data.technologies.fields[c].types){mct.data.planets[mct.status.planet].companies.valid[c][b]=[];for(var d=0;d<mct.data.technologies.fields[c].companies.amount;d++){do a=Math.floor(1E3*Math.random());while(-1<mct.data.planets[mct.status.planet].companies.names[c].used.indexOf(a));
mct.data.planets[mct.status.planet].companies.names[c].used.push(a);mct.data.planets[mct.status.planet].companies.valid[c][b].push(mct.data.planets[mct.status.planet].companies.names[c].data[a])}}}else for(mct.data.planets[mct.status.planet].companies.valid[c]=[],d=0;d<mct.data.technologies.fields[c].companies.amount;d++){do a=Math.floor(1E3*Math.random());while(-1<mct.data.planets[mct.status.planet].companies.names[c].used.indexOf(a));mct.data.planets[mct.status.planet].companies.names[c].used.push(a);
a={name:mct.data.planets[mct.status.planet].companies.names[c].data[a]};for(b in mct.data.technologies.fields[c].types)a[b]=!0;mct.data.planets[mct.status.planet].companies.valid[c].push(a)}}$("html").keyup(function(a){27==a.which&&require("nw.gui").App.closeAllWindows()});mct.pixi={renderer:null,stage:null,text:{},scenes:{current:null},windows:{interactions:{}},screen:{width:1280,height:1024,ratio:0},animateCommands:[]};mct.status.pixi.scene={};$.ajaxSetup({async:!1});mct.pixi.text.styles=$.parseJSON($.get("txt/styles.json").responseText);
mct.pixi.text.lang=$.parseJSON($.get("txt/lngs/"+mct.status.lang+".json").responseText);mct.pixi.assetsToLoad=["gfx-packed/gfx.json"];
$(document).ready(function(){global.setTimeout(function(){mct.pixi.stage=new PIXI.Stage(16777215,!0);mct.pixi.renderer=PIXI.autoDetectRenderer(mct.pixi.screen.width,mct.pixi.screen.height,null,!0);document.body.appendChild(mct.pixi.renderer.view);mct.pixi.screen.ratio=Math.min(window.innerWidth/mct.pixi.screen.width,window.innerHeight/mct.pixi.screen.height);mct.pixi.screen.width*=mct.pixi.screen.ratio;mct.pixi.screen.height*=mct.pixi.screen.ratio;mct.pixi.renderer.resize(mct.pixi.screen.width,mct.pixi.screen.height);
requestAnimFrame(displayAnimate);loader=new PIXI.AssetLoader(mct.pixi.assetsToLoad);delete mct.pixi.assetsToLoad;loader.onComplete=displaySceneMenuAdd;loader.load()},1E-8)});
function displayAnimate(){requestAnimFrame(displayAnimate);TWEEN.update();if(0<mct.pixi.animateCommands.length)for(var a=0;a<mct.pixi.animateCommands.length;a++)"rotation"==mct.pixi.animateCommands[a].type&&(mct.pixi.animateCommands[a].object.rotation+=mct.pixi.animateCommands[a].value);mct.pixi.renderer.render(mct.pixi.stage)}function displaySceneToggle(a){"undefined"==typeof a&&(a=mct.pixi.scenes.current);mct.pixi.scenes[a].visible=!0==mct.pixi.scenes[a].visible?!1:!0}
function displayWindowLayerTextSpecial(a){return"currentPlanet"==a?(a=mct.data.planets[mct.status.planet].name[mct.data.planets[mct.status.planet].storyVersion],"string"==typeof a?a:a[mct.status.lang]):a}function displayWindowLayerTextGet(a,c){return"lt"==a.substring(0,2)?mct.pixi.text.lang[a]:"undefined"!=typeof mct.pixi.windows[c].texts[a]?mct.pixi.windows[c].texts[a]:displayWindowLayerTextSpecial(a)}
function displayWindowLayerText(a,c,b,d,m,g,e,f){m=mct.pixi.text.styles[m];m={font:Math.floor(m[0]*mct.pixi.screen.ratio)+"px "+m[1],fill:m[2]};"string"==typeof e&&(e=displayWindowLayerTextGet(e,f));var h="";if("string"!=typeof e&&0<e.length){for(var l=0;l<e.length;l++){if(e.length-1>l&&"undefined"!=typeof g&&" "!=e[l].substring(e[l].length-1)||"undefined"==typeof g&&""!=h)h+=" ";h+=displayWindowLayerTextGet(e[l],f)}e=h}if("number"==typeof g){h="";l=-1;f=0;var k=[];do if(l++,l<e.length&&(0<h.length||
" "!=e.substring(l,l+1))&&(h+=e.substring(l,l+1),h.length==g)){f=0;var n=e.substring(l+1,l+2);if(""!=h.substring(h.length-1)&&" "!=n){f=h.length-1;do f--;while(" "!=h.substring(f,f+1))}0<f?(k.push(h.substring(0,f+1)),h=h.substring(f+1)):(k.push(h),h="")}while(l<e.length-1);""!=h&&k.push(h);if(0<k.length)for(e="",l=0;l<k.length;l++)e+=k[l],l<k.length-1&&(e+="\n")}e=new PIXI.Text(e,m);"left"==c?e.position.x=b.x:"right"==c&&(e.position.x=b.x-e.width);"undefined"!=typeof d.left?e.position.x+=d.left*mct.pixi.screen.ratio:
"undefined"!=typeof d.right&&(e.position.x-=d.right*mct.pixi.screen.ratio);"top"==a?e.position.y=b.y:"bottom"==a&&(e.position.y=b.y-e.height);"undefined"!=typeof d.top?e.position.y+=d.top*mct.pixi.screen.ratio:"undefined"!=typeof d.bottom&&(e.position.y-=d.bottom*mct.pixi.screen.ratio);return e}
function displayWindowLayerContainer(a,c,b){var d=new PIXI.DisplayObjectContainer;if("undefined"!=typeof b.size.width)var m=b.size.width*mct.pixi.screen.ratio;if("undefined"!=typeof b.size.height)var g=b.size.height*mct.pixi.screen.ratio;if("undefined"==typeof b.position)var e=mct.pixi.screen.width/2-m/2,f=mct.pixi.screen.height/2-g/2;else e=b.position.x,f=b.position.y;if("undefined"!=typeof b.border.size)var h=b.border.size*mct.pixi.screen.ratio,l=b.border.color;else h=0;if("undefined"!=typeof b.color)var k=
b.color;var n=new PIXI.Graphics;n.position.x=e;n.position.y=f;n.beginFill(k);0<h&&n.lineStyle(h,l);n.drawRect(0,0,m,g);d.addChild(n);n=null;"undefined"!=typeof b.title&&(l=0,l="left"==b.title.align?e+h:e+m-h,n=displayWindowLayerText("top",b.title.align,{x:l,y:f+h},b.title.padding,b.title.textStyle,null,b.title.text,a),d.addChild(n),mct.pixi.windows[a].layerCovers[c].top+=n.position.y-(f+h)+n.height);if("undefined"!=typeof b.menus&&0<b.menus.length)for(var p=0,s=0,r=k=0,k="",l=0;l<b.menus.length;l++){var q=
b.menus[l];""!=k&&k!=q.location&&(r=0);r="top"==q.location?0==p&&0==r?"top"==q.location&&null!=n?n.position.y+n.height:f+h:r+p:0==s&&0==r?f+g-h:r-s;k="left"==q.align?e+h:e+m-h;k=displayWindowLayerElements(q.location,q.align,{x:k,y:r},q.padding,q.textStyle,null,q.buttons,"buttons",a,c);"top"==q.location&&0<k.children.length?(mct.pixi.windows[a].layerCovers[c].top=k.position.y-(f+h)+(k.children[0].position.y+k.children[0].height),p+=k.children[0].height):0<k.children.length&&(mct.pixi.windows[a].layerCovers[c].bottom=
f+g-h-k.position.y-k.children[0].position.y,s+=k.children[0].height);d.addChild(k);k=q.location}if("undefined"!=typeof b.contents&&0<b.contents.length)for(n=mct.pixi.windows[a].layerCovers[c].top+f+h,c=f+g-(mct.pixi.windows[a].layerCovers[c].bottom+h),g=k=0,k="",l=0;l<b.contents.length;l++){f=b.contents[l];""!=k&&k!=f.location&&(g=0);var g="top"==f.location?0==g?n:g+(t.children[0].height+(t.children[0].position.y-g)):0==g?c:t.children[0].position.y,k="left"==f.align?e+h:e+m-h,t=displayWindowLayerElements(f.location,
f.align,{x:k,y:g},f.padding,f.textStyle,f.textLineLength,f.text,"text",a);d.addChild(t);k=f.location}return d}
function displayWindowLayerElements(a,c,b,d,m,g,e,f,h,l){var k=new PIXI.DisplayObjectContainer;k.position.x=b.x;k.position.y=b.y;if("text"==f)k=new PIXI.DisplayObjectContainer,k.addChild(displayWindowLayerText(a,c,b,d,m,g,e,h));else if("buttons"==f){b=[];var n={},n=[];for(g=0;g<e.length;g++)if("undefined"!=typeof e[g].elements)if(0<mct.pixi.windows[h].elements[e[g].elements].length)for(f=0;f<mct.pixi.windows[h].elements[e[g].elements].length;f++)n=mct.pixi.windows[h].elements[e[g].elements],n={text:n[f][1],
targetAction:e[g].action,actionParameter:n[f][0]},"undefined"!=typeof e[g].targetLayer&&(n.targetLayer=e[g].targetLayer),b.push(n);else{if("undefined"!=typeof e[g].targetLayer){var p=mct.pixi.windows[h].layerInteractions[l].status[mct.pixi.windows[h].layerInteractions[l].status.current].pop();if(0<mct.pixi.windows[h].elements[e[g].elements][p].length)for(f=0;f<mct.pixi.windows[h].elements[e[g].elements][p].length;f++)n=mct.pixi.windows[h].elements[e[g].elements][p],n={text:n[f][1],targetAction:e[g].action,
actionParameter:n[f][0]},"undefined"!=typeof e[g].targetLayer&&(n.targetLayer=e[g].targetLayer),b.push(n)}}else"undefined"!=typeof e[g].text&&(n={text:e[g].text,targetAction:e[g].action},"undefined"!=typeof e[g].actionParameter&&(n.actionParameter=n[g].actionParameter),b.push(n));delete b;e={x:0,y:0};f=null;for(g=0;g<b.length;g++)null!=f&&(e.x=f.position.x+f.width),f=displayWindowLayerText(a,c,e,d,m,null,b[g].text,h),p=new PIXI.Sprite(PIXI.Texture.fromImage("blank")),p.width=f.width,p.height=f.height,
p.position.x=f.position.x,p.position.y=f.position.y,"undefined"!=typeof b[g].targetAction&&(p.setInteractive(!0),mct.pixi.windows.interactions[p.position.x+" "+p.position.y]=[h,l,b[g]],p.click=function(a){audioPlayEffect("ef.click2");a=mct.pixi.windows.interactions[a.target.position.x+" "+a.target.position.y];var b=a[2].targetAction+'("'+a[0]+'","'+a[1]+'"';"undefined"!=typeof a[2].actionParameter&&(b+=',"'+a[2].actionParameter+'"');if(a[2].action=0<a[2].targetLayer)b+=',"'+a[2].targetLayer+'"';eval(b+
");")}),k.addChild(p),k.addChild(f)}return k}function displayWindowAdd(a,c,b,d){mct.pixi.windows[a]={json:$.parseJSON($.get(c).responseText),layers:[],layerCovers:[],layerInteractions:[],texts:b,elements:d};for(c=0;c<mct.pixi.windows[a].json.layers.length;c++)displayWindowLayer(a,-1,"default",c)}
function displayWindowLayer(a,c,b,d){var m=!1;if("undefined"!=typeof d&&0<d&&"undefined"!=typeof c&&-1<c){m=!0;if(1==mct.pixi.windows[a].layers[d].placeholder){var g={x:mct.pixi.windows[a].layers[c].children[0].position.x,y:mct.pixi.windows[a].layerCovers[c].top+mct.pixi.windows[a].layers[c].children[0].position.y},e=mct.pixi.windows[a].json.layers[c].size.width,f=mct.pixi.windows[a].json.layers[c].size.height;"undefined"!=typeof mct.pixi.windows[a].json.layers[c].border.size&&(e-=2*mct.pixi.windows[a].json.layers[c].border.size,
f-=2*mct.pixi.windows[a].json.layers[c].border.size,g.x+=mct.pixi.windows[a].json.layers[c].border.size,g.y+=mct.pixi.windows[a].json.layers[c].border.size);f-=mct.pixi.windows[a].layerCovers[c].top/mct.pixi.screen.ratio;f-=mct.pixi.windows[a].layerCovers[c].bottom/mct.pixi.screen.ratio;mct.pixi.windows[a].json.layers[d].size={width:e,height:f};mct.pixi.windows[a].json.layers[d].position=g;mct.pixi.windows[a].json.layers[d].parentLayer=Number(c)}g=c+","+d+","+b;mct.pixi.windows[a].layerInteractions[d].status.current!=
g&&(e=[],""!=mct.pixi.windows[a].layerInteractions[c].status.current&&(e=mct.pixi.windows[a].layerInteractions[c].status[mct.pixi.windows[a].layerInteractions[c].status.current],console.log(mct.pixi.windows[a].layers[d]),1===!mct.pixi.windows[a].layers[d].placeholder&&(mct.pixi.stage.removeChild(mct.pixi.windows[a].layers[d]),mct.pixi.windows[a].layers[d]={placeholer:1}),console.log(mct.pixi.windows[a].layerInteractions[c].status.current)),e.push(b),mct.pixi.windows[a].layerInteractions[d].status[g]=
e,mct.pixi.windows[a].layerInteractions[d].status.current=g)}else-1==c&&(m=!0);!0==m&&(-1==c?(mct.pixi.windows[a].layerCovers.push({top:0,bottom:0}),mct.pixi.windows[a].layerInteractions.push({status:{current:""}}),mct.pixi.windows[a].layers.push("undefined"!=typeof mct.pixi.windows[a].json.layers[d].visible?displayWindowLayerContainer(a,d,mct.pixi.windows[a].json.layers[d]):{placeholder:1}),"undefined"==typeof mct.pixi.windows[a].layers[d].placeholder&&(mct.pixi.stage.addChild(mct.pixi.windows[a].layers[d]),
displayWindowLayerShow(a,{show:[Number(d)]}))):(1==mct.pixi.windows[a].layers[d].placeholder&&(console.log(1),mct.pixi.windows[a].layers[d]=displayWindowLayerContainer(a,d,mct.pixi.windows[a].json.layers[d]),mct.pixi.stage.addChild(mct.pixi.windows[a].layers[d])),displayWindowLayerShow(a,{hide:["all"],show:[0,Number(d)]})))}
function displayWindowLayerInteractions(a){for(var c=!1,b="",d=0;d<mct.pixi.windows[a].layers.length;d++)if(c=mct.pixi.windows[a].layers[d].visible,"undefined"!=typeof mct.pixi.windows[a].layers[d].children)for(var m=0;m<mct.pixi.windows[a].layers[d].children.length;m++)mct.pixi.windows[a].layers[d].children[m].interactive&&(b=mct.pixi.windows[a].layers[d].children[m].position.x+" "+mct.pixi.windows[a].layers[d].children[m].position.y,!0==c?"undefined"!=typeof mct.pixi.windows[a].layerInteractions[d][b]&&
(mct.pixi.windows.interactions[b]=mct.pixi.windows[a].layerInteractions[d][b]):"undefined"!=typeof mct.pixi.windows.interactions[b]&&(mct.pixi.windows[a].layerInteractions[d][b]=mct.pixi.windows.interactions[b],delete mct.pixi.windows.interactions[b]))}
function displayWindowLayerShow(a,c){for(var b=!1,d=0;d<mct.pixi.windows[a].layers.length;d++)if(b="undefined"!=typeof c.hide&&("all"==c.hide[0]||-1<c.hide.indexOf(d))&&("undefined"==typeof c.show||"all"!=c.show[0]&&-1==c.show.indexOf(d))?!1:!0,mct.pixi.windows[a].layers[d].visible=b,"undefined"!=typeof mct.pixi.windows[a].layers[d].children)for(var m=0;m<mct.pixi.windows[a].layers[d].children.length;m++)mct.pixi.windows[a].layers[d].children[m].visible=b;displayWindowLayerInteractions(a)}
function displayWindowClose(a,c,b){displayWindowLayerShow(a,{hide:["all"]})}
function displaySceneMenuAdd(){audioPlayEffect("ef.birds1",!0);var a=new PIXI.DisplayObjectContainer,c=new PIXI.Sprite.fromFrame("mct_planet");c.anchor.x=0.5;c.anchor.y=0.5;c.scale.x=1.5*mct.pixi.screen.ratio;c.scale.y=1.5*mct.pixi.screen.ratio;c.position.x=mct.pixi.screen.width-100*mct.pixi.screen.ratio;c.position.y=mct.pixi.screen.height-100*mct.pixi.screen.ratio;a.addChild(c);mct.pixi.animateCommands.push({object:c,type:"rotation",value:5E-4});(new TWEEN.Tween({x:c.position.x,y:c.position.x})).to({y:c.position.y-
100,x:c.position.x-100},1E4).easing(TWEEN.Easing.Elastic.InOut).onUpdate(function(){c.position.x=this.x;c.position.y=this.y}).start().delay(1E3);var b=new PIXI.Sprite.fromFrame("mct_logo");b.anchor.x=0.5;b.anchor.y=0.5;b.scale.x=mct.pixi.screen.ratio;b.scale.y=mct.pixi.screen.ratio;b.position.x=mct.pixi.screen.width/2;b.position.y=mct.pixi.screen.height/2;a.addChild(b);var b=mct.pixi.text.styles.gametitle1,b={font:Math.floor(b[0]*mct.pixi.screen.ratio)+"px "+b[1],fill:b[2]},d=new PIXI.Text(mct.pixi.text.lang["lt.1.1.1"],
b);d.anchor.x=0.5;d.anchor.y=0.5;d.position.x=mct.pixi.screen.width/2;d.position.y=mct.pixi.screen.height/2-250*mct.pixi.screen.ratio;a.addChild(d);b=new PIXI.Sprite.fromFrame("mct_menu_button");b.anchor.x=0.5;b.anchor.y=0.5;b.scale.x=mct.pixi.screen.ratio;b.scale.y=mct.pixi.screen.ratio;b.position.x=mct.pixi.screen.width/2-250*mct.pixi.screen.ratio;b.position.y=mct.pixi.screen.height/2+250*mct.pixi.screen.ratio;b.setInteractive(!0);b.click=function(a){audioPlayEffect("ef.click2");displaySceneToggle();
displayScenePlanetAdd()};a.addChild(b);b=mct.pixi.text.styles.menubutton1;b={font:Math.floor(b[0]*mct.pixi.screen.ratio)+"px "+b[1],fill:b[2]};d=new PIXI.Text(mct.pixi.text.lang["lt.1.1.2"],b);d.anchor.x=0.5;d.anchor.y=0.5;d.position.x=mct.pixi.screen.width/2-250*mct.pixi.screen.ratio;d.position.y=mct.pixi.screen.height/2+250*mct.pixi.screen.ratio;a.addChild(d);d=new PIXI.Sprite.fromFrame("mct_menu_button");d.anchor.x=0.5;d.anchor.y=0.5;d.scale.x=mct.pixi.screen.ratio;d.scale.y=mct.pixi.screen.ratio;
d.position.x=mct.pixi.screen.width/2+250*mct.pixi.screen.ratio;d.position.y=mct.pixi.screen.height/2+250*mct.pixi.screen.ratio;d.setInteractive(!0);d.click=function(a){audioPlayEffect("ef.click2");global.setTimeout(function(){require("nw.gui").App.closeAllWindows()},500)};a.addChild(d);d=new PIXI.Text(mct.pixi.text.lang["lt.1.1.3"],b);d.anchor.x=0.5;d.anchor.y=0.5;d.position.x=mct.pixi.screen.width/2+250*mct.pixi.screen.ratio;d.position.y=mct.pixi.screen.height/2+250*mct.pixi.screen.ratio;a.addChild(d);
mct.pixi.scenes.current="menu";mct.pixi.scenes.menu=a;mct.pixi.scenes.menu.visible=!0;mct.pixi.stage.addChild(mct.pixi.scenes.menu);displayWindowAdd("eventmessage","scenes/events/windows/message.json",{dynEventTitle:"Welcome to your control center",dynEventDescription:["You are a master of control, you can click on start and quit or ","listen to the crazy birds all around this acid planet in the background. ","Their chemical reactions migth be critical, but be becalmed that is not a ","bug. If you want to listen to music use the controls in the lower ",
"right corner."],dynEventWinMessage:"- You won some experiences in launching a pre-alpha game.",dynEventFailMessage:["- But you failed to react quickly enough to close it, ","now you are addicted to play more of it."]})}
function displayScenePlanetAdd(){audioStopEffect("ef.birds1",!0);baseGameInitPlanet();var a=new PIXI.DisplayObjectContainer,c=new PIXI.Sprite.fromFrame("mct_planet");c.anchor.x=0.5;c.anchor.y=0.5;c.scale.x=mct.pixi.screen.ratio;c.scale.y=mct.pixi.screen.ratio;c.position.x=mct.pixi.screen.width/2+130*mct.pixi.screen.ratio;c.position.y=mct.pixi.screen.height/2;mct.pixi.animateCommands.push({object:c,type:"rotation",value:5E-4});a.addChild(c);mct.pixi.scenes.current="planet";mct.pixi.scenes.planet=a;
mct.pixi.scenes.planet.visible=!0;mct.pixi.stage.addChild(mct.pixi.scenes.planet);var a=[],c={},b=[],d;for(d in mct.data.technologies.fields)if("type"==mct.data.technologies.fields[d].companies["for"]){a.push([d,mct.data.technologies.fields[d].title]);c[d]=[];for(var m in mct.data.technologies.fields[d].types)c[d].push([m,mct.data.technologies.fields[d].types[m].title])}else b.push([d,mct.data.technologies.fields[d].title]);displayWindowAdd("planetcompanies","scenes/planet/windows/companies.json",
{},{technologyfieldsfortype:a,technologyfieldtypes:c,technologyfieldsfortypes:b})};