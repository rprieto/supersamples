var fs         = require('fs-extra');
var path       = require('path');
var _          = require('lodash');
var wrench     = require('wrench');
var moment     = require('moment');
var handlebars = require('handlebars');
var pages      = require('./views/pages');
var navigation = require('./views/navigation');

require('./views/handlebars_helper');

var FILES = path.join(__dirname, '..', 'template', 'files');
var TEMPLATES = path.join(__dirname, '..', 'template', 'views');

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

function copyAllFiles(outputFolder) {
  wrench.copyDirSyncRecursive(FILES, outputFolder, {
    forceDelete: true,
    excludeHiddenUnix: true,
    preserveFiles: false
  });
}

function copyCustomStyles(styles, outputFolder) {
  fs.mkdirs(path.join(outputFolder, 'custom-css'));
  styles.forEach(function(file) {
    var outputPath = path.join(outputFolder, 'custom-css', path.basename(file));
    fs.copySync(file, outputPath);
  });
}

function customStylesPath(styles) {
  return styles.map(function(file) {
    return path.join('custom-css', path.basename(file));
  });
}

exports.write = function(samples, opts) {

  var intro = opts.intro ? readIntro(opts.intro) : '';
  var pagesModel = pages.create(samples.get());
  var navModel   = navigation.from(intro, pagesModel);

  copyAllFiles(opts.output);
  copyCustomStyles(opts.styles, opts.output)

  var viewmodel = {
    generated: moment().format("MMMM Do YYYY, h:mm a"),
    title: opts.title || 'API Documentation',
    navigation: navModel,
    styles: customStylesPath(opts.styles)
  }

  writeFile('index.hbs', 'index', opts.output, _.extend(viewmodel, {
    intro: intro
  }));

  pagesModel.forEach(function(page) {
    writeFile('pages.hbs', page.slug, opts.output, _.extend(viewmodel, page));
  });

};
