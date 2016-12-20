# bemhint-deps-schema
Плагин для [bemhint](https://github.com/bemhint/bemhint), который проверяет, что файлы *.deps.js соответствуют [спецификации](https://ru.bem.info/technology/deps/about/).

## Установка 

```bash
$ npm install bemhint-deps-schema
```

## Быстрый старт

Добавьте плагин bemhint-deps-schema в конфигурационный файл `.bemhint.js`:

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': true
    }
};
```

## Использование нестандартной схемы

Если в проекте используется нестандартный формат deps.js (кодстайл и др.), плагин можно настроить на использование кастомной json-схемы (путь указывается относительно конфига):

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': {
            schema: './dir/deps.schema.json'
        }
    }
};
```

Советуем при написании собственной схемы использовать за основу стандартную схему плагина.
