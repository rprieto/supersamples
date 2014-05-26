var fs         = require('fs-extra');
var path       = require('path');

exports.render = function(model, options) {

  // Write single JSON file
  // That contains all metadata to render full documentation in another process

  var outputFolder = path.dirname(options.outputFile);
  fs.mkdirpSync(outputFolder);
  fs.writeFileSync(options.outputFile, JSON.stringify(model, null, '  '));

  console.log('Generated in ' + path.resolve(options.outputFile));

};
