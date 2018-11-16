# Changelog

## 0.3.1
* Vault KV2 option `key` loads value of key **right in layer data**, it means that you can get value as `.get`,
but, in addition, it merges with root data of other layers!

## 0.3.0
* Vault KV2 constructor now accepts `key` option to define direct path like `basePath`/`key` 
to read without discovery in `basePath`
* KV2 keys with slash (/) support, each `/` will be parsed as nested value, e. g. `some/key/here = 'Hello!'` will
be presented as ```{ some: { key: { here: 'Hello!'} } }``` and can be accessed as ```.get('some.key.here')```
or ```.get('some').key.here``` etc.

## 0.2.5
* Onion constructor now uses `options`:
    * .get uses optional argument `separator` in addition to `path` or previously 
    set `options.getSeparator`

## 0.2.4
* KV2 vault layer can renew token periodically

## 0.2.0
* Env Layer will not use `prefix` value after parsing config. It will not appear in resulting config structure 
and used only for filtering while parsing environment.

## 0.1.3
* API docs now describes only Onion class
* Usage added
* Some test rework
* Data merge operation fixes (thanks, [@strikeentco](https://github.com/strikeentco))
* Minor fixes
