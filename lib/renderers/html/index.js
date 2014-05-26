var _          = require('lodash');
var fs         = require('fs-extra');
var os         = require('os');
var path       = require('path');
var wrench     = require('wrench');
var glob       = require('glob');
var moment     = require('moment');
var handlebars = require('handlebars');
var pages      = require('./pages');
var navigation = require('./navigation');

require('./handlebars_helper');

var FILES = path.join(__dirname, 'files');
var TEMPLATES = path.join(__dirname, 'templates', 'views');

function readIntro(introPath) {
  return require('fs').readFileSync(introPath).toString();
}

function readTemplate(filepath) {
  var source = fs.readFileSync(path.join(TEMPLATES, filepath));
  return handlebars.compile(source.toString());
}

function writeFile(templateName, pageName, outputFolder, viewModel) {
  var template = readTemplate(templateName);
  var filePath = path.join(outputFolder, pageName + '.html');
  var content = template(viewModel);
  fs.writeFileSync(filePath, content, 'utf-8');
}

function copyTemplateFiles(outputFolder) {
  wrench.copyDirSyncRecursive(FILES, outputFolder, {
    forceDelete: true,
    excludeHiddenUnix: true,
    preserveFiles: false
  });
}

function copyCustomFiles(fileSpecs, outputFolder) {
  var options = { nonull: false, sync: true, mark: true };
  _(fileSpecs).forEach(function(subFolder, pattern) {
    var files = glob(pattern, options);
    files.forEach(function(filePath) {
      if (filePath[filePath.length -1] !== '/') {
        var fileName = path.basename(filePath);
        var outputPath = path.join(outputFolder, subFolder, fileName);
        fs.copySync(filePath, outputPath);
      }
    });
  });
}

exports.render = function(model, options) {

  options = _.defaults(options, {
    outputFolder: os.tmpdir(),
    title: 'API Documentation',
    intro:  null,
    files: {},
    styles: [],
  });

  var intro = options.intro ? readIntro(options.intro) : '';
  var pagesModel = pages.create(model);
  var navModel   = navigation.from(intro, pagesModel);

  fs.mkdirpSync(options.outputFolder);
  copyTemplateFiles(options.outputFolder);
  copyCustomFiles(options.files, options.outputFolder);

  var viewmodel = {
    generated: moment().format("MMMM Do YYYY, h:mm a"),
    title: options.title,
    baseUrl: 'SHOULD_BE_IN_PAGE_MODEL', //options.baseUrl,
    navigation: navModel,
    styles: options.styles
  }

  writeFile('index.hbs', 'index', options.outputFolder, _.extend(viewmodel, {
    intro: intro
  }));

  pagesModel.forEach(function(page) {
    writeFile('pages.hbs', page.slug, options.outputFolder, _.extend(viewmodel, page));
  });

  console.log('Generated in ' + path.resolve(options.outputFolder));

};
