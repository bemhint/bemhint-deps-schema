

function Wrapper(title, cases, fn) {
    this.title = title;
    this.cases = cases;
    this.fn = this.normalizeFn(fn);
}

Wrapper.prototype.addCase = function(title, obj, error) {
    this.cases.push({
        title: this.formatTitle(title),
        obj: this.fn(obj),
        error: error
    });
};

Wrapper.prototype.normalizeFn = function(fn) {
    return fn || function(obj) { return obj; };
};

Wrapper.prototype.formatTitle = function(subtitle) {
    return subtitle ? this.title + ': ' + subtitle : this.title;
};

Wrapper.prototype.createInnerWrapper = function(){
    var args = [].slice.call(arguments),
        fn2 = this.normalizeFn(args.pop()),
        title2 = args.pop(),
        fn = this.fn,
        title = this.formatTitle(title2);

    return new Wrapper(title, this.cases, function(obj) { return fn(fn2(obj)); });
};


function validateEntity(wrapper){

    // simple root
    wrapper.addCase('can be a string', '');

    wrapper.addCase('can be an object', { block: 'b-page'});

    wrapper.addCase('can not be a number', 1234, { keyword: 'type', params: { type: 'string,object,array' } });

    // array
    wrapper.addCase('can be a string array', ['input', 'select']);

    wrapper.addCase('can be an object array', [{ block: 'b-block-name' }]);

    wrapper.addCase('can not be a number array', [1234], { keyword: 'type', params: { type: 'string,object' } });

    validateEntityFields(wrapper.createInnerWrapper());

    validateModifiers(wrapper.createInnerWrapper());

    // other fields
    wrapper.addCase('other fields are not allowed', { xxx: 'test' }, { keyword: 'additionalProperties', params: { additionalProperty: 'xxx' }});
}

function validateEntityFields(wrapper) {

    wrapper.addCase('can be empty object', { });

    // block
    wrapper.addCase('can have "block" field (string)', { block: 'bBlock' });

    wrapper.addCase('"block" field can not be a number', { block: 1234 }, { keyword: 'type', params: { type: 'string' } });

    // mod
    wrapper.addCase('can have "mod" field (string)', { mod: 'modifier' });

    wrapper.addCase('"mod" field can not be a number', { mod: 1234 }, { keyword: 'type', params: { type: 'string' } });

    // val
    wrapper.addCase('can have "val" field (string)', { mod: 'm1', val: 'v1' });

    wrapper.addCase('can have "val" field (boolean)', { mod: 'm2', val: true });

    wrapper.addCase('"val" field can not be a number', { mod: 'xxx', val: 12 }, { keyword: 'type', params: { type: 'string,boolean' } });

    wrapper.addCase('can not contains "val" field without "mod" field', { val: 'value' }, { keyword: 'required', params: { missingProperty: 'mod' } });


    // tech
    wrapper.addCase('can have "tech" field (string)', { tech: 'bemhtml' });

    wrapper.addCase('"tech" field can not be a number', { tech: 1234 }, { keyword: 'type', params: { type: 'string' } });

    // include
    wrapper.addCase('can have "include" field (false)', { include: false });

    wrapper.addCase('include can not be a string', { include: 'yes' }, { keyword: 'enum', schema: [false] });

    wrapper.addCase('include can not be true', { include: true }, { keyword: 'enum', schema: [false] });
}

function validateModifiers(wrapper) {

    // todo: move mods field into wrapper

    // mods
    wrapper.addCase('"mods" must be an object', { mods: { }});

    wrapper.addCase('"mods" can not be a number', { mods: 1234 }, { keyword: 'type', params: { type: 'object' } });

    wrapper.addCase('"mods" values can be a boolean', { mods: { asd: true } });

    wrapper.addCase('"mods" values can be a string', { mods: { asd: 'qwfeg' } });

    wrapper.addCase('"mods" values can not be a number', { mods: { asd: 12345 } }, { keyword: 'type', params: { type: 'string,boolean,array' } });

    wrapper.addCase('"mods" values can be string array', { mods: { asd: ['qwf', 'qwdqwf'] } });

    wrapper.addCase('"mods" values can not be a number array', { mods: { asd: [134] } }, { keyword: 'type', params: { type: 'string' } });

    wrapper.addCase('can not has "mod" and "mods" fields both', { mod: 'test', mods: {} }, { keyword: 'not', schema: { required: ['mods'] } });
}


function buildTestCases() {
    var cases = [];

    validateEntity(new Wrapper('root', cases));

    validateEntity(new Wrapper('mustDeps item', cases, function(obj) { return { mustDeps: obj } }));

    validateEntity(new Wrapper('shouldDeps item', cases, function(obj) { return { shouldDeps: obj } }));

    validateEntity(new Wrapper('noDeps item', cases, function(obj) { return { noDeps: obj } }));

    return cases;
}

var cases = buildTestCases();

console.log(JSON.stringify(cases, null, 4));

describe('schema', function() {

    cases.forEach(function(data){

        var content = '(' + JSON.stringify(data.obj) + ')';

        it(data.title, function() {
            var errorCallback = sinon.spy();

            validate(content, errorCallback);

            if (data.error) {
                assert.calledOnce(errorCallback);
                assert.containSubset(errorCallback.getCall(0).args[1], data.error);
            } else {
                assert.notCalled(errorCallback);
            }
        });
    });

});
