'use strict';

const plugin = require('../../lib');

describe('plugin', () => {
    let makeConfig = pluginConfig => ({ getConfig: () => pluginConfig }),
        tech, entity, sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        sandbox.stub(plugin._utils, 'loadSchema').returns('test-schema');
        sandbox.stub(plugin._utils, 'format').returns('test-format');
        sandbox.stub(plugin._utils, 'eval').returns('test-value');
        sandbox.stub(plugin._utils, 'validate');

        entity = { addError: sinon.stub() };

        tech = { content: 'test-content', name: 'test' };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should run validation', () => {
        const config = makeConfig({});

        plugin.forEachTech(tech, entity, config);

        assert.calledOnce(plugin._utils.loadSchema);
        assert.calledWith(plugin._utils.loadSchema, config);

        assert.calledOnce(plugin._utils.eval);
        assert.calledWith(plugin._utils.eval, 'test-content');

        assert.calledOnce(plugin._utils.validate);
        assert.calledWith(plugin._utils.validate, 'test-schema', 'test-value', sinon.match.func);

        assert.notCalled(plugin._utils.format);
    });

    it('should pass formatted error object into entity.addError', () => {
        const config = makeConfig({});

        plugin.forEachTech(tech, entity, config);

        const validateAddError = plugin._utils.validate.firstCall.args[2];

        // fake error during validation
        validateAddError('test-error', { error: true });

        assert.calledOnce(entity.addError);
        assert.calledWith(entity.addError, {
            msg: 'test-error',
            tech: 'test',
            value: 'test-format',
            location: undefined
        });

        assert.calledOnce(plugin._utils.format);
        assert.calledWith(plugin._utils.format, { error: true });
    });

    it('should pass plain string error into entity.addError', () => {
        const config = makeConfig({});

        plugin.forEachTech(tech, entity, config);

        const validateAddError = plugin._utils.validate.firstCall.args[2];

        // fake error during validation
        validateAddError('test-error', 'plain-error');

        assert.calledOnce(entity.addError);
        assert.calledWith(entity.addError, {
            msg: 'test-error',
            tech: 'test',
            value: 'plain-error',
            location: undefined
        });

        assert.notCalled(plugin._utils.format);
    });

    it('should pass location for error object if locator defined', () => {
        const locator = sinon.stub().returns('test-location'),
            config = makeConfig({ locator });

        plugin.forEachTech(tech, entity, config);

        const validateAddError = plugin._utils.validate.firstCall.args[2];

        // fake error during validation
        validateAddError('test-error', { dataPath: 'foo.bar.0.baz' });

        assert.calledWith(entity.addError, {
            msg: 'test-error',
            tech: 'test',
            value: 'test-format',
            location: 'test-location'
        });

        assert.calledOnce(locator);
        assert.calledWith(locator, 'test-content', 'foo.bar.0.baz');
    });

    it('should throw with syntax error', () => {
        const config = makeConfig({});

        plugin._utils.eval.throws(new SyntaxError('bad-syntax'));

        plugin.forEachTech(tech, entity, config);

        assert.notCalled(plugin._utils.validate);

        assert.calledOnce(entity.addError);
        assert.calledWith(entity.addError, {
            msg: 'Invalid content in source file',
            tech: 'test',
            value: 'bad-syntax',
            location: undefined
        });
    });

    it('should ignore falsy evaluated values', () => {
        const config = makeConfig({});

        plugin._utils.eval.returns();

        plugin.forEachTech(tech, entity, config);

        assert.notCalled(plugin._utils.validate);
        assert.notCalled(entity.addError);
    });

    it('should deal with empty tech content', () => {
        const config = makeConfig({});

        plugin.forEachTech({}, entity, config);

        assert.calledOnce(plugin._utils.eval);
        assert.calledWith(plugin._utils.eval, '');
    });
});
