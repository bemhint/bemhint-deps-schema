# bemhint-deps-schema
Plugin for [bemhint](https://github.com/bemhint/bemhint) checks *.deps.js to be written by [specification](https://en.bem.info/technology/deps/about/).

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
