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

describe('SimpleObject layer', () => {
  it('should use object', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.SimpleObject({ data: config }));
    onion.get().should.be.eql(config);
  });
});
