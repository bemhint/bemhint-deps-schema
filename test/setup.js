'use strict';

var chai = require('chai'),
    validator = require('../lib/validator'),
    formatter = require('../lib/formatter');

chai.use(require('chai-subset'));

global.sinon = require('sinon');
global.assert = chai.assert;

sinon.assert.expose(chai.assert, {prefix: ''});

global.validate = validator;

global.checkValidObject = function(title, obj) {
    var fullTitle = title + ': YES',
        content = '(' + JSON.stringify(obj) + ')';

    it(fullTitle, function() {
        var errorCallback = sinon.spy();

        validate(content, errorCallback);
        assert.notCalled(errorCallback);
    });
};

global.checkInvalidObject = function(title, obj, errorType, params, showError) {
    var fullTitle = title + ': NO',
        content = '(' + JSON.stringify(obj) + ')';

    it(fullTitle, function() {
        var errorCallback = sinon.spy(),
            arg1;

        validate(content, errorCallback);

        assert.calledOnce(errorCallback);
        arg1 = errorCallback.getCall(0).args[1];

        showError && console.log(JSON.stringify(arg1));
        assert.strictEqual(arg1.keyword, errorType);
        assert.deepEqual(arg1.params, params);
    });
}

global.checkMsgFormat = function(title, error, msg) {
    it(title, function() {
        assert.equal(formatter(error), msg);
    });
};
