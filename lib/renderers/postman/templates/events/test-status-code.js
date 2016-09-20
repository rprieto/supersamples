'use strict';

module.exports = function (data, opts) {
    return {
        listen: 'test',
        script: {
            type: 'text/javascript',
            exec: 'tests[\"Status code is '+ (data.statusCode) +'\"] = responseCode.code === '+ (data.statusCode) +';'
        }
    };
};
