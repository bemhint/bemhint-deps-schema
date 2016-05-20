'use strict';

var util = require('util');

module.exports = function(error) {

    return error.keyword === 'additionalProperties'
        ? util.format('data%s %s (\'%s\')', error.dataPath, error.message, error.params.additionalProperty)
        : util.format('data%s %s', error.dataPath, error.message);
};

