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
  var name = ((opts && opts.name) || mochaTest.title).trim();
  if(name.match(/\n/)){
    console.warn("Warning: Multiline name: " + name);
  }
  return name;
}

function hierarchy(mochaTest) {
  if (mochaTest.parent) {
    var shortName  = mochaTest.title.split('\n')[0];
    return hierarchy(mochaTest.parent).concat(shortName);
  }
  return [];
}
