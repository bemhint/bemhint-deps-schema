

function Wrapper(title, cases, fn) {
    this.title = title;
    this.cases = cases;
    this.fn = fn || function(obj) { return obj; };
}

Wrapper.prototype.addCase = function(subtitle, obj, error) {
    this.cases.push({
        title: this.title + ': ' + subtitle,
        obj: this.fn(obj),
        error: error
    });
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

console.log(JSON.stringify(cases, null, 4))

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
