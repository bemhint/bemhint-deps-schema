'use strict';

const baseSchema = require('../../lib/schema.json'),
    rootWrapper = new Wrapper('root');

validateEntity(rootWrapper, true);

function validateEntity(cases, recursiveFlag) {

    // region root

    cases.it('can be a string', 'b-page');

    cases.it('can be an object', {});

    cases.it('can be an empty array', []);

    cases.it('can be a string array', ['input', 'select']);

    cases.it('can be an object array', [{}]);

    cases.it('can not be a number', 1234).throws({
        keyword: 'type', params: { type: 'string,object,array' }
    });

    cases.it('can not be a number array', [1234]).throws({
        keyword: 'type', params: { type: 'string,object' }
    });

    // endregion

    // region field 'block'

    cases.it('can have "block" string field', { block: 'b-page' });

    cases.it('"block" field can not be a number', { block: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'elem'

    cases.it('can have "elem" string field', { elem: 'spin' });

    cases.it('can have "elem" array field', { elem: [] });

    cases.it('can have "elem" string array field', { elem: ['spin', 'button'] });

    cases.it('"elem" field can not be a number', { elem: 1234 }).throws({
        keyword: 'type', params: { type: 'string,array' }
    });

    cases.it('"elem" field can not be a number array', { elem: [1234] }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'mod'

    cases.it('can have "mod" string field', { mod: 'color' });

    cases.it('"mod" field can not be a number', { mod: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'val'

    cases.it('can have "val" string field with "mod"', { mod: 'color', val: 'black' });

    cases.it('can have "val" boolean `true` field', { mod: 'color', val: true });

    cases.it('"val" field can not be a number', { mod: 'size', val: 12 }).throws({
        keyword: 'type', params: { type: 'string,boolean' }
    });

    cases.it('"val" field can not be `false`', { mod: 'size', val: false }).throws({
        keyword: 'enum', schema: [true]
    });

    cases.it('"val" field can not be without "mod"', { val: 'red' }).throws({
        keyword: 'required', params: { missingProperty: 'mod' }
    });

    // endregion

    // region field 'tech'

    cases.it('can have "tech" string field', { tech: 'bemhtml' });

    cases.it('"tech" field can not be a number', { tech: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'include'

    cases.it('can have "include" boolean `false` field', { include: false });

    cases.it('include can not be true', { include: true }).throws({
        keyword: 'enum', schema: [false]
    });

    cases.it('include can not be string', { include: 'yes' }).throws({
        keyword: 'enum', schema: [false]
    });

    // endregion

    cases.it('other fields are not allowed', { name: 'test' }).throws({
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
    });

    validateModifiers(
        cases.inner('[mods]', target => ({ mods: target }))
    );

    if (recursiveFlag) {
        validateEntity(
            cases.inner('[noDeps]', target => ({ noDeps: target }))
        );

        validateEntity(
            cases.inner('[shouldDeps]', target => ({ shouldDeps: target }))
        );

        validateEntity(
            cases.inner('[mustDeps]', target => ({ mustDeps: target }))
        );
    }
}

function validateModifiers(cases) {

    // region root

    cases.it('can be an object', {});

    cases.it('can not be a number', 1234).throws({
        keyword: 'type', params: { type: 'object' }
    });

    // endregion

    // region string value

    cases.it('can have string value', { color: 'red' });

    cases.it('can not have number value', { color: 1234 }).throws({
        keyword: 'type', params: { type: 'boolean,string,array' }
    });

    // endregion

    // region boolean value

    cases.it('can have `true` value', { color: true });

    cases.it('can not have `false` value', { color: false }).throws({
        keyword: 'enum', schema: [true]
    });

    // endregion

    // region array value

    cases.it('can have empty array value', { color: [] });

    cases.it('can have string array value', { color: ['red', 'white'] });

    cases.it('can not have number array value', { color: [1234] }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion
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
