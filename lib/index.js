'use strict';

const nodeEval = require('node-eval'),
    loader = require('./loader'),
    validate = require('./validator'),
    format = require('./formatter');

module.exports = {

    // For tests
    _utils: {
        loadSchema: arg => loader.load(arg),
        validate,
        format,
        eval: nodeEval
    },

    /**
     * Returns default plugin configuration
     *
     * @returns {Object}
     */
    configure: () => ({ techs: { 'deps.js': true } }),

    /**
     * Validates deps.js of entity
     *
     * @param {Object} tech
     * @param {Entity} entity
     * @param {Config} config
     */
    forEachTech: function(tech, entity, config) {

        const locator = config.getConfig().locator,
            schema = this._utils.loadSchema(config);

        const addError = (title, error) => {
            entity.addError({
                msg: title,
                tech: tech.name,
                value: typeof error === 'object' ? this._utils.format(error) : error,
                location: typeof error === 'object' && locator ? locator(tech.content, error.dataPath) : undefined
            });
        };

        let value;

        try {
            value = this._utils.eval(tech.content || '');
        } catch (e) {
            addError('Invalid content in source file', e.message);
            return;
        }

        value && this._utils.validate(schema, value, addError);
    }
};
