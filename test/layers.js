'use strict';

const should = require('should');
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
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_', json: true, }));
    await onion.addLayer(new Onion.LAYERS.SimpleObject({
      data: {
        some: {
          thing: {
            here: {
              someObject: {
                nothingHere: true,
              },
            },
          },
        },
      },
    }));
    onion.get('some.thing.here.someObject.nothingHere').should.be.eql(true);
  });

  it('should set with path and merge it on get', async () => {
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
