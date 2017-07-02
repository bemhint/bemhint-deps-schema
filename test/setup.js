'use strict';

const fs = require('fs'),
    chai = require('chai'),
    validator = require('../lib/validator'),
    formatter = require('../lib/formatter');

chai.use(require('chai-subset'));

global.sinon = require('sinon');
global.assert = chai.assert;

sinon.assert.expose(chai.assert, {prefix: ''});

global.validate = validator;

global.Wrapper = require('./wrapper');

global.checkMsgFormat = (title, error, msg) => {
    it(title, function() {
        assert.equal(formatter(error), msg);
    });
};

global.dump = (fileName, jsonData) => {
    fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 4));
};
