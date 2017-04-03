'use strict';

const BASE_SCHEMA = require('./schema.json'),
    pathCache = {};

module.exports = {
    getBaseSchema: () => BASE_SCHEMA,

    /**
     * Loads custom schema from config or fixed base schema
     *
     * @param {Config} config
     *
     * @returns {Object|undefined}
     */
    getCustomSchema: function(config) {
        const customSchema = config.getConfig().schema;

        return customSchema && this._loadFile(config.resolvePath(customSchema));
    },

    _loadFile: path => {
        // reduce of very slow require operation
        if (!pathCache.hasOwnProperty(path)) {
            pathCache[path] = require(path);
        }

        return pathCache[path];
    }
};
