'use strict';

const pathCache = {};

module.exports = (path) => {
    // reduce of very slow require operation
    if (!pathCache.hasOwnProperty(path)) {
        pathCache[path] = require(path);
    }

    return pathCache[path];
};
