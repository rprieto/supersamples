var fs         = require('fs');
var path       = require('path');
var wrench     = require('wrench');
var handlebars = require('handlebars');

require('./handlebars_helper');

var FILES = path.join(__dirname, '..', 'template', 'files');
var TEMPLATES = path.join(__dirname, '..', 'template', 'views');

function readTemplate (filepath) {
  var source = fs.readFileSync(path.join(TEMPLATES, filepath));
  return handlebars.compile(source.toString());
}

function registerPartial (name, filepath) {
  var source = fs.readFileSync(path.join(TEMPLATES, filepath));
  handlebars.registerPartial(name, source.toString());
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
  registerPartial('navitem', 'navitem.hbs');
  var indexPath = path.join(outputFolder, 'index.html');
  var indexContent = template(viewModel);
  fs.writeFileSync(indexPath, indexContent);
}

exports.write = function (viewModel, outputFolder) {
  // console.log(require('util').inspect(viewModel.groups[3].samples[0].request, {depth:6, colors:true}));
  copyAllFiles(outputFolder);
  writeIndex(viewModel, outputFolder);
};
