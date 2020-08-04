var R = require('ramda');
var hash = require('./hash');

function hierarchies(data, key, props = {}) {
  var pointer = data[key] || null;
  if (pointer) {
    var node = {};

    node[key] = { props: props, children: [] };
    var takes = pointer.takes || [];

    if (takes.length) {
      node[key].children = R.pipe(
        R.map(function (value) {
          var item = R.pipe(R.head)(Object.entries(value));
          var res = hierarchies(data, item[0], item[1].props || {});
          return res;
        })
      )(takes);
    }
    return node;
  }

  return {};
}

function encode(plaintext) {
  var object = {
    code: plaintext,
    mermaid: { theme: 'default' },
  };
  return Buffer.from(JSON.stringify(object), 'utf8').toString('base64');
}

function json(data) {
  return JSON.stringify(data);
}

function tree(data) {
  var res = hierarchies(data.node, data.endpoint);
  return JSON.stringify(res);
}

function xml(data) {
  var res = hierarchies(data.node, data.endpoint);

  function element(node) {
    var item = R.pipe(R.head)(Object.entries(node));
    var name = item[0];

    console.log(item);
    var attrs = Object.entries(item[1].props || {}).map(function (args) {
      return ' ' + args[0] + '="' + args[1] + '"';
    });

    var children = '';
    if (item[1].children && item[1].children.length) {
      children = R.map(element)(item[1].children).join('');
    }
    return '<' + name + attrs + '>' + children + '</' + name + '>';
  }

  return element(res);
}

function mermaid(data) {
  var res = hierarchies(data.node, data.endpoint);
  function element(node, suffix = null) {
    var item = R.pipe(R.head)(Object.entries(node));
    var name = hash() + '[' + item[0] + ']';

    suffix = suffix ? ' --> ' + suffix : '';
    if (item[1].children && item[1].children.length) {
      var child = R.map(function (value) {
        return element(value, name);
      })(item[1].children);
      return child.join('\n') + suffix;
    }

    return name + suffix;
  }

  res = 'graph TD\n  ' + element(res).split('\n').join('\n  ');

  var description =
    '# see: https://mermaid-js.github.io/mermaid-live-editor/#/edit/' +
    encode(res) +
    '\n\n' +
    res;
  return description;
}

var format = {
  xml: xml,
  mermaid: mermaid,
  json: json,
  tree: tree,
};

module.exports = function (data, output) {
  if (format.hasOwnProperty(output)) {
    return format[output](data);
  }
  return data;
};
