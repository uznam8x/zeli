var pipe = require('./lib/pipe');
var parse = require('./lib/parse');
var output = require('./lib/output');

function splitNewLine(text = '') {
  return text.split('---').map(function (value) {
    return value.replace(/\n/g, ' ');
  });
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

function zeli(syntax = ``, option = { output: 'json' }) {
  var rows = pipe(splitNewLine, stringTrim, rejectEmpty)(syntax);

  try {
    var res = output(parse(rows), option.output);
    return res;
  } catch (e) {
    return null;
  }
}

module.exports = zeli;
