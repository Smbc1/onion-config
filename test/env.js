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

describe('Env layer', () => {
  it('should parse environment and use path', async () => {
    process.env.some_data_here = JSON.stringify(config);
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Env());
    onion.get().should.have.properties({
      some: {
        data: {
          here: JSON.stringify(config),
        },
      },
    });
    onion.get().should.have.properties({
      some: {
        data: {
          here: JSON.stringify(config),
        },
      },
    });
    onion.get('some').should.be.eql({
      data: {
        here: JSON.stringify(config),
      },
    });
  });

  it('should use prefix', async () => {
    const config = {
      aNumber: 1,
      aString: 'hello',
      someObject: {
        dozed: 12,
        nothingHere: false,
      }
    };
    process.env.some_data_here = JSON.stringify(config);
    const onion = new Onion({});
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_data_' }));
    onion.get().should.be.eql({
      some: {
        data: {
          here: JSON.stringify(config),
        },
      },
    });
    onion.get('some').should.be.eql({
      data: {
        here: JSON.stringify(config),
      },
    });
  });

  it('should parse JSON in environment', async () => {
    const config = {
      aNumber: 1,
      aString: 'hello',
      someObject: {
        dozed: 12,
        nothingHere: false,
      }
    };
    process.env.some_data_here = JSON.stringify(config);
    const onion = new Onion({});
    await onion.addLayer(new Onion.LAYERS.Env({ prefix: 'some_data_', json: true }));
    onion.get().should.be.eql({
      some: {
        data: {
          here: config,
        },
      },
    });
  });
});
