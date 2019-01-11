var sinon = require('sinon');
var patch = require('./patch-require');

var instruments = {
  superagent: require('./instruments/superagent'),
  supertest: require('./instruments/supertest'),
  restify: require('./instruments/restify'),
  express: require('./instruments/express')
}

var sandbox = sinon.sandbox.create();

exports.setup = function () {

  patch.module('superagent', function (instance) {
    var Request = instance.Request;
    replace(Request.prototype, 'write', instruments.superagent.write);
    replace(Request.prototype, 'attach', instruments.superagent.attach);
  });

  patch.module('supertest', function (instance) {
    var Test = instance.Test;
    replace(Test.prototype, 'expect', instruments.supertest.expect);
    replace(Test.prototype, 'assert', instruments.supertest.assert);
  });

  patch.module('restify', function (instance) {
    var dummyServer = instance.createServer();
    var Router = dummyServer.router.constructor;
    // replace(Router.prototype, 'lookup', instruments.restify.find);
  });

  patch.module('express', function (instance) {
    var Router = instance.Router;
    replace(Router, 'process_params', instruments.express.processParams);
  });

};

exports.restore = function () {
  sandbox.restore();
};


function replace(instance, functionName, replacement) {
  instance.__shimmed = instance.__shimmed || {};
  instance.__shimmed[functionName] = instance[functionName];
  sandbox.stub(instance, functionName, replacement)
};