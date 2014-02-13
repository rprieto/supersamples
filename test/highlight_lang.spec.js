var should  = require('should');
var lang    = require('../lib/views/highlight_lang');

describe('custom highlight.js languages', function() {

  it('is valid', function() {
    lang.tokens.contains.forEach(function(item) {
      new RegExp(item.begin);
      new RegExp(item.end);
    });
  });

});
