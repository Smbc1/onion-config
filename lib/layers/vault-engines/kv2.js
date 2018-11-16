'use strict';

const yarl = require('yarl');
const { get, post } = yarl;

class Kv2 {
  /**
   *
   * @param {object} options
   * @param {string} options.basePath Path to search for keys, equal to "secret path" in vault web GUI or mount "path"
   * in vault API
   * @param {string} [options.key] Key to load directly, without discovery over all basePath, ignored on default
   * @param {number} [options.renewInterval] Interval to renew vault token in sec. In =0 then no auto-renew will be done. Default is 0
   * @param {number} [options.minTtl] TTL to keep on review in sec. Default is 7200
   */
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
    for (const i in keys) {
      if (!keys[i].endsWith('/')) continue;
      const [ subKey ] = keys.splice(i);
      const keyChilds = await this.getKeysList(path, `${key}${subKey}`);
      keyChilds.forEach(c => keys.push(`${subKey}${c}`));
    }
    return keys;
  }

  /**
   * @private
   * @returns {Promise<*|null>}
   */
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