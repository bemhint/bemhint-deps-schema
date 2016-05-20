'use strict';

describe('schema validator', function() {

    describe('- root', function() {

        checkValidObject('can be an array', [
            { block: 'b-block-name'},
            { block: 'b-block-name', elem: 'form' }
        ]);

        checkValidObject('can be an object', { block: 'b-page'});
    });

    describe('- entity', function() {
        checkValidObject('can have plane fields', {
            block: 'bBlock',
            elem: 'elem',
            mod: 'modName',
            val: 'modValue',
            tech: 'techName'
        });

        checkValidObject('can be empty', {});

        checkValidObject('deps fields can be arrays', {
            mustDeps: [{ block : 'b2' }],
            shouldDeps: [{ block : 'b2' }],
            noDeps: [{ block : 'b2' }]
        });

        checkValidObject('deps fields can be objects', {
            mustDeps: { block : 'b2' },
            shouldDeps: { block : 'b2' },
            noDeps: { block : 'b2' }
        });

        checkInvalidObject('block can not be a number', { block: 123 }, 'type', { type: 'string' });
        checkInvalidObject('elem can not be a number', { elem: 123 }, 'type', { type: 'string' });
        checkInvalidObject('mod can not be a number', { mod: 123 }, 'type', { type: 'string' });
        checkInvalidObject('val can not be a number', { val: 123 }, 'type', { type: 'string' });
        checkInvalidObject('tech can not be a number', { tech: 123 }, 'type', { type: 'string' });

        checkInvalidObject('mustDeps can not be a number', { mustDeps: 123 }, 'type', { type: 'object,array' });
        checkInvalidObject('shouldDeps can not be a number', { shouldDeps: 123 }, 'type', { type: 'object,array' });
        checkInvalidObject('noDeps can not be a number', { noDeps: 123 }, 'type', { type: 'object,array' });

        checkInvalidObject('other fields are not allowed',
            { wegwrgw: 'qwefweg' }, 'additionalProperties', { additionalProperty: 'wegwrgw' });
    });

    describe('- dependency', function() {

        checkValidObject('can have plane fields', {
            mustDeps: {
                tech: 'bemhtml',
                block: 'b1',
                elem: 'el1'
            }
        });

        checkValidObject('can be empty', {});

        checkInvalidObject('block can not be a number', { mustDeps: { block: 1234 } }, 'type', { type: 'string' });
        checkInvalidObject('elem can not be a number', { mustDeps: { elem: 1234 } }, 'type', { type: 'string' });
        checkInvalidObject('tech can not be a number', { mustDeps: { tech: 1234 } }, 'type', { type: 'string' });
    });

    describe('- mods', function() {

        checkValidObject('must be an object', {});

        checkValidObject('values must be strings', {
            mustDeps: {
                mods: { asd: 'qwfeg', wger: 'eet'}
            }
        });

        checkValidObject('values must be boolean', {
            mustDeps: {
                mods: { asd: true, wger: false }
            }
        });

        checkInvalidObject('mods can not be a number', { mustDeps: { mods: 1234 } }, 'type', { type: 'object' });

        checkInvalidObject('values can not be a number',
            { mustDeps: { mods: { asd: 12345 } } }, 'type', { type: 'string,boolean' });
    });

    describe('- elems', function() {

        checkValidObject('can be an array', {
           mustDeps: {
               elems: []
           }
        });

        checkInvalidObject('can not be an object', { mustDeps: { elems: { elem: 'test' } } }, 'type', { type: 'array' });
    });

    describe('- elems item', function() {

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
