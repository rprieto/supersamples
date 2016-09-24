'use strict';

var _         = require('lodash');
var Mocha     = require('mocha');
var fs        = require('fs');
var path      = require('path');
var http      = require('http');
var request   = require('supertest');
var capture   = require('./../../../lib/capture');
var options   = require('./../../../lib/options');
var sample    = require('./../../../lib/model/sample');
var samples   = require('./../../../lib/model/samples');
var renderer  = require('./../../../lib/renderers/postman');

samples.reset();

var opts = options.get().renderers.postman;

var server = request(http.createServer(function(req, res) {
  var url = req.url;

  switch (url) {
    case '/200':
      res.writeHead(200);
      return res.end();
    case '/404':
      res.writeHead(404);
      return res.end();
    case '/json':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ hello: 'world' }));
    default:
      res.writeHead(200);
      return res.end();
  }
}));

function processRequest (test, request, cb) {
  capture.reset();

  console.log('-- Running mock test 🔎');
  request.end(function(err, res) {
    var request  = capture.get().request;
    var response = capture.get().response;
    samples.add(sample.create(test, request, response));
    if (cb) cb();
  });
}

function runSuite(suiteFile, cb) {
  samples.reset();

  var mocha = new Mocha();
  var testFile = path.resolve(__dirname, suiteFile);

  delete require.cache[testFile];
  mocha.addFile(testFile);
  
  mocha.run(function () {
    var sampleItems = samples.get();
    renderer.render(sampleItems, opts, function (output) {
      cb(sampleItems, JSON.parse(output));
    });
  });
}

function isFolder (item) {
  return _.isEqual(Object.keys(item).sort(), ['description', 'item', 'name']);
}

function isRequest (item) {
  return (item.hasOwnProperty('request'));
}

function getFolders (collection) {
  return collection.item.filter(function (item) {
    return isFolder(item);
  });
}

function getRootRequests (collection) {
  return collection.item.filter(function (item) {
    return isRequest(item);
  });
}

function getAllRequests (collection) {
  return _.flatten(collection.item.map(function (item) {
    return isFolder(item) ? item.item : item;
  }));
}

module.exports = {
  processRequest: processRequest,
  runSuite: runSuite,
  server: server,
  isFolder: isFolder,
  isRequest: isRequest,
  getFolders: getFolders,
  getRootRequests: getRootRequests,
  getAllRequests: getAllRequests
}
