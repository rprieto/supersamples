'use strict';

var testResponse200 = require('./events/test-response-200');

module.exports = function (data, opts) {
    data.request = data.request || {};

    var template =  {
        name: data.name || 'Sample',
        event: [
            testResponse200
        ],
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
        response: []
    };

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

    return template;
}
