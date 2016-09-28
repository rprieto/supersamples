var _          = require('lodash');
var fs         = require('fs-extra');
var path       = require('path');

var templates  = {
  root:   require('./templates/root'),
  folder: require('./templates/folder'),
  sample: require('./templates/sample')
};

var FOLDER_HASH_SEPARATOR = '🙉';

var foldersIndex;
var minHierarchyLevel;

module.exports.render = function (samples, options, cb) {

  foldersIndex = {};
  minHierarchyLevel = getMinHierarchyLevel(samples);

  // create the output folder
  var outputFolder = path.dirname(options.outputFile);
  fs.mkdirpSync(outputFolder);

  // write the view as JSON
  var content = view(samples, options);
  if (!cb) {
    fs.writeFileSync(options.outputFile, content);
    return console.log('Generated in ' + path.resolve(options.outputFile));
  }

  return cb(content);
};

function getMinHierarchyLevel (samples) {
  var firstHierarchyLevels = samples.map(function (sample) {
    return sample.hierarchy[0];
  });

  var multipleFirstLevels = _.uniq(firstHierarchyLevels).length > 1; 

  if (multipleFirstLevels) return 2;

  return 3;
}

function getFolderHash (sampleHierarchy) {
  if (sampleHierarchy.length < minHierarchyLevel) return null;

  var hierarchy = _.cloneDeep(sampleHierarchy);
  hierarchy.splice(-1, 1); // remove the test name

  return hierarchy.join(FOLDER_HASH_SEPARATOR);
}

function createFolder (sample, dest) {
  var folderHash = getFolderHash(sample.hierarchy);

  if (!folderHash) return null;

  var folderName = folderHash.split(FOLDER_HASH_SEPARATOR).pop();
  var folder = templates.folder({ name: folderName });
  foldersIndex[folderHash] = folder;

  if (dest) dest.push(folder);

  return folder;
}

function findFolder (sample) {
  var folderHash = getFolderHash(sample.hierarchy);

  if (!folderHash || !foldersIndex[folderHash]) return null;

  return foldersIndex[folderHash];
}

function view (samples, options) {
  var data = templates.root(samples, options);
  data.item = []; // main collection container

  // additional items from `before` options
  if (options.before) data.item = options.before.slice(0).concat(data.item);

  // generate items
  samples.forEach(function (sample) {

    // add a folder if it doesn't exist
    var folder = findFolder(sample) || createFolder(sample, data.item);

    // if folder was added - place sample in it
    // otherwise - place sample in collection root 
    var sampleContainer = folder ? folder.item : data.item;
    var sample = templates.sample(sample, options);
    sampleContainer.push(sample);
  });

  // additional items from options
  if (options.additionalItems) data.item = data.item.concat(options.additionalItems);

  return JSON.stringify(data, null, 2);
}
