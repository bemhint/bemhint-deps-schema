'use strict';

const validate = require('./validator'),
    formatter = require('./formatter');

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
     */
    forEachTech: (tech, entity) => {

        function addError(title, data) {
            entity.addError({
                msg: title,
                tech: tech.name,
                value: typeof data === 'object' ? formatter(data) : data
            });
        }

        tech.content && validate(tech.content, addError);
    }
};
