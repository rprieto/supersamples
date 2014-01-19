var _      = require('lodash');
var markit = require('markit');
var href   = require('./href');


function fromIntro(markdown) {
  var current = null;
  var headings = [];
  var r = new markit.Renderer();
  r.header = function(text, level) {
    if (level === 1) {
      if (_.find(headings, {name: text}) == null) {
        current = { name: text, subnav: [] };
        headings.push(current);
      }
    }
    if (level === 2 && current !== null) {
      current.subnav.push({
        name: text,
        link: href.from(text),
        count: null
      });
    }
  };
  markit(markdown, {renderer: r});
  return headings;
}

function fromSamples(samples) {
  var nested = samples.getNested();
  var headings = _.map(nested, function(categories, heading) {
    var subnav = _.map(categories, function(samples, catName) {
      return {
        name: catName,
        link: href.from(samples[0].group),
        count: samples.length
      };
    });
    return {
      name: heading,
      subnav: _.sortBy(subnav, 'name')
    }
  });
  return _.sortBy(headings, 'name');
}

exports.from = function(intro, samples) {
  var introNav  = fromIntro(intro);
  var sampleNav = fromSamples(samples);
  return introNav.concat(sampleNav);
};
