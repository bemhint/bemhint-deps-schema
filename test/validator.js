'use strict';

var validate = require('../lib/validator');

describe('schema validator', function() {

    describe('should pass id object is', function() {

        it('empty array', function() {
            checkValidObject([]);
        });

        it('not empty array', function() {
            checkValidObject([
                { block: 'b2' },
                { block: 'b3' }
            ]);
        });

        it('empty object', function() {
            checkValidObject({});
        });

        it('not empty object', function() {
            checkValidObject({
                block: 'b-block-name',
                elem: 'elem-name',
                mod: 'mod-name',
                val: 'mod-value',
                tech  : 'techName',
                mustDeps   : [],
                shouldDeps : [],
                noDeps     : []
            });
        });
    });
});

function checkValidObject(obj) {
    var errorCallback = sinon.spy();

    validate('(' + JSON.stringify(obj) + ')', errorCallback);
    assert.notCalled(errorCallback);
}
