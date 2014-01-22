var _      = require('lodash');
var markit = require('markit');
var slug   = require('./slug');


function fromIntro(markdown) {
  var current = null;
  var nav = [];
  var r = new markit.Renderer();
  r.header = function(text, level) {
    if (level === 1) {
      if (_.find(nav, {name: text}) == null) {
        current = {
          name: text,
          link: 'index.html',
          subnav: []
        };
        nav.push(current);
      }
    }
    if (level === 2 && current !== null) {
      current.subnav.push({
        name: text,
        link: 'index.html#' + slug.from(text),
        count: null
      });
    }
  };
  markit(markdown, {renderer: r});
  return nav;
}

function fromPages(pages) {
  var nav = pages.map(function(page) {
    var subnav = page.headings.map(function(heading) {
      return {
        name: heading.name,
        link: slug.from(page.name) + '.html#' + slug.from(heading.name),
        count: heading.samples.length
      };
    });
    return {
      name: page.name,
      link: slug.from(page.name) + '.html',
      subnav: subnav
    }
  });
  return nav;
}

exports.from = function(intro, samples) {
  var introNav = fromIntro(intro);
  var pagesNav = fromPages(samples);
  return introNav.concat(pagesNav);
};
