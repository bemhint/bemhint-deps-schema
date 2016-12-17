'use strict';

describe('locator', () => {

    it('should locate error if defined', () => {
        const locator = sinon.spy(),
            config = { getConfig: () => ({ locator }) };

        locateError(config, '{ shouldDeps: [123] }', 'shouldDeps.0');

        assert.calledOnce(locator);
        assert.calledWith(locator, '{ shouldDeps: [123] }', 'shouldDeps.0');
    });

    it('should return undefined if omitted', () => {
        const config = { getConfig: () => ({}) };

        assert.isUndefined(locateError(config, '{ "foo" }', '?'));
    });
});
