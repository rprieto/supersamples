'use strict';

module.exports = function (data, opts) {
    return {
        info: {
            name: opts.title,
            _postman_id: opts._postman_id || '',
            description: '',
            schema: 'https://schema.getpostman.com/json/collection/v2.0.0/collection.json'
        }
    };
}
