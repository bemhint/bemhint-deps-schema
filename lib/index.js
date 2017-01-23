'use strict';

const loader = require('./loader'),
    validate = require('./validator'),
    format = require('./formatter'),
    locate = require('./locator');

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

        function addError(title, error) {
            entity.addError({
                msg: title,
                tech: tech.name,
                value: typeof error === 'object' ? format(error) : error,
                location: locate(config, tech.content, error.dataPath)
            });
        }

        tech.content && validate(loader.load(config), tech.content, addError);
    }
};
