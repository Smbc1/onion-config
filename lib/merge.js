'use strict';

const isObject = (val) => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

const assign = (to, from) => {
  if (to === from) return to;

  Object.keys(from).map((key) => {
    const val = from[key];
    if (val == null) {
      return false;
    }
    if (to[key] === undefined || !isObject(val)) {
      to[key] = val;
    } else {
      to[key] = assign(Object(to[key]), from[key]);
    }
  });
  return to;
};

const deepAssign = (target = {}, ...args) => {
  args.map(from => assign(target, from));
  return target;
};

module.exports = deepAssign;