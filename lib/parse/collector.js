var R = require('ramda');
var collect = {};

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hash(prefix) {
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  var result = '';
  var number = 11;
  for (let i = 0; i < number; i++) {
    result += characters[random(0, characters.length - 1)];
  }
  return (prefix || '') + result;
}

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
