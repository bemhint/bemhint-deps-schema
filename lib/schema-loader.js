'use strict';

const _ = require('lodash');
const cacheRequire = require('./cache-require');

const loadDefaultSchema = (techName) => cacheRequire(`../schema/${techName}`);

exports.load = (techName, config) => {
    const techConfig = _.defaults({}, config.getTechConfig(techName), {
        schema: loadDefaultSchema(techName)
    });

    return _([])
        .concat(techConfig.schema)
        .map((schema) => _.isString(schema) ? cacheRequire(config.resolvePath(schema)) : schema)
        .compact()
        .thru((schemas) => _.isEmpty(schemas) ? [loadDefaultSchema(techName)] : schemas)
        .value();
};
