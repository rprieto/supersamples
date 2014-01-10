var _ = require('lodash');

exports.resourceLink = function(sample) {
  return sample.groups.join('').toLowerCase();
}

exports.navigation = function(samples) {
  var navigation = {
    children: []
  };
  samples.forEach(function (sample) {
    var i = 0;
    var current = navigation;
    for (i = 0; i < sample.groups.length; ++i) {
      var path = sample.groups[i];
      var child = _.find(current.children, {name: path});
      if (!child) {
        child = {
          name: path,
          link: null,
          children: []
        };
        current.children.push(child);
      }
      current = child;
    }
    if (current.link === null) {
      current.link = exports.resourceLink(sample);
    }
  });
  return navigation.children;
};

exports.groups = function(samples) {
  var grouped = _.groupBy(samples, 'nav');
  var sortedKeys = _.keys(grouped).sort()
  return sortedKeys.map(function (key) {
    var firstSample = grouped[key][0];
    return {
      nav: key,
      link: exports.resourceLink(firstSample),
      samples: grouped[key]
    };
  });
}

exports.from = function(samples) {
  return {
    title: 'API Documentation',
    navigation: exports.navigation(samples),
    groups: exports.groups(samples)
  };
};
