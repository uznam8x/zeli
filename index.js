var R = require('ramda');
var parse = require('./lib/parse');
var output = require('./lib/output');

function splitNewLine(text = '') {
  return R.pipe(
    R.map(function (value) {
      return value.replace(/\n/g, ' ');
    })
  )(text.split('---'));
}

function stringTrim(arr = []) {
  return arr.map(function (value) {
    return value.trim();
  });
}

function rejectEmpty(arr = []) {
  return arr.filter(function (value) {
    return value.length;
  });
}

function zeli(syntax = ``, option) {
  var rows = R.pipe(splitNewLine, stringTrim, rejectEmpty)(syntax);

  try {
    var res = output(parse(rows), option.output);
    return res;
  } catch (e) {
    return null;
  }
}

module.exports = zeli;
