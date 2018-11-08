'use strict';

const AbstractLayer = require('./abstract');
const engines = require('./vault-engines');

/**
 * HashiCorp Vault layer for config
 * @extends AbstractLayer
 */
class VaultLayer extends AbstractLayer {
  /**
   * @inheritDoc
   */
  async init() {
    await this.loadData();
    this.markInitialized();
  }

  /**
   * Load data from vault
   * @returns {Promise<void>}
   * @async
   */
  async loadData() {
    if (this.options.url === undefined) throw new Error(`Vault layer 'options.url' is undefined`);
    if (this.options.token === undefined) throw new Error(`Vault layer 'options.token' is undefined`);
    if (this.options.basePath === undefined) throw new Error(`Vault layer 'options.basePath' is undefined`);

    this.engine = new engines[this.options.engine](this.options);
    const fields = await this.loadPath(this.options.basePath);
    Object.keys(fields).forEach((field) => this.set(field, fields[field]));
  }

  /**
   *
   * @param path
   * @returns {Promise<any>}
   * @async
   */
  async loadPath(path) {
    const keys = await this.engine.getKeysList(path);
    const tasks = keys
      .filter(k => k.indexOf('/') === -1)
      .map(key => this.engine.getValue(key));
    const data = await Promise.all(tasks);
    return data.reduce((result, value, i) => {
      result[keys[i]] = value;
      return result;
    }, {});
  }

  destroy() {
    return this.engine.destroy();
  }
}

VaultLayer.DEFAULT_OPTIONS = {
  engine: 'kv2',
};

module.exports = VaultLayer;
