'use strict';

const Onion = require('../');

const config = {
  aNumber: 1,
  aString: 'hello',
  someObject: {
    dozen: 12,
    nothingHere: false,
  }
};

describe('Multiple layers', () => {
  before(() => {
    process.env.some_thing_here = JSON.stringify(config);
  });

  it('should use multiple layers and merge it', async () => {
    const onion = new Onion();
    const overlapping = {
      part1: {
        thing: {
          here: {
            someObject: {
              nothingHere: true,
            },
          },
        },
      },
    };
    const layers = {
      simple1: new Onion.LAYERS.SimpleObject({
        data: {
          some: {},
          part1: {},
        },
      }),
      env: new Onion.LAYERS.Env({prefix: 'some_', json: true,}),
      simple2: new Onion.LAYERS.SimpleObject({ data: overlapping }),
    };

    await Promise.all(Object.keys(layers).map(name => onion.addLayer(layers[name])));
    onion.get('part1').should.be.eql(layers.simple2.data.part1);
    onion.get('part1').should.be.eql(overlapping.part1);
    onion.get('some').should.be.eql(layers.env.data.some);
    onion.get('part1.thing.here.someObject.nothingHere').should.be.eql(true);
  });

  it('should set with path and merge it with path access', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    so.set('some.thing.here.someObject', { nothingHere: true });
    onion.get('some.thing.here.someObject.nothingHere').should.be.eql(true);
  });

  it('should return undefined if nothing found', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    so.set('some.thing.here.someObject', { nothingHere: true });
    (onion.get('some.other.thing') === undefined).should.be.ok();
  });

  it('should not overlap on revert layers order', async () => {
    const onion = new Onion();
    const so = new Onion.LAYERS.SimpleObject();
    await onion.addLayer(so);
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    so.set('some.thing.here.someObject', { nothingHere: true });
    onion.get('some.thing.here.someObject.nothingHere').should.be.eql(false);
  });
});
