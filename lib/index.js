'use strict';

const schemaLoader = require('./schema-loader'),
    validate = require('./validator'),
    format = require('./formatter');

module.exports = {
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
    forEachTech: (tech, entity, config) => {
        const locator = config.getConfig().locator;

        function addError(title, error) {
            entity.addError({
                msg: title,
                tech: tech.name,
                value: typeof error === 'object' ? format(error) : error,
                location: locator && locator(tech.content, error.dataPath)
            });
        }

        tech.content &&  schemaLoader.load(tech.name, config).forEach((schema) => validate(tech, schema, addError));
    }
};
