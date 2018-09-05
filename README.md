\#Onion-config: layer-based config/data manager
Provides object storage with layers overlapping and dynamic update support.

## How to use it
```javascript
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    await onion.addLayer(new Onion.LAYERS.SimpleObject({
      foo: {
        bar: 12345
      },
    }));
    const foo = onion.get('foo.bar').should.be.eql(true);
```

## Idea of layers
Every next added layer merges over previous just in moment of build, on first access (`.get()`) or 
on explicit build call (`.compile`, `.recompile()`).

Value `.get()` method uses path notation like `some.thing.here` to access inner parts of stored data. After building
`.get()` works just with merged `.data` object until next `.recompile()` call.

## Supported config sources
### Simple object
In-code storage, not recommended. Just stores 
```javascript
  await onion.addLayer(new Onion.LAYERS.SimpleObject({
    foo: {
      bar: 12345
    },
  }));
```

### Env parser
Environment variables parser.
```javascript
  await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
```
It parses environment variables, filtering it by `prefix` and supports JSON-serilized values if option is `true`.
In addition, possible to change parsing with `parsingSeparator` option.

### Hashicorp Vault KV2 storage
In-code storage, not recommended. Just stores 
```javascript
  await onion.addLayer(new Onion.LAYERS.Vault({
    url: env.VAULT_URL,
    token: env.VAULT_TOKEN,
    basePath,
  }));
```
Loads all keys in `basePath` and stores it. Useful for micro services. Key version support in process.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [addLayer](#addlayer)
-   [get](#get)
-   [compile](#compile)
-   [recompile](#recompile)
-   [constructor](#constructor)
-   [init](#init)
-   [get](#get-1)
-   [set](#set)
-   [name](#name)
-   [parseField](#parsefield)
-   [SimpleObjectLayer](#simpleobjectlayer)
-   [VaultLayer](#vaultlayer)

### addLayer

Adds layer to storage for further data search

**Parameters**

-   `layer` **AbstractLayer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

### get

Search data by path in layers stack, from _last added_  to _first added_ until finds any info,
then returns value or error

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `''`)

Returns **any** 

### compile

Compile config and prepare it for .get()

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

### recompile

Build inner config cache again

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

### constructor

**Parameters**

-   `options` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)

### init

Initialize layer and load it's data, override it

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

### get

Get config value by path

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### set

Set config value by path

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `value` **any** 

### name

Get class name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### parseField

Parse env field

**Parameters**

-   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `value` **any** 

### SimpleObjectLayer

**Extends AbstractLayer**

Simple layer to store config right out-of-code

### VaultLayer

**Extends AbstractLayer**

HashiCorp Vault layer for config

## addLayer

Adds layer to storage for further data search

**Parameters**

-   `layer` **AbstractLayer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

## get

Search data by path in layers stack, from _last added_  to _first added_ until finds any info,
then returns value or error

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `''`)

Returns **any** 

## compile

Compile config and prepare it for .get()

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

## recompile

Build inner config cache again

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

## constructor

**Parameters**

-   `options` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)

## init

Initialize layer and load it's data, override it

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

## get

Get config value by path

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## set

Set config value by path

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `value` **any** 

## name

Get class name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## parseField

Parse env field

**Parameters**

-   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `value` **any** 

## SimpleObjectLayer

**Extends AbstractLayer**

Simple layer to store config right out-of-code

## VaultLayer

**Extends AbstractLayer**

HashiCorp Vault layer for config
