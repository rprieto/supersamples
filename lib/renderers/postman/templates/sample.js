'use strict';

var testStatusCode = require('./events/test-status-code');

module.exports = function (data, opts) {
    data.request = data.request || {};

    var template =  {
        name: data.name || 'Sample',
        event: [],
        request: {
            url: '{{ hostUrl }}' + data.request.path,
            method: data.request.method || 'GET',
            header: (function () {
                return Object.keys(data.request.headers || {}).map(function(key) {
                    return {
                        key: key,
                        value: data.request.headers[key],
                        description: ''
                    };
                });
            })(),
            description: data.summary || data.name || ''
        },
        response: [],
    };

    // add body
    if (data.request.method && data.request.method !== 'GET') {
        template.request.body = {
            mode: 'raw',
            raw: JSON.stringify(data.request.data || '', null, 2)
        }
    }
    else {
        template.request.body = {
            mode: 'formdata',
            formdata: []
        }
    }

    // add tests
    if (data.response.status) {
        template.event.push(testStatusCode({ statusCode: data.response.status }));
    }

    return template;
}
