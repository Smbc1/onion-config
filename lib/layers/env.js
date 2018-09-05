'use strict';

const AbstractLayer = require('./abstract');

class EnvLayer extends AbstractLayer {
  /**
   * @inheritDoc
   */
  async init() {
    this.parseEnv();
    this.markInitialized();
  }

  /**
   * Parse process.env and get data
   * @private
   */
  parseEnv() {
    const { env } = process;
    Object.keys(env).forEach((key) => {
      if (this.options.prefix !== 'undefined' && !key.startsWith(this.options.prefix)) return;
      this.parseField(key, env[key])
    });
  }

  /**
   * Parse env field
   * @param {string} key
   * @param {*} value
   */
  parseField(key, value) {
    const path = key.replace(new RegExp(this.options.parsingSeparator, 'g'), this.constructor.SEPARATOR);
    if (!this.options.json) return this.set(path, value);
    try {
      this.set(path, JSON.parse(value));
    } catch (e) {
      console.error(`JSON value in key ${key} fallback to string. Error:`, e);
      this.set(path, value);
    }
  }
}

module.exports = EnvLayer;
