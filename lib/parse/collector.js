var R = require('ramda');
var collect = {};

module.exports = {
  init: function () {
    collect = { node: {} };
  },
  set: function (data) {
    collect.node = R.mergeDeepWith(R.concat, collect.node)(data);
  },
  get: function () {
    return collect;
  },
};
