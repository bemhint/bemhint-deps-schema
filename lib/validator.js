'use strict';

const vm = require('vm'),
    Ajv = require('ajv'),
    schema = require('./schema.json');

module.exports = (content, errCallback) => {
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
