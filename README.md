# onion-config: layer-based config/data manager
Provides object storage with layers overlapping and dynamic update support.

## Usage
```
npm install --save onion-config
```

```javascript
const Onion = require('onion-config');

const onion = new Onion();
// ENV contains value like some_foo = '{bar: 12345}'
await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
onion.get('foo.bar'); // => '12345'

await onion.addLayer(new Onion.LAYERS.SimpleObject({
  data: {
    foo: {
        bar: 'baz'
      },
  },
}));
onion.get('foo.bar') // => 'baz'

```

## Idea of layers
Every next added layer merges over previous just in moment of build, on first access (`.get()`) or 
on explicit build call (`.compile`, `.recompile()`).

Value `.get()` method uses path notation like `some.thing.here` to access inner parts of stored data. After building
`.get()` works just with merged `.data` object until next `.recompile()` call.

## Supported config sources (Layers)
### Simple object
In-code storage, not recommended. Just keeps data from given `data` option.
```javascript
await onion.addLayer(new Onion.LAYERS.SimpleObject({
  data: {
    foo: {
      bar: 12345
    },
  },
}));
```

### Env parser
It parses environment variables, filtering it by `prefix` and supports JSON-serialized values if `json` option is `true`.
In addition, possible to change parsing with `parsingSeparator` option.

**Warning**: `prefix` option is just a filter for keys while parsing and it will not appear in the parsing results!
```javascript
await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
```

### Hashicorp Vault KV2 storage
HashiCorp Vault layer, now just with `kv2` engine support.
Loads all keys in `basePath` and stores it. Useful for micro services. Keys version support in process.
If `renewInterval` set above 0, then layer will renew token TTL above `minTtl` value periodically (every `renewInterval`
seconds)

```javascript
await onion.addLayer(new Onion.LAYERS.Vault({
  url: env.VAULT_URL,
  token: env.VAULT_TOKEN,
  basePath,
  renewInterval: 0,
  minTtl: 7200,
}));
```

### Full API docs is [here](https://github.com/Smbc1/onion-config/blob/master/docs/)
