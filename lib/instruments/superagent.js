var _ = require('lodash');
var fs = require('fs');
var capture = require('../capture');


// ----------------------------------
// Instrument the <superagent> module
// ----------------------------------


var superagent = null;
var oldWrite   = null;
var oldAttach  = null;

exports.instrument = function(instance) {
  superagent = instance;
  oldWrite   = superagent.Request.prototype.write;
  oldAttach  = superagent.Request.prototype.attach;
  superagent.Request.prototype.write = function(buffer) {
    capture.add({
      request: {
        binary: true,
        data: buffer.toString('utf-8')
      }
    });
    return oldWrite.call(this, buffer);
  };
  superagent.Request.prototype.attach = function(field, path, name) {
    capture.add({
      request: {
        files: [{
          name: name,
          path: path,
          content: fs.readFileSync(path).toString('utf-8')
        }]
      }
    });
    return oldAttach.call(this, field, path, name);
  };
};

exports.restore = function() {
  superagent.Request.prototype.write = oldWrite;
  superagent.Request.prototype.attach = oldAttach;
};

