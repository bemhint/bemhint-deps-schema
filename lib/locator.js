'use strict';

/**
 * Finds line/column-location of path specified using locator
 *
 * @param {Config} config
 * @param {String} content
 * @param {String} dataPath
 *
 * @returns {Location|undefined}
 */

module.exports = function(config, content, dataPath) {
    const locator = config.getConfig().locator;

    return locator && locator(content, dataPath);
};

/**
 * @typedef {Object} Location
 *
 * @property {Number} line - 1-based line number
 * @property {Number} column - 1-based column number
 */
