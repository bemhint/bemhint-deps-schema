'use strict';

var util = require('util');

module.exports = function(error) {

    switch (error.keyword) {
        case 'required':
            return util.format('data%s should have required property (%s)', error.dataPath, error.params.missingProperty);
        case 'not':
            return util.format('data%s should NOT have property (%s)', error.dataPath, error.schema.required);
        case 'additionalProperties':
            return util.format('data%s should NOT have additional property (%s)', error.dataPath, error.params.additionalProperty);
        case 'enum':
            return util.format('data%s %s %j', error.dataPath, error.message, error.schema);
        default:
            return util.format('data%s %s', error.dataPath, error.message);
    }
};

