var should    = require('should');
var helper    = require('./helper');
var Validator = require('jsonschema').Validator;
var schema    = require('./collection-schema-v2.0.0.json');
var samples   = require('./../../../lib/model/samples');
var options   = require('./../../../lib/options');

var v = new Validator();

describe('Postman renderer', function() {
  var model, collection;

  describe('Single <describe> block', function () {
    before(function (done) {
      helper.runSuite('samples/single-describe.js', function (samples, output) {
        model = samples;
        collection = output;
        done();
      })
    });

    it('passes validation', function () {
      var validationError = v.validate(collection, schema).throwError;
      should.not.exist(validationError);
    });

    describe('Generates correct output', function () {
      it('does not generate folders', function () {
        helper.getFolders(collection).length.should.equal(0);
      });

      it('generates three requests on root level', function () {
        helper.getRootRequests(collection).length.should.equal(3);
      });
    });
  });

  describe('Multiple first-level <describe> blocks', function () {
    before(function (done) {
      helper.runSuite('samples/multiple-describe.js', function (samples, output) {
        model = samples;
        collection = output;
        done();
      })
    });

    it('passes validation', function () {
      var validationError = v.validate(collection, schema).throwError;
      should.not.exist(validationError);
    });

    describe('Generates correct output', function () {
      it('dgenerates two folders', function () {
        helper.getFolders(collection).length.should.equal(2);
      });

      it('generates requests under correct folders', function () {
        helper.getAllRequests(collection).length.should.equal(3);
        var firstFolder = collection.item[0];
        var secondFolder = collection.item[1];
        firstFolder.item[0].name.should.equal('GET request 1');
        secondFolder.item[0].name.should.equal('GET request 2');
        secondFolder.item[1].name.should.equal('POST request 3');
      });
    });
  });

  describe('Multiple nested <describe> blocks', function () {
    before(function (done) {
      helper.runSuite('samples/multiple-nested-describe.js', function (samples, output) {
        model = samples;
        collection = output;
        done();
      })
    });

    it('passes validation', function () {
      var validationError = v.validate(collection, schema).throwError;
      should.not.exist(validationError);
    });

    describe('Generates correct output', function () {
      it('generates two folders with correct names', function () {
        var folders = helper.getFolders(collection);
        var firstFolder = folders[0];
        var secondFolder = folders[1];
        folders.length.should.equal(2);
        firstFolder.name.should.equal('Outer <describe> block 1');
        secondFolder.name.should.equal('Inner <describe> block 3');
      });

      it('generates requests under correct folders', function () {
        helper.getRootRequests(collection).length.should.equal(0);
        helper.getAllRequests(collection).length.should.equal(3);
        var firstFolder = collection.item[0];
        var secondFolder = collection.item[1];
        firstFolder.item[0].name.should.equal('GET request 1');
        secondFolder.item[0].name.should.equal('GET request 2');
        secondFolder.item[1].name.should.equal('POST request 3');
      });
    });
  });

  describe('Nested <describe> blocks', function () {
    before(function (done) {
      helper.runSuite('samples/nested-describe.js', function (samples, output) {
        model = samples;
        collection = output;
        done();
      })
    });

    it('passes validation', function () {
      var validationError = v.validate(collection, schema).throwError;
      should.not.exist(validationError);
    });

    describe('Generates correct output', function () {
      it('generates two folders', function () {
        helper.getFolders(collection).length.should.equal(2);
      });
      
      it('does not generate requests on root level', function () {
        helper.getRootRequests(collection).length.should.equal(0);
      });

      it('generates three requests in total', function () {
        helper.getAllRequests(collection).length.should.equal(3);
      });
    });
  });

  describe('Options', function () {
    var requests;

    before(function (done) {
      var postmanOptions = options.get().renderers.postman;
      
      postmanOptions.replace = {
        headers: {
          authToken: '{{ token }}'
        },
        body: {
          foo: '{{ payload }}',
          bar: null
        }
      };

      postmanOptions.additionalItems = [{ name: 'additional item' }];

      helper.runSuite('samples/single-describe.js', function (samples, output) {
        model = samples;
        collection = output;
        requests = helper.getAllRequests(collection);
        done();
      })
    });

    it('correctly replaces headers from options', function () {
      var sample = requests[0].request;
      sample.header[0].value.should.equal('{{ token }}');
    });

    it('correctly replaces body from options', function () {
      var sample = requests[2].request;
      var body = JSON.parse(sample.body.raw);
      body.payloadField.foo.should.equal('{{ payload }}');
      should.not.exist(body.payloadField.bar);
    });

    it('adds additional items from `additionalItems` options', function () {
      var lastItem = collection.item[collection.item.length - 1];
      lastItem.name.should.equal('additional item');
    });

  });
});
