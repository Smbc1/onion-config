'use strict';

const get = require('@strikeentco/get');
const merge = require('./merge');

class Onion {
  constructor() {
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
    await layer.init();
    this.layers.push(layer);
  }

  /**
   * Search data by path in layers stack, from *last added*  to *first added* until finds any info,
   * then returns value or error
   * @param {string} path
   * @returns {*}
   */
  get(path = '') {
    if (!this.compilled) this.compile();
    return get(this.data, path);
  }

  /**
   * Compile config and prepare it for .get()
   * @returns {Promise<void>}
   * @async
   */
  async compile() {
    this.data = {};
    this.layers.forEach((layer) => {
      const patch = layer.get();
      if (patch === undefined) return;
      this.data = merge(this.data, patch);
    });
    this.compilled = true;
  }

  /**
   * Build inner config cache again
   * @returns {Promise<void>}
   * @async
   */
  async recompile() {
    return this.compile();
  }
}

Onion.AbstractLayer = require('./layers/abstract');
Onion.LAYERS = require('./layers');

module.exports = Onion;
