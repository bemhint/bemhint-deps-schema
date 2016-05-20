'use strict';

var util = require('util');

module.exports = function(error) {

    return util.format('deps%s %s', error.dataPath, error.message); //+ JSON.stringify(error);
};

