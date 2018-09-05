\#Onion-config: layer-based config/data manager
Provides object storage with layers overlapping and dynamic update support.

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
