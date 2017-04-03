'use strict';

const vm = require('vm'),
    Ajv = require('ajv');

/**
 * Validates content with json-schema in async way
 *
 * @param {Object} baseSchema - base deps.js-schema
 * @param {Object} [customSchema] - custom deps.js-schema for code style reasons
 * @param {String} content
 * @param {Function} errCallback
 */
module.exports = (baseSchema, customSchema, content, errCallback) => {
    try {
        const data = vm.runInThisContext(content),
            ajv = Ajv({ allErrors: true, verbose: true, v5: true }),
            isValid = ajv.validate(baseSchema, data) &&
                (typeof customSchema === 'undefined' || ajv.validate(customSchema, data));

        isValid || ajv.errors.forEach(error => {
            errCallback('.deps.js schema error', error);
        });

    } catch(err) {
        errCallback('Failed to parse .deps.js file', err.message);
    }
};
