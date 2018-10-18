'use strict';

const AbstractLayer = require('./abstract');

class EnvLayer extends AbstractLayer {
  /**
   * @inheritDoc
   */
  async init() {
    this.normalizePrefix();
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
      if (env[key] === undefined) return;
      if (!this.options.prefix) return this.parseField(key, env[key]);

      if (!key.startsWith(this.options.prefix)) return;
      const trimmedKey = key.replace(new RegExp(`^${this.options.prefix}${this.options.parsingSeparator}`), '');
      return this.parseField(trimmedKey, env[key]);
    });
  }

  /**
   * Parse env field
   * @param {string} key
   * @param {*} value
   * @private
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

  /**
   * Remove ending `parsingSeparator`, if present in `prefix`
   * @private
   */
  normalizePrefix() {
    const separator = this.options.parsingSeparator;
    if (this.options.prefix === undefined || !this.options.prefix.endsWith(separator)) return;
    this.options.prefix = this.options.prefix.replace(new RegExp(`(.*)${separator}`), '$1');
  }
}

module.exports = EnvLayer;
