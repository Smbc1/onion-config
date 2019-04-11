'use strict';

const Onion = require('../');

const data = {
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
  'link1': '@part3.someObject',
  'link2': '@part3.someObject.dozen',
  'link3': '@link1.dozen'
};

describe('Config linking', () => {
  it('should not create links by default', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.SimpleObject({ data }));

    const result = onion.get();
    result.link1.should.be.eql('@part3.someObject');
    result.link2.should.be.eql('@part3.someObject.dozen');
    result.link3.should.be.eql('@link1.dozen');
  });

  it('should create links', async () => {
    const onion = new Onion({
      links: true,
    });
    await onion.addLayer(new Onion.LAYERS.SimpleObject({ data }));

    const result = onion.get();
    result.link1.should.be.eql(result.part3.someObject);
    result.link2.should.be.eql(result.part3.someObject.dozen);
    result.link3.should.be.eql(result.part3.someObject.dozen);
  });

  it('should throw on link without value', async () => {
    const onion = new Onion({
      links: true,
    });
    data.badLink = '@part2.no.thing';
    await onion.addLayer(new Onion.LAYERS.SimpleObject({ data }));
    (() => onion.get()).should.throw(new Error('Link part2.no.thing have no value'));
  });

  it('should not throw on link without value if ignoreWrongLinks is true', async () => {
    const onion = new Onion({
      links: true,
      ignoreWrongLinks: true,
    });
    data.badLink = '@part2.no.thing';
    await onion.addLayer(new Onion.LAYERS.SimpleObject({ data }));
    onion.get();
  });
});
