'use strict';

module.exports = error => {
    const data = `data${error.dataPath}`;

    switch (error.keyword) {
        case 'required':
            return `${data} should have required property (${error.params.missingProperty})`;
        case 'not':
            // not.required
            return `${data} should NOT have property (${error.schema.required})`;
        case 'additionalProperties':
            return `${data} should NOT have additional property (${error.params.additionalProperty})`;
        case 'enum':
            return [data, error.message, JSON.stringify(error.schema)].join(' ');
        default:
            return `${data} ${error.message}`;
    }
};

