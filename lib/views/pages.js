var _    = require('lodash');
var slug = require('./slug');

/*
[
  {
    name: 'My page',
    slug: 'my-page',
    headings: [
      {
        name: 'Heading 1',
        slug: 'heading-1',
        samples: [ sample, sample ]
      },
      {
        name: 'Heading 2',
        slug: 'heading-2',
        samples: [ sample, sample ]
      }
  }
]
*/

exports.create = function(samples) {
  var nested = nestTwoLevels(samples);
  var pages = _.map(nested, function(headings, page) {
    var headingList = _.map(headings, function(samples, name) {
      return {
        name: name,
        slug: slug.from(name),
        samples: samples
      };
    });
    return {
      name: page,
      slug: slug.from(page),
      headings: _.sortBy(headingList, 'name')
    }
  });
  return _.sortBy(pages, 'name');
};



/*
{
  pageName: {
    heading: [ sample, sample ],
    heading: [ sample, sample ]
  },
  page: {
    heading: [ sample, sample ]
  }
}
*/

function nestTwoLevels(samples) {
  return samples.reduce(function(acc, sample) {
    var page     = sample.hierarchy.length > 0 ? sample.hierarchy[0] : 'API';
    var heading  = sample.hierarchy.length > 1 ? sample.hierarchy[1] : 'Samples';
    acc[page] = acc[page] || {};
    acc[page][heading] = acc[page][heading] || [];
    acc[page][heading].push(sample);
    return acc;
  }, {});
};

