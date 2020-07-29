var match = require('./match');

var ARRAY = /\[([^\]]+)\]/g;
var VARIABLES = /([^,]+\[[^\],]*,[^\],]*\]|[^,]+)/g;

function separation(str) {
  var matched = match(new RegExp(ARRAY), str);
  if (matched && matched.length) {
    console.log(matched[1]);
    var res = match(new RegExp(VARIABLES), matched[1]);
    console.log(res);
  }
  return str;
}

module.exports = function (arr) {
  var data = [];
  for (var i = 1, len = arr.length; i < len; i++) {
    separation(arr[i - 1]);
    //data.push([separation(arr[i - 1]), separation(arr[i])]);
  }

  return data;
};
