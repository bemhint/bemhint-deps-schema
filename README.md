# bemhint-deps-schema
Plugin for [bemhint](https://github.com/bemhint/bemhint) checks *.deps.js to be written by [specification](https://en.bem.info/technology/deps/about/). Requires bemhint 0.7.0 or above.

## How to install

```bash
$ npm install bemhint-deps-schema
```

## How to use

Add plugin to `.bemhint.js`:

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': true
    }
};
```

## Custom schema

To validate custom deps.js format (code style reasons or others) configure plugin with custom json-schema (path is relative to config location):

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': {
            schema: './dir/deps.schema.json'
        }
    }
};
```

We suggest to base your custom schema on standard plugin's schema.

## Error location

Validator reports error with JSON-style error location like `shouldDeps[1].elem`. To get line/column error location define the function:

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': {
            /**
             * Returns location of dataPath in content
             *
             * @param {String} content
             * @param {String} dataPath
             *
             * @returns {Location}
             */
            locator: (content, dataPath) => {
                return { line: 153, column: 12 };
            }
        }
    }
};

/**
 * @typedef {Object} Location
 *
 * @property {Number} line - 1-based line number
 * @property {Number} column - 1-based column number
 */
```

You can use external module like [Json-file-pointer](https://github.com/Vittly/json-file-pointer):

```js
const pointer = require('json-file-pointer');

module.exports = {
    plugins: {
        'bemhint-deps-schema': {
            locator: (content, dataPath) => pointer.getLocationOf(content, dataPath)
        }
    }
};
```
