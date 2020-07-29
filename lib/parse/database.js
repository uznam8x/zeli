var collect = {};
module.exports = {
  init: function () {
    collect = {};
  },
  set: function (arr) {
    arr.forEach(function (key) {
      collect[key] = { connection: [] };
    });
  },
  get: function () {
    return collect;
  },
};
