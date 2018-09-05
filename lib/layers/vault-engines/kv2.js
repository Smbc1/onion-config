'use strict';

const yarl = require('yarl');
const { get } = yarl;

class Kv2 {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Get key value from vault
   * @param {string} key
   * @returns {Promise<*|null>}
   * @async
   */
  async getValue(key) {
    const path = `/v1/${this.options.basePath}/data/${key}`;
    const { body } = await get(this.options.url, {
      path,
      json: true,
      headers: {
        'user-agent': 'Vault client',
        'X-Vault-Token': this.options.token,
      },
    });
    return body.data.data || null;
  }

  /**
   * Get keys list for path
   * @param {string} path
   * @param {string} key
   * @returns {Promise<*|Array>}
   * @async
   */
  async getKeysList(path, key = '') {
    const { body } = await get(this.options.url, {
      path: `/v1/${path}/metadata/${key}?list=true`,
      json: true,
      headers: {
        'user-agent': 'Vault client',
        'X-Vault-Token': this.options.token,
      },
    });
    return body.data.keys || [];
  }
}

module.exports = Kv2;