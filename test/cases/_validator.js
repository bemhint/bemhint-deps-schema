'use strict';

const baseSchema = require('../../lib/schema.json'),
    testCases = buildTestCases();

// dump('testcases.json', testCases);
//
// describe('_base-schema', () => {
//
//     testCases.forEach(data => {
//         it(data.title, () => {
//             const content = '(' + JSON.stringify(data.obj) + ')',
//                 errorCallback = sinon.spy();
//
//             validate(baseSchema, content, errorCallback);
//
//             if (data.error) {
//                 assert.calledOnce(errorCallback);
//                 assert.containSubset(errorCallback.getCall(0).args[1], data.error);
//             } else {
//                 assert.notCalled(errorCallback);
//             }
//         });
//     });
//
// });

function buildTestCases() {
    const wrapper = new Wrapper('root');

    validateSet(wrapper, true);

    return wrapper.getCases();
}

function validateSet(wrapper, recursiveFlag) {

    // positive

    wrapper.addCase('can be a string', 'b-page');

    wrapper.addCase('can be a string array', ['input', 'select']);

    // negative

    wrapper.addCase('can not be a number', 1234, {
        keyword: 'type', params: { type: 'string,object,array' }
    });

    wrapper.addCase('can not be a number array', [1234], {
        keyword: 'type', params: { type: 'string,object' }
    });

    wrapper.addCase('can not be an empty array', [], {
        keyword: 'minItems', params: { limit: 1 }
    });

    // inner

    if (recursiveFlag) {
        validateEntity(wrapper.createInnerWrapper('single item'), recursiveFlag);

        validateEntity(wrapper.createInnerWrapper('array item', obj => [obj]), recursiveFlag);

        validateEntity(wrapper.createInnerWrapper('mixed array item', obj => ['input', obj]), recursiveFlag);
    }
}

function validateEntity(wrapper, recursiveFlag){

    // positive

    wrapper.addCase('can have "block" string field', { block: 'b-page' });

    // negative

    wrapper.addCase('can not be an empty object', {}, {
        keyword: 'minProperties', params: { limit: 1 }
    });

    wrapper.addCase('other fields are not allowed', { name: 'test' }, {
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
    });

    wrapper.addCase('"block" field can not be a number', { block: 1234 }, {
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.addCase('can not have "elem" and "elems" fields', { elem: 'test', elems: 'test' }, {
        keyword: 'not', schema: { required: ['elems'] }
    });

    // inner

    validateTechAndInclude(wrapper);

    validateElemPlainEntity(
        wrapper.createInnerWrapper('elem value', plain => ({ elem: plain }))
    );

    validateElements(
        wrapper.createInnerWrapper('elems value', elems => ({ elems: elems }))
    );

    validateModifiers(wrapper);

    if (recursiveFlag) {
        validateSet(
            wrapper.createInnerWrapper('noDeps value', set => ({ noDeps: set }))
        );

        validateSet(
            wrapper.createInnerWrapper('mustDeps value', set => ({ mustDeps: set }))
        );

        validateSet(
            wrapper.createInnerWrapper('shouldDeps value', set => ({ shouldDeps: set }))
        );
    }
}

function validateElemPlainEntity(wrapper) {

    // positive

    wrapper.addCase('can be a string', 'spin');

    wrapper.addCase('can be a string array', ['spin', 'button']);

    // negative

    wrapper.addCase('can not be an object', { elem: 'spin' }, {
        keyword: 'type', params: { type: 'string,array' }
    });

    wrapper.addCase('can not be an empty array', [], {
        keyword: 'minItems', params: { limit: 1 }
    });
}

function validateElements(wrapper) {

    // positive

    wrapper.addCase('can be a string', 'spin');

    wrapper.addCase('can be a string array', ['spin', 'button']);

    // negative

    wrapper.addCase('can not be a number', 1234, {
        keyword: 'type', params: { type: 'string,object,array' }
    });

    wrapper.addCase('can not be a number array', [1234], {
        keyword: 'type', params: { type: 'string,object' }
    });

    wrapper.addCase('can not be an empty array', [], {
        keyword: 'minItems', params: { limit: 1 }
    });

    // inner

    validateElemEntity(wrapper.createInnerWrapper('single item'));

    validateElemEntity(wrapper.createInnerWrapper('array item', elem => [elem]));

    validateElemEntity(wrapper.createInnerWrapper('mixed array item', elem => ['spin', elem]));
}

function validateElemEntity(wrapper) {

    // positive

    wrapper.addCase('can have "elem" string field', { elem: 'button' });

    // negative

    wrapper.addCase('can not be an empty object', {}, {
        keyword: 'required', params: { missingProperty: 'elem' }
    });

    wrapper.addCase('other fields are not allowed', { elem: 'key', name: 'test' }, {
        keyword: 'additionalProperties', params: { additionalProperty: 'name' }
    });

    // inner

    validateTechAndInclude(
        wrapper.createInnerWrapper('', extra => Object.assign({ elem: 'button' }, extra))
    );

    validateElemPlainEntity(
        wrapper.createInnerWrapper('elem value', plain => ({ elem: plain }))
    );

    validateModifiers(
        wrapper.createInnerWrapper('', extra => Object.assign({ elem: 'button' }, extra))
    );

    validateSet(
        wrapper.createInnerWrapper('noDeps value', set => ({ elem: 'key', noDeps: set }))
    );

    validateSet(
        wrapper.createInnerWrapper('mustDeps value', set => ({ elem: 'key', mustDeps: set }))
    );

    validateSet(
        wrapper.createInnerWrapper('shouldDeps value', set => ({ elem: 'key', shouldDeps: set }))
    );
}

function validateModifiers(wrapper) {

    // positive

    wrapper.addCase('can have "mod" string field', { mod: 'color' });

    wrapper.addCase('can have "val" string field with "mod"', { mod: 'color', val: 'black' });

    wrapper.addCase('can have "val" boolean `true` field', { mod: 'color', val: true });

    // negative

    wrapper.addCase('"mod" field can not be a number', { mod: 1234 }, {
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.addCase('"val" field can not be a number', { mod: 'size', val: 12 }, {
        keyword: 'type', params: { type: 'string,boolean' }
    });

    wrapper.addCase('"val" field can not be `false`', { mod: 'size', val: false }, {
        keyword: 'enum', schema: [true]
    });

    wrapper.addCase('can not have "val" without "mod" fields', { val: 'red' }, {
        keyword: 'required', schema: ['mod']
    });

    wrapper.addCase('can not have "mod" and "mods" fields', { mod: 'color', mods: { size: 's' } }, {
        keyword: 'not', schema: { required: ['mods'] }
    });

    // inner

    validateHashModifiers(
        wrapper.createInnerWrapper('mods value', mods => ({ mods: mods }))
    );
}

function validateHashModifiers(wrapper) {

    // positive

    wrapper.addCase('can have string value', { color: 'red' });

    wrapper.addCase('can have `true` value', { color: true });

    wrapper.addCase('can have string array value', { color: ['red', 'white'] });

    // negative

    wrapper.addCase('can not be an empty object', {}, {
        keyword: 'minProperties', params: { limit: 1 }
    });

    wrapper.addCase('can not be a number', 1234, {
        keyword: 'type', params: { type: 'object' }
    });

    wrapper.addCase('can not have `false` value', { color: false }, {
        keyword: 'enum', schema: [true]
    });

    wrapper.addCase('can not have number value', { size: 1234 }, {
        keyword: 'type', params: { type: 'boolean,string,array' }
    });

    wrapper.addCase('can not have number in array value', { size: [1234, 'small'] }, {
        keyword: 'type', params: { type: 'string' }
    });
}

function validateTechAndInclude(wrapper) {

    // positive

    wrapper.addCase('can have "tech" string field', { tech: 'bemhtml' });

    wrapper.addCase('can have "include" boolean `false` field', { include: false });

    // negative

    wrapper.addCase('"tech" field can not be a number', { tech: 1234 }, {
        keyword: 'type', params: { type: 'string' }
    });

    wrapper.addCase('include can not be a string', { include: 'yes' }, {
        keyword: 'enum', schema: [false]
    });

    wrapper.addCase('include can not be true', { include: true }, {
        keyword: 'enum', schema: [false]
    });
}
