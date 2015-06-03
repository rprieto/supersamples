var linter  = require('../../lib/linters/multiline-names');
var should  = require('should');

describe('multiline-names linter', function() {
  it("should not have any errors if there are no samples with names with multiple lines", function(){
    var result = linter.lint([{name: "Hello"}]).errors
    should.deepEqual([],result)
  })

  it("should have an error for each multiline name", function(){
    var result = linter.lint([{name: "Hello\nWorld"}]).errors
    should.deepEqual(["Hello\nWorld"],result)
  })
})