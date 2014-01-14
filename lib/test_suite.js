var _       = require('lodash');
var Mocha   = require('mocha');
var should  = require('should');
var sinon   = require('sinon');
var async   = require('async');

function nothing(sandbox, cb) {
  cb();
}

function createTest(sample) {
  return new Mocha.Test(sample.name, function(done) {
    var sandbox = sinon.sandbox.create();
    var allBefore = (sample.before || []).map(function (fn) {
      return function(next) { fn(sandbox,next); };
    });
    async.series(allBefore, function() {
      var r = sample.request;
      _.each(sample.response.headers, function(value, header) {
        r = r.expect(header, value);
      });
      r.expect(sample.response.status)
       .expect(sample.response.body)
       .end(function(err, res) {
         sample.actualResponse = res;
         sandbox.restore();
         done(err);
       });
    });
  });
}

exports.from = function(samples) {

  var suites = {
    '/': new Mocha.Suite('')
  };
  
  samples.get().forEach(function(sample) {
    var i = 0;
    var suitePath = '/';
    for (i = 0; i < sample.group.length; ++i) {
      parent = suites[suitePath];
      suitePath += sample.group[i];
      if (suites[suitePath] === undefined) {
        var current = new Mocha.Suite(sample.group[i]);
        suites[suitePath] = current;
        parent.addSuite(current);
      }
    }
    
    var test = createTest(sample);
    suites[suitePath].addTest(test);
  });

  return suites['/'];

};
