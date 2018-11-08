'use strict';

/**
 * @type {{AbstractLayer: AbstractLayer, Env: EnvLayer, SimpleObject: SimpleObjectLayer, Vault: VaultLayer}}
 */
module.exports = {
  /**
   * @type {AbstractLayer}
   */
  AbstractLayer: require('./abstract'),
  /**
   * @type {EnvLayer}
   */
  Env: require('./env'),
  /**
   * @type {SimpleObjectLayer}
   */
  SimpleObject: require('./simple-object'),
  /**
   * @type {VaultLayer}
   */
  Vault: require('./vault'),
};