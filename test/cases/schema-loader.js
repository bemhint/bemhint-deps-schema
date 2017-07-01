'use strict';

const proxyquire = require('proxyquire');

describe('schema-loader', () => {
    let schemaLoader;
    let cacheRequire;
    let config;

    beforeEach(() => {
        cacheRequire = sinon.stub();
        schemaLoader = proxyquire('../../lib/schema-loader', {
            './cache-require': cacheRequire
        });
        config = {
            getTechConfig: sinon.stub(),
            resolvePath: sinon.stub()
        };
    });

    it('should load a default schema if it is not specified in a config', () => {
        config.getTechConfig.withArgs('some.tech').returns({});
        cacheRequire.withArgs('../schema/some.tech').returns({foo: 'bar'});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{foo: 'bar'}]);
    });

    it('should load a default schema if it is specified as an empty array in a config', () => {
        config.getTechConfig.withArgs('some.tech').returns({schema: []});
        cacheRequire.withArgs('../schema/some.tech').returns({foo: 'bar'});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{foo: 'bar'}]);
    });

    it('should load a default schema if it is specified as an array of falsey values in a config', () => {
        config.getTechConfig.withArgs('some.tech').returns({schema: [undefined, null, false, 0]});
        cacheRequire.withArgs('../schema/some.tech').returns({foo: 'bar'});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{foo: 'bar'}]);
    });

    it('should load a schema relatively to a config if it is specified as a string in a config', () => {
        config.getTechConfig.withArgs('some.tech').returns({schema: 'some/path'});
        config.resolvePath.withArgs('some/path').returns('/resolved/some/path');
        cacheRequire.withArgs('/resolved/some/path').returns({foo: 'bar'});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{foo: 'bar'}]);
    });

    it('should return schema as is if it is NOT specified as string in a config', () => {
        config.getTechConfig.withArgs('some.tech').returns({schema: {foo: 'bar'}});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{foo: 'bar'}]);
    });

    it('should load several schemas', () => {
        config.getTechConfig.withArgs('some.tech').returns({schema: ['some/path', {foo: 'bar'}]});
        config.resolvePath.withArgs('some/path').returns('/resolved/some/path');
        cacheRequire.withArgs('/resolved/some/path').returns({baz: 'qux'});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{baz: 'qux'}, {foo: 'bar'}]);
    });

    it('should filter falsey schemas', () => {
        config.getTechConfig.withArgs('some.tech').returns({schema: [false, null, {foo: 'bar'}]});

        assert.deepEqual(schemaLoader.load('some.tech', config), [{foo: 'bar'}]);
    });
});
