'use strict';

const vm = require('vm'),
    Ajv = require('ajv');

/**
 * Validates content with json-schema in async way
 *
 * @param {Object} schema
 * @param {*} value
 * @param {Function} errCallback
 */
module.exports = (schema, value, errCallback) => {
    try {
        const ajv = Ajv({ allErrors: true, verbose: true, v5: true });

        ajv.validate(schema, value) || ajv.errors.forEach(error => {
            errCallback('.deps.js schema error', error);
        });

    } catch(err) {
        errCallback('Failed to parse .deps.js file', err.message);
    }
};
