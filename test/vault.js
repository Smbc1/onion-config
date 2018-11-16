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

let token;

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

      const { body } = await post(`${env.VAULT_URL}/v1/auth/token/create`, {
        body: {
          ttl: '10s',
          // policies: ['default'],
        },
        json: true,
        headers: {
          'X-Vault-Token': env.VAULT_TOKEN,
        },
      });
      token = body.auth.client_token;
    } catch (e) {
    console.error(e);
    throw e;
  }
  });

  it('should init and load data', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Vault({
      url: env.VAULT_URL,
      token,
      basePath,
    }));
    onion.get().should.be.eql({
      field1: config.field1,
      field2: config.field2,
      wrong: {
        key: {
          name: {
            bb: 'ccc',
          }
        }
      }
    });
  });

  it('should init and load one key if it `key` option defined', async () => {
    const onion = new Onion();
    await onion.addLayer(new Onion.LAYERS.Vault({
      url: env.VAULT_URL,
      token,
      basePath,
      key: 'wrong/key/name'
    }));
    onion.get().should.be.eql(config['wrong/key/name']);
  });

  it('should renew token', async () => {
    const onion = new Onion();
    const layer = new Onion.LAYERS.Vault({
      url: env.VAULT_URL,
      token,
      basePath,
      renewInterval: 1,
    });
    await onion.addLayer(layer);
    await new Promise(res => setTimeout(() => res(), 1500));
    layer.engine.ttl.should.be.above(3600);
  });

  it('should renew token using minTtl', async () => {
    const onion = new Onion();
    const layer = new Onion.LAYERS.Vault({
      url: env.VAULT_URL,
      token,
      basePath,
      renewInterval: 1,
      minTtl: 1800,
    });
    await onion.addLayer(layer);
    await new Promise(res => setTimeout(() => res(), 1500));
    layer.engine.ttl.should.be.above(1000);
  });
});
