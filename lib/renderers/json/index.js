var fs         = require('fs-extra');
var path       = require('path');

exports.render = function(model, options) {

  // create the output folder
  var outputFolder = path.dirname(options.outputFile);
  fs.mkdirpSync(outputFolder);

  // write the view as JSON
  fs.writeFileSync(options.outputFile, view(model, options.includeBuffers));

  console.log('Generated in ' + path.resolve(options.outputFile));

};

function view(model, includeBufferData) {

  function hexBuffer() {
    if (includeBufferData) {
      return '<Buffer ' + this.toString('hex') + '>';
    } else {
      return '<Buffer ' + this.length + ' bytes>';
    }
  }

  var data = null;

  try {
    var toJSON = Buffer.prototype.toJSON;
    Buffer.prototype.toJSON = hexBuffer;
    data = JSON.stringify(model, null, '  ');
  } finally {
    Buffer.prototype.toJSON = toJSON;
  }

  return data;
}
