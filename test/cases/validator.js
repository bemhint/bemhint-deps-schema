'use strict';

const baseSchema = require('../../lib/schema.json'),
    rootWrapper = new Wrapper('root');

validateEntity(rootWrapper, true);

function validateEntity(wrapper, recursiveFlag) {

    // positive

    wrapper.addCase('can be a string', 'b-page');

    wrapper.addCase('can be an object', {});

    wrapper.addCase('can have "block" string field', { block: 'b-page' });

    wrapper.addCase('can have "tech" string field', { tech: 'bemhtml' });

    wrapper.addCase('can have "include" boolean `false` field', { include: false });

    wrapper.addCase('can be an empty array', []);

    wrapper.addCase('can be a string array', ['input', 'select']);

    wrapper.addCase('can be an object array', [{}]);

    // negative

    wrapper.addCase('can not be a number', 1234, {
        keyword: 'type', params: { type: 'string,object,array' }
    });

    wrapper.addCase('can not be a number array', [1234], {
        keyword: 'type', params: { type: 'string,object' }
    });

    wrapper.addCase('other fields are not allowed', { name: 'test' }, {
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
    });

    wrapper.addCase('"block" field can not be a number', { block: 1234 }, {
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.addCase('"tech" field can not be a number', { tech: 1234 }, {
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.addCase('include can not be true', { include: true }, {
        keyword: 'enum', schema: [false]
    });
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
