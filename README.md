# Onion-config: layer-based config/data manager
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

More on API [here](./API.md)
