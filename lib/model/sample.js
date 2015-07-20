var curl = require('./curl');

exports.create = function(mochaTest, request, response) {
  return {
    name: name(mochaTest),
    summary: mochaTest.title,
    hierarchy: hierarchy(mochaTest),
    request: request,
    response: response,
    snippets: {
      curl: curl.fromRequest(request)
    }
  };
}

function name(mochaTest) {
  var opts = mochaTest.ctx['supersamples'];
  return ((opts && opts.name) || mochaTest.title).trim();
}

function hierarchy(mochaTest) {
  if (mochaTest.parent) {
    var shortName  = mochaTest.title.split('\n')[0];
    return hierarchy(mochaTest.parent).concat(shortName);
  }
  return [];
}
