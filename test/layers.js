'use strict';

const Onion = require('../');

const config = {
  part1: {
    aNumber: 510,
    aString: 'hello',
  },
  part2: {
    bString: 'world',
  },
  part3: {
    someObject: {
      dozen: 12,
      nothingHere: false,
    }
  },
  part4: {},
};

describe('Multiple layers', () => {
  before(() => {
    process.env.some_part2 = JSON.stringify(config.part2);
  });
  after(() => {
    delete process.env.some_part2;
  });

  it('should use multiple layers and merge it', async () => {
    const onion = new Onion();
    const layers = {
      simpleLayerBase: new Onion.LAYERS.SimpleObject({
        data: {
          part1: {
            aNumber: 13,
          },
          part2: {},
          part3: {},
          part4: {},
        },
      }),
      simpleLayer1: new Onion.LAYERS.SimpleObject({ data: { part1: config.part1 } }),
      envLayer2: new Onion.LAYERS.Env({ prefix: 'some_', json: true }),
      simpleLayer3: new Onion.LAYERS.SimpleObject({ data: { part3: config.part3 } }),
    };

    await Promise.all(Object.keys(layers).map(name => onion.addLayer(layers[name])));
    onion.get().should.be.eql(config);
  });

  it('should use custom merge method', async () => {
    const onion = new Onion({
      mergeMethod: (base = {}, patch) => {
        Object.keys(patch).forEach((k) => {
          base[k] = 'hello!'
        });
        return base;
      },
    });
    const layers = {
      simpleLayer1: new Onion.LAYERS.SimpleObject({
        data: {
          part1: {
            aNumber: 13,
          },
          part2: {
            bString: 'qwerty'
          },
        },
      }),
      simpleLayer2: new Onion.LAYERS.SimpleObject({ data: {
        part1: {}
      }}),
    };

    await Promise.all(Object.keys(layers).map(name => onion.addLayer(layers[name])));
    onion.get().should.be.eql({ part1: 'hello!', part2: 'hello!' });
  });

  it('should set with path and merge it with path access', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    so.set('thing.here.someObject', { somethingHere: true });
    onion.get('thing.here.someObject.somethingHere').should.be.eql(true);
  });

  it('should use getSeparator option', async () => {
    const onion = new Onion({ getSeparator: '|' });
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    so.set('thing.here.someObject', { somethingHere: true });
    onion.get('thing|here|someObject|somethingHere').should.be.eql(true);
    onion.get('thing:here:someObject:somethingHere', ':').should.be.eql(true);
  });

  it('should return undefined if nothing found', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    so.set('thing.here.someObject', { nothingHere: true });
    (onion.get('other.thing') === undefined).should.be.ok();
  });

  it('should not overlap on revert layers order', async () => {
    const onion = new Onion();
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    await onion.addLayer(new Onion.LAYERS.SimpleObject({
      data: {
        thing: {
          here: {
            bool: false,
          },
        },
      },
    }));
    so.set('thing.here', { bool: true });
    onion.get('thing.here.bool').should.be.eql(false);
  });
});
