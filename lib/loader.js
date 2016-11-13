'use strict';

const BASE_SCHEMA = './schema.json',
    pathCache = {};

module.exports = {
    _getBaseSchema: () => BASE_SCHEMA,

    _loadFile: path => {
        // reduce of very slow require operation
        if (!pathCache.hasOwnProperty(path)) {
            pathCache[path] = require(path);
        }

        return pathCache[path];
    },

    /**
     * Loads custom schema from config or fixed base schema
     *
     * @param {Config} config
     *
     * @returns {Object}
     */
    load: function(config) {
        const customSchema = config.getConfig().schema;

        return this._loadFile(customSchema ? config.resolvePath(customSchema) : BASE_SCHEMA);
    }
};
