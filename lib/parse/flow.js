var R = require('ramda');
var match = require('./match');

var ARRAY = /\[([^\]]+)\]/g;
var PROPS = /=[\s]?(\{.+?)[,]?$/g;
//var VARIABLES = /([^,]+\[[^\],]*,[^\],]*\]|[^,]+)/g;
/*
function separation(str) {
  var matched = match(new RegExp(ARRAY), str);
  if (matched && matched.length) {
    console.log(matched[1]);
    var res = match(new RegExp(VARIABLES), matched[1]);
    console.log(res);
  }
  return str;
}
*/
function getProps(str) {
  var matched = match(new RegExp(PROPS), str);
  if (matched && matched.length) {
    return new Function('return' + matched[1] + ';')();
  }
  return {};
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
  /* var res = arr.map(function (value) {
    var matched = match(new RegExp(ARRAY), value);
    if (matched && matched.length) {
      var aa = matched[1].replace(/,/g, ',\n');
      aa = aa.replace(/(\n[\s]?[\w]+[\s]?:)/g, '');
      return aa.split('\n');
    }
    return value;
  });
 */

  var data = arr.reduce(function (collect, value, index, arr) {
    var item = getItem(value);
    var instance = {
      props: item.value,
      connections: [],
    };

    if (index > 0) {
      instance.connections = [getItem(arr[index - 1]).key];
    }

    collect[item.key] = instance;

    return collect;
  }, {});

  return data;
};
