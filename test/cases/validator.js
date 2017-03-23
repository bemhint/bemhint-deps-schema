'use strict';

const baseSchema = require('../../lib/schema.json'),
    rootWrapper = new Wrapper('root');

validateEntity(rootWrapper, true);

function validateEntity(wrapper, recursiveFlag) {

    // positive

    wrapper.addCase('can be a string', 'b-page');

    wrapper.addCase('can be an object', {});

    // wrapper.addCase('can be a string array', ['input', 'select']);
    //
    // // negative
    //
    // wrapper.addCase('can not be a number', 1234, {
    //     keyword: 'type', params: { type: 'string,object,array' }
    // });
    //
    // wrapper.addCase('can not be a number array', [1234], {
    //     keyword: 'type', params: { type: 'string,object' }
    // });
    //
    // wrapper.addCase('can not be an empty array', [], {
    //     keyword: 'minItems', params: { limit: 1 }
    // });
    //
    // // inner
    //
    // if (recursiveFlag) {
    //     validateEntity(wrapper.createInnerWrapper('single item'), recursiveFlag);
    //
    //     validateEntity(wrapper.createInnerWrapper('array item', obj => [obj]), recursiveFlag);
    //
    //     validateEntity(wrapper.createInnerWrapper('mixed array item', obj => ['input', obj]), recursiveFlag);
    // }
}

const testCases = rootWrapper.getCases();

dump('testcases.json', testCases);

describe.only('base-schema', () => {

    testCases.forEach(data => {
        it(data.title, () => {
            const content = '(' + JSON.stringify(data.obj) + ')',
                errorCallback = sinon.spy();

            validate(baseSchema, content, errorCallback);

            if (data.error) {
                assert.calledOnce(errorCallback);
                assert.containSubset(errorCallback.getCall(0).args[1], data.error);
            } else {
                assert.notCalled(errorCallback);
            }
        });
    });
});
