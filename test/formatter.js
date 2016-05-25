describe('formatter', function() {

    checkMsgFormat('enum', {
        keyword: 'enum',
        dataPath: '.include',
        params: {},
        message: 'should be equal to one of the allowed values',
        schema: [false, 'test']
    }, 'data.include should be equal to one of the allowed values [false,"test"]');
});
