'use strict';

describe('schema loader', () => {

    beforeEach(() => {
        sinon.stub(loader, '_loadFile');
    });

    afterEach(() => {
        loader._loadFile.restore();
    });

    function buildConfigStub(pluginConfig, resolver) {
        return {
            getConfig: () => pluginConfig,
            resolvePath: resolver
        };
    }

    it('should load custom schema', () => {
        const resolver = sinon.spy(() => '/dir/foo.bar.json');
        const config = buildConfigStub({ schema: './foo.bar.json' }, resolver);

        loader.getCustomSchema(config);

        assert.calledOnce(resolver);
        assert.calledWith(resolver, './foo.bar.json');

        assert.calledOnce(loader._loadFile);
        assert.calledWith(loader._loadFile, '/dir/foo.bar.json');
    });

    it('should load base with no args', () => {
        const resolver = sinon.spy();
        const config = buildConfigStub({}, resolver);

        loader.getCustomSchema(config);

        assert.notCalled(resolver);
        assert.notCalled(loader._loadFile);
    });

});
