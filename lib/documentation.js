var fs         = require('fs');
var path       = require('path');
var wrench     = require('wrench');
var moment     = require('moment');
var handlebars = require('handlebars');
var navigation = require('./views/navigation');
var hierarchy  = require('./views/hierarchy');

require('./views/handlebars_helper');

var FILES = path.join(__dirname, '..', 'template', 'files');
var TEMPLATES = path.join(__dirname, '..', 'template', 'views');

function readIntro() {
  return require('fs').readFileSync('example/intro.md').toString();
}

function readTemplate (filepath) {
  var source = fs.readFileSync(path.join(TEMPLATES, filepath));
  return handlebars.compile(source.toString());
}

function copyAllFiles (outputFolder) {
  wrench.copyDirSyncRecursive(FILES, outputFolder, {
    forceDelete: true,
    excludeHiddenUnix: true,
    preserveFiles: false
  });
}

function writeIndex (viewModel, outputFolder) {
  var template = readTemplate('index.hbs');
  var indexPath = path.join(outputFolder, 'index.html');
  var indexContent = template(viewModel);
  fs.writeFileSync(indexPath, indexContent);
}

exports.write = function (samples, outputFolder) {
  var introText = readIntro();
  var viewModel = {
    generated: moment().format("MMMM Do YYYY, h:mm a"),
    title: 'API Documentation',
    intro: introText,
    navigation: navigation.from(introText, samples),
    hierarchy: hierarchy.from(samples)
  };

  copyAllFiles(outputFolder);
  writeIndex(viewModel, outputFolder);
};
