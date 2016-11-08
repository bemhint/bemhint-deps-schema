'use strict';

describe('formatter', () => {

    checkMsgFormat('enum', {
            keyword: 'enum',
            dataPath: '.include',
            message: 'should be equal to one of the allowed values',
            schema: [false, 'test']
        }, 'data.include should be equal to one of the allowed values [false,"test"]');

    checkMsgFormat('type', {
            keyword: 'type',
            dataPath: '.xxx',
            message: 'should be string,boolean,array'
        }, 'data.xxx should be string,boolean,array');

    checkMsgFormat('additionalProperties', {
            keyword: 'additionalProperties',
            dataPath: '.test',
            params: { additionalProperty: 'test2' }
        }, 'data.test should NOT have additional property (test2)');

    checkMsgFormat('not', {
            keyword: 'not',
            dataPath: '.test3',
            schema: { required: ['test4'] }
        }, 'data.test3 should NOT have property (test4)');

    checkMsgFormat('required', {
            keyword: 'required',
            dataPath: '.test5',
            params: { missingProperty: 'test6' }
        }, 'data.test5 should have required property (test6)');
});
