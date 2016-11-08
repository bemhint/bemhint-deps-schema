'use strict';

const chai = require('chai'),
    validator = require('../lib/validator'),
    formatter = require('../lib/formatter');

chai.use(require('chai-subset'));

global.sinon = require('sinon');
global.assert = chai.assert;

sinon.assert.expose(chai.assert, {prefix: ''});

global.validate = validator;

global.checkMsgFormat = function(title, error, msg) {
    it(title, function() {
        assert.equal(formatter(error), msg);
    });
};
