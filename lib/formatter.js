'use strict';

var util = require('util');

module.exports = function(error) {

    switch (error.keyword) {
        case 'additionalProperties':
            return util.format('data%s %s (%j)', error.dataPath, error.message, error.params.additionalProperty);
        case 'enum':
            return util.format('data%s %s %j', error.dataPath, error.message, error.schema);
        default:
            return util.format('data%s %s', error.dataPath, error.message);
    }
};

