var sinon = require('sinon');
var patch = require('./patch-require');

var instruments = {
  superagent: require('./instruments/superagent'),
  supertest:  require('./instruments/supertest'),
  restify:    require('./instruments/restify')
}

var sandbox = sinon.sandbox.create();

exports.setup = function() {

  patch.module('superagent', function(instance) {
    Request = instance.Request;
    replace(Request.prototype, 'write', instruments.superagent.write);
    replace(Request.prototype, 'attach', instruments.superagent.attach);
  });

  patch.module('supertest', function(instance) {
    Test = instance.Test;
    replace(Test.prototype, 'expect', instruments.supertest.expect);
    replace(Test.prototype, 'assert', instruments.supertest.assert);
  });

  patch.module('restify', function(instance) {
    var dummyServer = instance.createServer();
    Router = dummyServer.router.constructor;
    replace(Router.prototype, 'find', instruments.restify.find);
  });

};

exports.restore = function() {
  sandbox.restore();
};


function replace(instance, functionName, replacement) {
  instance.__shimmed = instance.__shimmed || {};
  instance.__shimmed[functionName] = instance[functionName];
  sandbox.stub(instance, functionName, replacement)
};
