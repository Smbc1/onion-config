'use strict';

const get = require('@strikeentco/get');
const set = require('@strikeentco/set');

class AbstractLayer {
  /**
   * @param {object} options
   */
  constructor(options = {}) {
    this.data = {};
    this.options = { ...AbstractLayer.DEFAULT_OPTIONS, ...this.constructor.DEFAULT_OPTIONS, ...options };
    this.initialized = false;
  }

  /**
   * Initialize layer and load it's data, override it
   * @returns {Promise<void>}
   * @async
   */
  async init() {
    throw new Error('Not implemented in AbstractLayer, override it!');
  }

  isInitialized() {
    return this.initialized;
  }

  markInitialized() {
    this.initialized = true;
  }

  /**
   * Get config value by path
   * @param {string} path
   */
  get(path) {
    if (!this.isInitialized()) throw new Error('Layer is not initialized, call markInitialized first');
    const separator = this.options.separator || AbstractLayer.SEPARATOR;
    if (!path) return this.data;
    return get(this.data, path, separator);
  }

  /**
   * Set config value by path
   * @param {string} path
   * @param {*} value
   */
  set(path, value) {
    const separator = this.options.separator || AbstractLayer.SEPARATOR;
    return set(this.data, path, value, separator);
  }

  /**
   * Get class name
   * @returns {string}
   */
  get name() {
    return this.constructor.name;
  }

  destroy() {
  }
}

AbstractLayer.SEPARATOR = '.';
AbstractLayer.DEFAULT_OPTIONS = {
  prefix: '',
  parsingSeparator: '_',
};

module.exports = AbstractLayer;
