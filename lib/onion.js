'use strict';

const AbstractLayer = require('./layers/abstract');
const get = require('@strikeentco/get');
const merge = require('./merge');

/**
 * @class Onion
 */
class Onion {
  /**
   * @param {object} [options]
   * @param {string} options.getSeparator Default separator for .get method
   * @param {function} options.mergeMethod Custom layers merge method: function (target, ...args) where target - object
   * to merge to, args - patches, that will be applied in the order of appearance
   * @constructor
   */
  constructor(options) {
    this.options = { ...Onion.DEFAULT_OPTIONS, ...options };
    /**
     *
     * @type {Array.<AbstractLayer>}
     */
    this.layers = [];
    this.data = {};
    this.compilled = false;
  }

  /**
   * Adds layer to storage for further data search
   * @param {AbstractLayer} layer
   * @returns {Promise<void>}
   * @async
   */
  async addLayer(layer) {
    if (!(layer instanceof AbstractLayer)) throw new Error('Layer should be instance of AbstractLayer');
    await layer.init();
    this.layers.push(layer);
  }

  /**
   * Search data by path in merged data, if data is not merged yet, will merge and returns
   * then returns value or error
   * @param {string} path Path to target value
   * @param {string} [separator] Path separator, default is set as options.getSeparator, which default is dot
   * @returns {*}
   */
  get(path = '', separator = this.options.getSeparator) {
    if (!this.compilled) this.compile();
    return get(this.data, path, separator);
  }

  /**
   * Compile config and prepare it for .get()
   */
  compile() {
    this.data = {};
    this.layers.forEach((layer) => {
      const patch = layer.get();
      if (patch === undefined) return;
      this.data = this.options.mergeMethod(this.data, patch);
    });
    this.compilled = true;
  }

  /**
   * Build inner config cache again, can be used for manual runtime layers re-read
   */
  recompile() {
    return this.compile();
  }

  destroy() {
    this.layers.forEach(layer => layer.destroy());
  }
}

Onion.DEFAULT_OPTIONS = {
  getSeparator: '.',
  mergeMethod: merge,
};

Onion.LAYERS = require('./layers');
Onion.AbstractLayer = Onion.LAYERS.AbstractLayer;

module.exports = Onion;
