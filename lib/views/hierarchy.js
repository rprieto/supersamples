var _    = require('lodash');
var href = require('./href');

exports.from = function(samples) {
  var nested = samples.getNested();
  var headings = _.map(nested, function(groups, heading) {
    var groupList = _.map(groups, function(samples, name) {
      return {
        name: name,
        link: href.from(samples[0].group),
        breadcrumbs: samples[0].nav,
        samples: samples
      };
    });
    return {
      name: heading,
      groups: _.sortBy(groupList, 'name')
    }
  });
  return _.sortBy(headings, 'name');
};
