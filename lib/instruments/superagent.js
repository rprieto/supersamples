var fs      = require('fs');
var capture = require('../capture');

exports.write = function(buffer) {
  capture.add({
    request: {
      binary: true,
      data: buffer.toString('utf-8')
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
        content: fs.readFileSync(path).toString('base64')
      }]
    }
  });
  return this.__shimmed.attach.call(this, field, path, name);
};
