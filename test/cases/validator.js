'use strict';

const baseSchema = require('../../lib/schema.json'),
    rootWrapper = new Wrapper('root');

validateEntity(rootWrapper, true);

function validateEntity(wrapper, recursiveFlag) {

    // positive

    wrapper.it('can be a string', 'b-page');

    wrapper.it('can be an object', {});

    wrapper.it('can have "block" string field', { block: 'b-page' });

    wrapper.it('can have "mod" string field', { mod: 'color' });

    wrapper.it('can have "val" string field with "mod"', { mod: 'color', val: 'black' });

    wrapper.it('can have "val" boolean `true` field', { mod: 'color', val: true });

    wrapper.it('can have "tech" string field', { tech: 'bemhtml' });

    wrapper.it('can have "include" boolean `false` field', { include: false });

    wrapper.it('can be an empty array', []);

    wrapper.it('can be a string array', ['input', 'select']);

    wrapper.it('can be an object array', [{}]);

    // negative

    wrapper.it('can not be a number', 1234).throws({
        keyword: 'type', params: { type: 'string,object,array' }
    });

    wrapper.it('can not be a number array', [1234]).throws({
        keyword: 'type', params: { type: 'string,object' }
    });

    wrapper.it('"block" field can not be a number', { block: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.it('"mod" field can not be a number', { mod: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.it('"val" field can not be a number', { mod: 'size', val: 12 }).throws({
        keyword: 'type', params: { type: 'string,boolean' }
    });

    wrapper.it('"val" field can not be `false`', { mod: 'size', val: false }).throws({
        keyword: 'enum', schema: [true]
    });

    wrapper.it('"tech" field can not be a number', { tech: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.it('include can not be true', { include: true }).throws({
        keyword: 'enum', schema: [false]
    });

    wrapper.it('other fields are not allowed', { name: 'test' }).throws({
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
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
