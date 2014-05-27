var curl = require('./curl');

var samples = [];

exports.reset = function() {
  samples = [];
}

exports.add = function(mochaTest) {
  samples.push(spec(mochaTest));
};

exports.get = function() {
  return samples;
}

function spec(mochaTest) {
  return {
    id: samples.length,
    summary: mochaTest.title,
    hierarchy: hierarchy(mochaTest),
    request: mochaTest.request,
    response: mochaTest.response,
    snippets: {
      curl: curl.fromRequest(mochaTest.request)
    }
  };
}

function hierarchy(mochaTest) {
  if (mochaTest.parent) {
    var shortName  = mochaTest.title.split('\n')[0];
    return hierarchy(mochaTest.parent).concat(shortName);
  }
  return [];
}
