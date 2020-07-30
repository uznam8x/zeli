var R = require('ramda');
var collect = {};
module.exports = {
  init: function () {
    collect = {};
  },
  set: function (data) {
    collect = R.mergeDeepWith(R.concat, collect)(data);
  },
  get: function () {
    return collect;
  },
};
