var collector = require('./collector');
var flow = require('./flow');
var match = require('./match');
var R = require('ramda');

function breakup(str) {
  /*
    input
    [meta, meta] --> head -->html

    output(array)
    [
    '[meta, meta]'
    'head'
    'html'
    ]
  */
  var res = str
    .replace(/([\s]?\-\-\>[\s]?)/g, '\n')
    .split('\n')
    .map(R.trim);

  return res;
}

function getNodes(str) {
  /*
    input
    meta = {}, meta = {}, meta

    output(array)
    meta = {},
     meta = {},
     meta

    ,(콤마) 기준으로 나눈 후 object 가 포함된 경우는 다시 한 줄로 합친다.
  */
  var line = str.replace(/,/g, ',\n');

  line = line
    .replace(/\n([\s]?[\w]+[\s]?:)/g, '$1')
    .split('\n')
    .map(R.trim);

  return line;
}

function makeUp(arr) {
  return arr
    .reduce(function (a, b, index, items) {
      var matched = match(/\[([^\]]+)\]/g, b);
      // [meta,meta] 와 같이 Array 로 포함되어 있다면 라인을 분리 한다.
      if (matched && matched.length) {
        var line = getNodes(matched[1]);

        // 이전과 병합
        var prev = line.map(function (value) {
          value = value.replace(/(,)$/g, '');
          if (items[index - 1]) {
            var target = items[index - 1].trim();
            return target + ' --> ' + value;
          }
          return null;
        });

        // 다음과 병합
        var next = line.map(function (value) {
          value = value.replace(/(,)$/g, '');
          if (items[index + 1]) {
            var target = items[index + 1].trim();
            return value + ' --> ' + target;
          }
          return null;
        });

        a = a.concat(prev, next);
      } else {
        if (items[index + 1]) {
          a.push(String(b + ' --> ' + items[index + 1]).trim());
        }
      }
      return a;
    }, [])
    .filter(function (value) {
      var matched = match(/\[([^\]]+)\]/g, value);
      return !(matched && matched.length) && value;
    });
}

function getCommandLines(lines) {
  var res = R.map(function (syntax) {
    return R.pipe(breakup, makeUp)(syntax);
  })(lines);
  return R.flatten(res);
}

module.exports = function (lines = []) {
  collector.init();

  var res = getCommandLines(lines);
  R.forEach(function (syntax) {
    var code = syntax.split(' --> ');
    var cmd = flow(code);
    collector.set(cmd);
  })(res);

  var endpoint = R.pipe(R.last, R.split('-->'), R.last, R.trim)(res);

  const collection = R.merge(collector.get(), { endpoint: endpoint });
  return collection;
};
