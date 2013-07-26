exports.project = function(pm) {
  var f = pm.filters(require('pm-spritesheet'));

  return {
    spritesheet: {
      files: '*.png',
      dev: [
        f.spritesheet({filename: 'sprite_sheet.png', root: './', jsonStyle:'texturePacker'})
      ]
    }
  };

};