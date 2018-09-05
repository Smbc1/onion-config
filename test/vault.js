'use strict';

const Onion = require('../');
const { post } = require('yarl');

const { env } = process;

const basePath = 'some/service';
const config = {
  field1: {
    a: '1',
    b: '5',
    hello: 'world',
  },
  field2: {
    nothing: 'here',
  },
  'wrong/key/name': {
    bb: 'ccc',
  }
};

describe('Vault KV2 layer', () => {
  before(async () => {
    const vaultBasePath = `${env.VAULT_URL}/v1/${basePath}/data`;
    try {
      await post(`${env.VAULT_URL}/v1/sys/mounts/${basePath}`, {
        body: JSON.stringify({
          type: 'kv',
          options: {
            version: 2,
          },
        }),
        headers: {
          'X-Vault-Token': env.VAULT_TOKEN,
        },
      });
      for (const key in config) {
        await post(`${vaultBasePath}/${key}`, {
          body: {
            data: config[key],
          },
          json: true,
          headers: {
            'X-Vault-Token': env.VAULT_TOKEN,
          },
        });
      }
    } catch (e) {
    console.error(e);
    throw e;
  }
  });

  it('should init and load data', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Vault({
      url: env.VAULT_URL,
      token: env.VAULT_TOKEN,
      basePath,
    }));
    onion.get().should.be.eql({
      field1: config.field1,
      field2: config.field2,
    });
  });

  it('should ignore keys with "/" in it', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Vault({
      url: env.VAULT_URL,
      token: env.VAULT_TOKEN,
      basePath,
    }));
    (onion.get('wrong') === undefined).should.be.ok();
  });
});
