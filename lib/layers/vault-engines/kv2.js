'use strict';

const yarl = require('yarl');
const { get, post } = yarl;

class Kv2 {
  constructor(options = {}) {
    this.options = { ...Kv2.DEFAULT_OPTIONS, ...options };
    if (this.options.renewInterval) {
      const { renewInterval } = this.options;
      this.renewInterval = setInterval(() => this.checkTokenTtl(), renewInterval * 1000);
    }
  }

  /**
   * Get key value from vault
   * @param {string} key
   * @returns {Promise<*|null>}
   * @async
   */
  async getValue(key) {
    const result = await this.vaultRequest(`/v1/${this.options.basePath}/data/${key}`);
    return result.data || null;
  }

  /**
   * Get keys list for path
   * @param {string} path
   * @param {string} key
   * @returns {Promise<*|Array>}
   * @async
   */
  async getKeysList(path, key = '') {
    const { keys } = await this.vaultRequest(`/v1/${path}/metadata/${key}?list=true`);
    return keys;
  }

  async checkTokenTtl() {
    await this.updateTtl();
    const diff = this.options.minTtl - this.ttl;
    if (diff > 0) {
      return this.renewToken(this.options.minTtl);
    }
  }

  /**
   * @param {number} increment Ttl increment in seconds
   * @returns {Promise<*|null>}
   * @private
   */
  async renewToken(increment) {
    try {
      await post(this.options.url, {
        path: '/v1/auth/token/renew-self',
        json: true,
        headers: {
          'user-agent': this.options.agent,
          'X-Vault-Token': this.options.token,
        },
        body: {
          increment: `${increment}s`,
        },
      });
      await this.updateTtl();
    } catch (e) {
      console.error(`Error on token renew: ${e.message}`);
    }
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  async updateTtl() {
    const info = await this.vaultRequest('/v1/auth/token/lookup-self');
    this.ttl = Number(info.ttl);
  }

  /**
   * Make vault request
   * @param {string} path
   * @param {boolean} renewOnFail Try to renew token on fail response
   * @returns {Promise<*>}
   * @private
   */
  async vaultRequest(path, renewOnFail = true) {
    const { body } = await get(this.options.url, {
      path,
      json: true,
      headers: {
        'user-agent': this.options.agent,
        'X-Vault-Token': this.options.token,
      },
    });
    return body.data || null;
  }

  destroy() {
    clearInterval(this.renewInterval);
  }
}

Kv2.DEFAULT_OPTIONS = {
  renewInterval: 0,
  minTtl: 7200,
  agent: 'Vault client',
};

module.exports = Kv2;