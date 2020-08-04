var R = require('ramda');
var match = require('./match');

var REG_PROPS = /=[\s]?(\{.+?)[,]?$/g;

function getProps(str) {
  var matched = match(new RegExp(REG_PROPS), str);
  return matched && matched.length
    ? { props: new Function('return' + matched[1] + ';')() }
    : {};
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
  var data = R.addIndex(R.reduce)(function (collect, value, index) {
    var item = getItem(value);
    var instance = {};
    if (index > 0) {
      var target = getItem(arr[index - 1]);
      var obj = R.assoc(target.key, target.value)({});
      instance = R.assoc('takes', [obj])(instance);
    }

    return R.assoc(item.key, instance)(collect);
  }, {})(arr);

  return data;
};
