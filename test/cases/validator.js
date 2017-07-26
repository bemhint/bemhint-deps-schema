'use strict';

const baseSchema = require('../../lib/schema.json'),
    rootWrapper = new Wrapper('root');

validateEntity(rootWrapper, true);

function validateEntity(cases, recursiveFlag) {

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

    validateEntityFields(cases, recursiveFlag);

    validateEntityFields(
        cases.inner('[0]', target => [target]),
        recursiveFlag
    );
}

function validateEntityFields(cases, recursiveFlag) {

    // region field 'block'

    cases.it('can have `block` string field', { block: 'b-page' });

    cases.it('`block` field can not be a number', { block: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'elem'

    cases.it('can have `elem` string field', { elem: 'spin' });

    cases.it('can have `elem` array field', { elem: [] });

    cases.it('can have `elem` string array field', { elem: ['spin', 'button'] });

    cases.it('`elem` field can not be a number', { elem: 1234 }).throws({
        keyword: 'type', params: { type: 'string,array' }
    });

    cases.it('`elem` field can not be a number array', { elem: [1234] }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'mod'

    cases.it('can have `mod` string field', { mod: 'color' });

    cases.it('`mod` field can not be a number', { mod: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'val'

    cases.it('can have `val` string field with `mod`', { mod: 'color', val: 'black' });

    cases.it('can have `val` boolean `true` field', { mod: 'color', val: true });

    cases.it('`val` field can not be a number', { mod: 'size', val: 12 }).throws({
        keyword: 'type', params: { type: 'string,boolean' }
    });

    cases.it('`val` field can not be `false`', { mod: 'size', val: false }).throws({
        keyword: 'enum', schema: [true]
    });

    cases.it('`val` field can not be without `mod`', { val: 'red' }).throws({
        keyword: 'required', params: { missingProperty: 'mod' }
    });

    // endregion

    // region field 'tech'

    cases.it('can have `tech` string field', { tech: 'bemhtml' });

    cases.it('`tech` field can not be a number', { tech: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'include'

    cases.it('can have `include` boolean `false` field', { include: false });

    cases.it('include can not be true', { include: true }).throws({
        keyword: 'enum', schema: [false]
    });

    cases.it('include can not be string', { include: 'yes' }).throws({
        keyword: 'enum', schema: [false]
    });

    // endregion

    cases.it('can have `mod` and `mods` fields', { mod: 'color', mods: {} });

    cases.it('can have `elem` and `elems` fields', { elem: 'header', elems: [] });

    validateModifiers(
        cases.inner('[mods]', target => ({ mods: target }))
    );

    validateElements(
        cases.inner('[elems]', target => ({ elems: target })),
        recursiveFlag
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

    cases.it('other fields are not allowed', { name: 'test' }).throws({
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
    });
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

function validateElements(cases, recursiveFlag) {

    cases.it('can be a string', 'header');

    cases.it('can be elem-object', { elem: 'header' });

    cases.it('can be an empty array', []);

    cases.it('can be a string array', ['header', 'footer']);

    cases.it('can be elem-object array', [{ elem: 'header' }]);

    cases.it('can not be a number', 1234).throws({
        keyword: 'type', params: { type: 'string,object,array' }
    });

    cases.it('can not be a number array', [1234]).throws({
        keyword: 'type', params: { type: 'string,object' }
    });

    validateElementFields(cases, recursiveFlag);

    validateElementFields(
        cases.inner('[0]', target => [target]),
        recursiveFlag
    );
}

function validateElementFields(cases, recursiveFlag) {

    // region field 'elem'

    cases.it('can have `elem` string field', { elem: 'spin' });

    cases.it('can have `elem` array field', { elem: [] });

    cases.it('can have `elem` string array field', { elem: ['spin', 'button'] });

    cases.it('`elem` field can not be a number', { elem: 1234 }).throws({
        keyword: 'type', params: { type: 'string,array' }
    });

    cases.it('`elem` field can not be a number array', { elem: [1234] }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    cases.it('`elem` field is required', {}).throws({
        keyword: 'required', params: { missingProperty: 'elem' }
    });

    // endregion

    // region field 'mod'

    cases.it('can have `mod` string field', { elem: 'header', mod: 'color' });

    cases.it('`mod` field can not be a number', { elem: 'header', mod: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'val'

    cases.it('can have `val` string field with `mod`', { elem: 'header', mod: 'color', val: 'black' });

    cases.it('can have `val` boolean `true` field', { elem: 'header', mod: 'color', val: true });

    cases.it('`val` field can not be a number', { elem: 'header', mod: 'size', val: 12 }).throws({
        keyword: 'type', params: { type: 'string,boolean' }
    });

    cases.it('`val` field can not be `false`', { elem: 'header', mod: 'size', val: false }).throws({
        keyword: 'enum', schema: [true]
    });

    cases.it('`val` field can not be without `mod`', { elem: 'header', val: 'red' }).throws({
        keyword: 'required', params: { missingProperty: 'mod' }
    });

    // endregion

    // region field 'tech'

    cases.it('can have `tech` string field', { elem: 'header', tech: 'bemhtml' });

    cases.it('`tech` field can not be a number', { elem: 'header', tech: 1234 }).throws({
        keyword: 'type', params: { type: 'string' }
    });

    // endregion

    // region field 'include'

    cases.it('can have `include` boolean `false` field', { elem: 'header', include: false });

    cases.it('include can not be true', { elem: 'header', include: true }).throws({
        keyword: 'enum', schema: [false]
    });

    cases.it('include can not be string', { elem: 'header', include: 'yes' }).throws({
        keyword: 'enum', schema: [false]
    });

    // endregion

    cases.it('can have `mod` and `mods` fields', { elem: 'header', mod: 'color', mods: {} });

    validateModifiers(
        cases.inner('[mods]', target => ({ elem: 'header', mods: target }))
    );

    if (recursiveFlag) {
        validateEntity(
            cases.inner('[noDeps]', target => ({ elem: 'header', noDeps: target }))
        );

        validateEntity(
            cases.inner('[shouldDeps]', target => ({ elem: 'header', shouldDeps: target }))
        );

        validateEntity(
            cases.inner('[mustDeps]', target => ({ elem: 'header', mustDeps: target }))
        );
    }

    cases.it('other fields are not allowed', { elem: 'header', name: 'test' }).throws({
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
    });
}

const testCases = rootWrapper.getCases();

dump('testcases.json', testCases);

describe('base-schema', () => {

    testCases.forEach(data => {
        it(data.title, () => {
            const errorCallback = sinon.spy();

            validate(baseSchema, data.obj, errorCallback);

            if (data.error) {
                assert.calledOnce(errorCallback);
                assert.containSubset(errorCallback.getCall(0).args[1], data.error);
            } else {
                assert.notCalled(errorCallback);
            }
        });
    });
});
