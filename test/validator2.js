

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

    validateEntityFields(wrapper);

    validateElements(wrapper);

    validateModifiers(wrapper.createInnerWrapper('mods value', function(obj) { return { mods: obj } }));

    wrapper.addCase('can not has "mod" and "mods" fields both', { mod: 'test', mods: {} }, { keyword: 'not', schema: { required: ['mods'] } });

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

function validateElemEntity(wrapper) {

    wrapper.addCase('can be a string', '');

    wrapper.addCase('can be a string array', ['']);

    wrapper.addCase('can be an object', { elem: '' });

    wrapper.addCase('can be an object array', [{ elem: '' }]);

    wrapper.addCase('should have "elem" property', [{ }], { keyword: 'required', params: { missingProperty: 'elem' } });

    validateModifiers(wrapper.createInnerWrapper('mods value', function(obj) { return { elem: 'el1', mods: obj } }));

    // tech
    wrapper.addCase('can have "tech" field (string)', { elem: 'el1', tech: 'bemhtml' });

    wrapper.addCase('"tech" field can not be a number', { elem: 'el1', tech: 1234 }, { keyword: 'type', params: { type: 'string' } });

    // include
    wrapper.addCase('can have "include" field (false)', { elem: 'el1', include: false });

    wrapper.addCase('include can not be a string', { elem: 'el1', include: 'yes' }, { keyword: 'enum', schema: [false] });

    wrapper.addCase('include can not be true', { elem: 'el1', include: true }, { keyword: 'enum', schema: [false] });
}

function validateElements(wrapper) {

    validateElemEntity(wrapper.createInnerWrapper('elem value', function(obj) { return { elem: obj } }));

    validateElemEntity(wrapper.createInnerWrapper('elems value', function(obj) { return { elems: obj } }));

    wrapper.addCase('can not has "elem" and "elems" fields both', { elem: 'test', elems: 'test' }, { keyword: 'not', schema: { required: ['elems'] } });
}

function validateModifiers(wrapper) {
    // mods
    wrapper.addCase('must be an object', { });

    wrapper.addCase('can not be a number', 1234, { keyword: 'type', params: { type: 'object' } });

    wrapper.addCase('values can be a boolean', { asd: true });

    wrapper.addCase('values can be a string', { asd: 'qwfeg' });

    wrapper.addCase('values can not be a number', { asd: 12345 }, { keyword: 'type', params: { type: 'string,boolean,array' } });

    wrapper.addCase('values can be string array', { asd: ['qwf', 'qwdqwf'] });

    wrapper.addCase('values can not be a number array', { asd: [134] }, { keyword: 'type', params: { type: 'string' } });
}


function buildTestCases() {
    var cases = [],
        wrapper = new Wrapper('root', cases);

    validateEntity(wrapper);

    validateEntity(wrapper.createInnerWrapper('mustDeps item', function(obj) { return { mustDeps: obj } }));

    validateEntity(wrapper.createInnerWrapper('shouldDeps item', function(obj) { return { shouldDeps: obj } }));

    validateEntity(wrapper.createInnerWrapper('noDeps item', function(obj) { return { noDeps: obj } }));

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
