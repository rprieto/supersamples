var curl = require('./curl');

var samples = [];

exports.reset = function() {
  samples = [];
}

exports.add = function(mochaTest) {
  samples.push(spec(mochaTest));
};

exports.hierarchy = function(mochaTest) {
  if (mochaTest.parent) {
    var shortName  = mochaTest.title.split('\n')[0];
    return exports.hierarchy(mochaTest.parent).concat(shortName);
  }
  return [];
}

exports.get = function() {
  return samples;
}

function spec(mochaTest) {
  return {
    id: samples.length,
    summary: mochaTest.title,
    hierarchy: exports.hierarchy(mochaTest),
    request: mochaTest.request,
    response: mochaTest.response,
    route: mochaTest.route,
    snippets: {
      curl: curl.fromRequest(mochaTest.request)
    }
  };
}
