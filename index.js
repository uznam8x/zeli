var pipe = require('./lib/pipe');
var parse = require('./lib/parse');

function splitNewLine(text = '') {
  return text.split('\n');
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

function zeli(syntax = ``) {
  var rows = pipe(splitNewLine, stringTrim, rejectEmpty)(syntax);
  parse(rows);
}
module.exports = zeli;
