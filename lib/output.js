var R = require('ramda');
var hash = require('./hash');

function hierarchies(data, key) {
  var pointer = data[key] || null;
  if (pointer) {
    var str = hash() + '[' + key + ']';
    var takes = pointer.takes || [];

    if (takes.length) {
      var child = R.pipe(
        R.map(function (value) {
          var res = hierarchies(data, R.pipe(R.keys, R.head)(value));

          return res + ' --> ' + str;
        }),
        R.join('\n')
      )(takes);

      return child;
    }
    return str;
  }
  return '';
}

function encode(plaintext) {
  var object = {
    code: plaintext,
    mermaid: { theme: 'default' },
  };
  return Buffer.from(JSON.stringify(object), 'utf8').toString('base64');
}

function mermaid(data) {
  var res = hierarchies(data.node, data.endpoint);
  res = 'graph TD\n' + res;
  var description =
    '# see: https://mermaid-js.github.io/mermaid-live-editor/#/edit/' +
    encode(res) +
    '\n';
  description += res;
  return description;
}
module.exports = function (data, output) {
  if (output === 'json') {
    return JSON.stringify(data);
  }
  if (output === 'mermaid') {
    return mermaid(data);
  }
  return data;
};
