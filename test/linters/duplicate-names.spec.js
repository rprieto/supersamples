var linter  = require('../../lib/linters/duplicate-names');
var should  = require('should');

describe('duplicate-names linter', function() {
  it("should not have any errors if there are no duplicate names", function(){
    var result = linter.lint([{name: "Hello"}]).errors
    should.deepEqual([],result)
  })

  it("should not have an error for each duplicate name", function(){
    var result = linter.lint([{name: "Hello"}, {name: "Hello"}]).errors
    should.deepEqual(["Hello (2 instances)"],result)
  })
})