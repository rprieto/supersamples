var _ = require('lodash');
var fs = require('fs');
var capture = require('../capture');


// ----------------------------------
// Instrument the <superagent> module
// ----------------------------------


var superagent = null;
var functions  = ['write', 'attach'];
var original   = {};

exports.instrument = function(instance) {

  superagent = instance;
  functions.forEach(function(name) {
    original[name] = superagent.Request.prototype[name];
  });

  superagent.Request.prototype.write = function(buffer) {
    captureWrites(buffer);
    return original['write'].call(this, buffer);
  };
  superagent.Request.prototype.attach = function(field, path, name) {
    captureAttachments(field, path, name);
    return original['attach'].call(this, field, path, name);
  };

};

exports.restore = function() {
  functions.forEach(function(name) {
    superagent.Request.prototype[name] = original[name];
  });
};




// -----------------------------------
// Helpers to extract the request data
// -----------------------------------



function captureWrites(buffer) {
  capture.add({
    request: {
      binary: true,
      data: buffer.toString('utf-8')
    }
  });
}

function captureAttachments(field, path, name) {
  capture.add({
    request: {
      files: [{
        name: name,
        path: path,
        content: fs.readFileSync(path).toString('utf-8')
      }]
    }
  });
}

