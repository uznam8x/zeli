var R = require('ramda');
var match = require('./match');

var PROPS = /=[\s]?(\{.+?)[,]?$/g;

function getProps(str) {
  var matched = match(new RegExp(PROPS), str);
  if (matched && matched.length) {
    return { props: new Function('return' + matched[1] + ';')() };
  }
  return { props: {} };
}

function getItem(str) {
  var key = str.match(/(^[\w]+)/g);
  var value = getProps(str.replace(key, ''));
  var res = {
    key: key[0] || '',
    value: value,
  };
  return res;
}

module.exports = function (arr) {
  var data = arr.reduce(function (collect, value, index, arr) {
    var item = getItem(value);
    var instance = {
      takes: [],
    };

    if (index > 0) {
      var target = getItem(arr[index - 1]);

      var obj = {};
      obj[target.key] = target.value;
      instance.takes = [obj];
    }

    collect[item.key] = instance;

    return collect;
  }, {});

  return data;
};
