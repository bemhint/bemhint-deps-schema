'use strict';

var vm = require('vm'),
    Ajv = require('ajv'),
    schema = require('./schema2.json');

module.exports = function(content, errCallback) {
    var data, isValid,
        ajv = Ajv({ allErrors: true, verbose: true });

    try {

        data = vm.runInThisContext(content);

        isValid = ajv.validate(schema, data);

        !isValid && ajv.errors.forEach(function(error) {
            errCallback('.deps.js schema error', error);
        }, this);

    } catch(err) {
        errCallback('Failed to parse .deps.js file', err.message);
    }
};
