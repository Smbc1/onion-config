'use strict';

const AbstractLayer = require('./abstract');

/**
 * Simple layer to store config right out-of-code
 */
class SimpleObjectLayer extends AbstractLayer {
  /**
   * @inheritDoc
   */
  async init() {
    this.markInitialized();
    this.data = this.options.data || {};
  }
}

module.exports = SimpleObjectLayer;
