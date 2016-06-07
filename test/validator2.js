

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

    // other fields
    wrapper.addCase('other fields are not allowed', { xxx: 'test' }, { keyword: 'additionalProperties', params: { additionalProperty: 'xxx' }});
}

function validateEntityFields(wrapper) {
    // block
    wrapper.addCase('can have "block" field (string)', { block: 'bBlock' });

    wrapper.addCase('"block" field can not be a number', { block: 1234 }, { keyword: 'type', params: { type: 'string' } });

    // tech
    wrapper.addCase('can have "tech" field (string)', { tech: 'bemhtml' });

    wrapper.addCase('"tech" field can not be a number', { tech: 1234 }, { keyword: 'type', params: { type: 'string' } });

    // include
    wrapper.addCase('can have "include" field (false)', { include: false });

    wrapper.addCase('include can not be a string', { include: 'yes' }, { keyword: 'enum', schema: [false] });

    wrapper.addCase('include can not be true', { include: true }, { keyword: 'enum', schema: [false] });
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
