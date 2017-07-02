# bemhint-deps-schema
Плагин для [bemhint](https://github.com/bemhint/bemhint), который проверяет, что файлы *.deps.js соответствуют [спецификации](https://ru.bem.info/technology/deps/about/). Требутеся bemhint версии 0.9.0 или выше.

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
            'deps.js': {
                schema: './dir/deps.schema.json' // модуль будет загружаться относительно конфига bemhint-а
            }
        }
    }
};
```

Советуем при написании собственной схемы использовать за основу стандартную схему плагина:

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': {
            'deps.js': {
                schema: [
                    require('bemhint-deps-schema/schema/deps.js'), // стандартная схема плагина
                    './dir/deps.schema.json', // кастомная схема плагина
                ]
            }
        }
    }
};
```

## Позиции ошибки

По умолчанию валидатор указывает на место ошибки с помощью пути в JSON-е, например: `shouldDeps[1].elem`. Для получения позиции ошибки в виде пары строка-колонка нужно реализовать специальную функцию:

```js
module.exports = {
    plugins: {
        'bemhint-deps-schema': {
            /**
             * Вернуть позицию, соответствующую dataPath в content
             *
             * @param {String} content
             * @param {String} dataPath
             *
             * @returns {Location}
             */
            locator: (content, dataPath) => {
                // ...
            }
        }
    }
};

/**
 * @typedef {Object} Location
 *
 * @property {Number} line - номер строки, считая с 1
 * @property {Number} column - номер колонки, считая с 1
 */
```

Может быть использован сторонний модуль, например [Json-file-pointer](https://github.com/Vittly/json-file-pointer):

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
