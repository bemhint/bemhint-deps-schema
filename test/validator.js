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
    });

    describe('- dependency', function() {

        checkValidObject('can have plane fields', {
            mustDeps: {
                tech: 'bemhtml',
                block: 'b1',
                elem: 'el1',
                elems: []
            }
        });

        checkValidObject('can be empty', {});
    });

    describe('- mods', function() {

        checkValidObject('must be an object', {});

        checkValidObject('values must be strings', {
            mustDeps: {
                mods: { asd: 'qwfeg', wger: 'eet'}
            }
        });
    });

    describe('- elems', function() {

        checkValidObject('can be an array', {
           mustDeps: {
               elems: []
           }
        });

        checkInvalidObject( 'can not be an object', { mustDeps: { elems: { elem: 'test' } } }, 'type', { type: 'array' });
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

        checkInvalidObject('must have elem name',  { mustDeps: { elems: [{ }] } }, 'required', { missingProperty: 'elem' });

        checkValidObject('can have mods', {
           mustDeps: {
               elems: [{ elem: 'el1', mods: { asd: 'qwfeg', wger: 'eet'} }]
           }
        });
    });
});
