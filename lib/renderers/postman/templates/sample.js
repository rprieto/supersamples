'use strict';

var _               = require('lodash');
var testStatusCode  = require('./events/test-status-code');
var options         = require('./../../../options');

var IGNORE_HEADERS = ['content-length'];

module.exports = function (data, opts) {

  data.request = data.request || {};
  opts = opts || {};
  opts.replace = opts.replace || {};

  var baseUrl = options.get().baseUrl || '{{ baseUrl }}';

  var template =  {
    name: data.name || 'Sample',
    event: [],
    request: {
      url: baseUrl + data.request.path,
      method: data.request.method || 'GET',
      header: getHeaders(data.request.headers, opts),
      description: data.summary || data.name || ''
    },
    response: []
  };

  // add body
  var requestHasData = (data.request.method !== 'GET' && data.request.data);
  if (requestHasData) {
    var payload = filterItems(data.request.data, opts.replace.body);
    template.request.body = {
      mode: 'raw',
      raw: JSON.stringify(payload || '', null, 2)
    }
  }
  else {
    template.request.body = {
      mode: 'formdata',
      formdata: []
    }
  }

  // add tests
  if (opts.generateTests && data.response.status) {
    template.event.push(testStatusCode({ statusCode: data.response.status }));
  }

  return template;
};

function filterItems (items, replacements) {
  items = items || {};

  if (!replacements) return items;

  var filterNullified = function (items, replacements) {
    return Object.keys(items).filter(function (key) {
      // filter out items from options
      return (replacements.hasOwnProperty(key)) ?
        !(_.isNull(replacements[key])) :
        true;
    });
  };

  var replaceWithOptions = function (items, replacements) {
    var replaceItems = filterNullified(items, replacements);

    _.forEach(items, function (value, key) {
      if (_.isObject(value)) {
        items[key] = replaceWithOptions(value, replacements);
      }
      if (replacements.hasOwnProperty(key)) {
        items[key] = replacements[key];
      }
    });

    return _.pick(items, replaceItems);
  };

  return replaceWithOptions(items, replacements);
}

function getHeaders (headers, opts) {
  // make all header keys lowercase
  if (opts.replace.headers) {
    Object.keys(opts.replace.headers).forEach(function (key) {
      opts.replace.headers[key.toLowerCase()] = opts.replace.headers[key];
    });
  }

  // filter out ignored headers
  IGNORE_HEADERS.forEach(function (header) {
    if (header.hasOwnProperty(header)) delete items[header];
  });
  
  // filter items from options
  var items = filterItems(headers, opts.replace.headers);
  return Object.keys(items).map(function (key) {
    return {
      key: key,
      value: items[key],
      description: ''
    };
  });
}
