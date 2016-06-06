'use strict';

function validateEntity(wrapper) {
    !wrapper && (wrapper = function(obj) { return obj; });

    // simple root
    checkValidObject('can be a string', wrapper(''));

    checkValidObject('can be an object', wrapper({ block: 'b-page'}));

    checkInvalidObject('can not be a number', wrapper(1234), 'type', { type: 'string,object,array' });

    // array
    checkValidObject('can be a string array', wrapper(['input', 'select']));

    checkValidObject('can be an object array', wrapper([{ block: 'b-block-name', elem: 'form' }]));

    checkInvalidObject('can not be a number array', wrapper([123]), 'type', { type: 'string,object' });


    describe('- item', function() {

        checkValidObject('can be empty', {});

        // block
        checkValidObject('can have "block" field (string)', wrapper({ block: 'bBlock' }));

        checkInvalidObject('"block" field can not be a number', wrapper({ block: 1234 }), 'type', { type: 'string' });

        // mod
        checkValidObject('can have "mod" field (string)', wrapper({ mod: 'modifier' }));

        checkInvalidObject('"mod" field can not be a number', wrapper({ mod: 1234 }), 'type', { type: 'string' });

        // val
        checkValidObject('can have "val" field (string)', wrapper({ mod: 'modifier', val: 'value1' }));

        checkValidObject('can have "val" field (boolean)', wrapper({ mod: 'modifier', val: true }));

        checkInvalidObject('"val" field can not be a number', wrapper({ mod: 'xxx', val: 12 }), 'type', { type: 'string,boolean' });

        checkInvalidObject('can not comtains "val" field without "mod" field', wrapper({ val: 'value' }), 'required', { missingProperty: 'mod' });

        // mods
        checkValidObject('"mods" must be an object', { mods: { }});

        checkInvalidObject('"mods" can not be a number', { mods: 1234 }, 'type', { type: 'object' });

        checkValidObject('"mods" values can be a boolean', { mods: { asd: true } });

        checkValidObject('"mods" values can be a string', { mods: { asd: 'qwfeg' } });

        checkInvalidObject('"mods" values can not be a number', { mods: { asd: 12345 } }, 'type', { type: 'string,boolean,array' });

        checkValidObject('"mods" values can be string array', { mods: { asd: ['qwf', 'qwdqwf'] } });

        checkInvalidObject('"mods" values can not be a number array', { mods: { asd: [134] } }, 'type', { type: 'string' });

        checkInvalidObject('can not has "mod" and "mods" fields both', { mod: 'test', mods: {} }, 'not', { });

        // tech
        checkValidObject('can have "tech" field (string)', wrapper({ tech: 'bemhtml' }));

        checkInvalidObject('"tech" field can not be a number', wrapper({ tech: 1234 }), 'type', { type: 'string' });

        // include
        checkValidObject('can have "include" field (false)', wrapper({ include: false }));

        checkInvalidObject('include can not be a string', wrapper({ include: 'yes' }), 'enum', { });

        checkInvalidObject('include can not be true', wrapper({ include: true }), 'enum', { });

        // other fields
        checkInvalidObject('other fields are not allowed', wrapper({ xxx: 'test' }), 'additionalProperties', { additionalProperty: 'xxx' });
    });
}


describe('schema', function() {

    describe('- root', function() {
        validateEntity(); // single
    });

    describe('- mustDeps', function() {
        validateEntity(function(obj) { return { mustDeps: obj } });
    });

    describe('- shouldDeps', function() {
        validateEntity(function(obj) { return { shouldDeps: obj } });
    });

    describe('- noDeps', function() {
        validateEntity(function(obj) { return { noDeps: obj } });
    });

    describe.skip('- dependency', function() {

        checkValidObject('can have plane fields', {
            mustDeps: {
                tech: 'bemhtml',
                block: 'b1',
                elem: 'el1'
            }
        });

        checkValidObject('elem can be string array', {
            mustDeps: {
                elem: ['qwf', 'qwdqwf']
            }
        });

        checkValidObject('can be empty', {});

        checkInvalidObject('block can not be a number', { mustDeps: { block: 1234 } }, 'type', { type: 'string' });
        checkInvalidObject('elem can not be a number', { mustDeps: { elem: 1234 } }, 'type', { type: 'string,array' });
        checkInvalidObject('tech can not be a number', { mustDeps: { tech: 1234 } }, 'type', { type: 'string' });

        checkInvalidObject('elem can not be a number array', { mustDeps: { elem: [1234] } }, 'type', { type: 'string' });
    });

    describe.skip('- elems', function() {

        checkValidObject('can be an array', {
           mustDeps: {
               elems: []
           }
        });

        checkValidObject('can be an object', { mustDeps: { elems: { elem: 'test' } } });
        checkValidObject('can be a string', { mustDeps: { elems: "test" } });
    });

    describe.skip('- elems item', function() {

        checkValidObject('can be a string', {
           mustDeps: {
               elems: ['el1', 'el2']
           }
        });

        checkValidObject('can be an object', {
           mustDeps: {
               elems: [{ elem: 'el1' }, { elem: 'el2' }]
           }
        });

        checkInvalidObject('can not be a number', { mustDeps: { elems: [125] } }, 'type', { type: 'string,object' });

        checkInvalidObject('must have elem name',  { mustDeps: { elems: [{ }] } }, 'required', { missingProperty: 'elem' });

        checkValidObject('can have mods', {
           mustDeps: {
               elems: [{ elem: 'el1', mods: { asd: 'qwfeg', wger: 'eet'} }]
           }
        });
    });
});
