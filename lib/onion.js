'use strict';

const AbstractLayer = require('./layers/abstract');
const get = require('@strikeentco/get');
const set = require('@strikeentco/set');
const merge = require('./merge');

/**
 * @class Onion
 */
class Onion {
  /**
   * @param {object} [options]
   * @param {string} [options.getSeparator] Default separator for .get method
   * @param {function} [options.mergeMethod] Custom layers merge method: function (target, ...args) where target - object
   * @param {boolean} [options.links] Allow config links: '@<path.with.separators>'
   * @param {boolean} [options.ignoreWrongLinks] Ignore wrong links
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
    if (this.options.links) this.link();
    this.compilled = true;
  }

  /**
   * Build inner config cache again, can be used for manual runtime layers re-read
   */
  recompile() {
    return this.compile();
  }

  link() {
    const iteration = (part, path = '') => {
      if (typeof part === 'string' && part.startsWith(this.options.linkPrefix)) {
        const linkPath = part.substr(1, part.length - 1);
        const value = get(this.data, linkPath);
        if (value === undefined && !this.options.ignoreWrongLinks) {
          throw new Error(`Link ${linkPath} have no value`);
        }
        this.data = set(this.data, path, value, this.options.getSeparator);
      } else if (typeof part === 'object') {
        Object.keys(part).forEach((k) => {
          const nextPath = path ? `${path}${this.options.getSeparator}${k}` : k;
          return iteration(part[k], nextPath);
        });
      }
    };

    return iteration(this.data);
  }

  destroy() {
    this.layers.forEach(layer => layer.destroy());
  }
}

Onion.DEFAULT_OPTIONS = {
  getSeparator: '.',
  mergeMethod: merge,
  links: false,
  linkPrefix: '@',
};

Onion.LAYERS = require('./layers');
Onion.AbstractLayer = Onion.LAYERS.AbstractLayer;

module.exports = Onion;
