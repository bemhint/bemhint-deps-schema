'use strict';

const vm = require('vm'),
    Ajv = require('ajv');

/**
 * Validates content with json-schema in async way
 *
 * @param {Object} tech
 * @param {Object} schema
 * @param {Function} errCallback
 */
module.exports = (tech, schema, errCallback) => {
    try {
        const data = vm.runInThisContext(tech.content),
            ajv = Ajv({ allErrors: true, verbose: true, v5: true });

        ajv.validate(schema, data) || ajv.errors.forEach(error => {
            errCallback(`.${tech.name} schema error`, error);
        });

    } catch(err) {
        errCallback(`Failed to parse .${tech.name} file`, err.message);
    }
};
