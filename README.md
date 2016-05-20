# bemhint-deps-schema
Plugin for [bemhint](https://github.com/bemhint/bemhint) which checks *.deps.js to be written by [specification](https://en.bem.info/technology/deps/about/).

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
