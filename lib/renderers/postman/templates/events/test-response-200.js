'use strict';

module.exports = {
    listen: "test",
    script: {
        type: "text/javascript",
        exec: "tests[\"Status code is 200\"] = responseCode.code === 200;"
    }
};
