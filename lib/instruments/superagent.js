var fs      = require('fs');
var capture = require('../capture');

exports.write = function(buffer) {
  capture.add({
    request: {
      data: buffer
    }
  });
  return this.__shimmed.write.call(this, buffer);
};

exports.attach = function(field, path, name) {
  capture.add({
    request: {
      files: [{
        name: name,
        path: path,
        content: fs.readFileSync(path)
      }]
    }
  });
  return this.__shimmed.attach.call(this, field, path, name);
};
