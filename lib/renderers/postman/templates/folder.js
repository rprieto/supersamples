'use strict';

module.exports = function (data, opts) {
    return {
        name: data.name,
        description: data.description || '',
        item: []
    };
}
