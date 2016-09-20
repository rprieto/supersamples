var _          = require('lodash');
var fs         = require('fs-extra');
var path       = require('path');

var templates  = {
  root:   require('./templates/root'),
  folder: require('./templates/folder'),
  sample: require('./templates/sample')
};

var folders = {};

var folderHashSeparator = '🙉';

var getFolderHash = function (sampleHierarchy) {
  if (sampleHierarchy.length < 3) return null;

  var hierarchy = _.cloneDeep(sampleHierarchy);
  hierarchy.splice(-1, 1); // remove the test name

  return hierarchy.join(folderHashSeparator);
};

var createFolder = function (sample, dest) {
  var folderHash = getFolderHash(sample.hierarchy);

  if (!folderHash) return null;

  var folderName = folderHash.split(folderHashSeparator).pop();
  var folder = templates.folder({ name: folderName });
  folders[folderHash] = folder;

  if (dest) dest.push(folder);

  return folder;
};

var findFolder = function (sample) {
  var folderHash = getFolderHash(sample.hierarchy);

  if (!folderHash || !folders[folderHash]) return null;

  return folders[folderHash];
}

module.exports.render = function (samples, options) {

  // create the output folder
  var outputFolder = path.dirname(options.outputFile);
  fs.mkdirpSync(outputFolder);

  // write the view as JSON
  var content = view(samples, options);
  fs.writeFileSync(options.outputFile, content);

  console.log('Generated in ' + path.resolve(options.outputFile));

};

function view (samples, options) {
  var data = templates.root(samples, options);

  data.item = []; // main collection container

  samples.forEach(function (sample) {
    // add a folder if needed
    var folder = findFolder(sample) || createFolder(sample, data.item);
    var sampleContainer = folder ? folder.item : data.item;

    var sample = templates.sample(sample, options);

    sampleContainer.push(sample);
  });

  return JSON.stringify(data, null, 2);
}
