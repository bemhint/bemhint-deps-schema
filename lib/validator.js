'use strict';

const vm = require('vm'),
    Ajv = require('ajv');

/**
 * Validates content with json-schema in async way
 *
 * @param {Object} schema
 * @param {String} content
 * @param {Function} errCallback
 */
module.exports = (schema, content, errCallback) => {
    try {
        const data = vm.runInThisContext(content),
            ajv = Ajv({ allErrors: true, verbose: true, v5: true });

        ajv.validate(schema, data) || ajv.errors.forEach(error => {
            errCallback('.deps.js schema error', error);
        });

    } catch(err) {
        errCallback('Failed to parse .deps.js file', err.message);
    }
};
