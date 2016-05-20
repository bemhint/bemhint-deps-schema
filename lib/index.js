'use strict';

var validate = require('./validator'),
    format = require('./formatter');

module.exports = {

    /**
     * Формирует конфиг плагина по умолчанию
     *
     * @returns {Object}
     */
    configure: function() {
        return {
            techs: {
                'deps.js': true
            }
        };
    },

    /**
     * Проверяет схему deps.js заданной сущности
     *
     * @param {Object} tech
     * @param {Entity} entity
     * @param {Config} config
     */
    forEachTech: function(tech, entity, config) {

        function addError(title, data) {
            entity.addError({
                msg: title,
                tech: tech.name,
                value: typeof data === 'object' ? format(data) : data
            });
        }

        tech.content && validate(tech.content, addError);
    }
};
