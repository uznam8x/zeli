var DB = require('./database');
var pattern = require('./pattern');
var flow = require('./flow');
function wrapping(value) {
  var str = '[' + value + ']';
  return str.replace('[[', '[').replace(']]', ']');
}

module.exports = function (lines = []) {
  DB.init();
  lines.forEach(function (syntax) {
    var code = syntax.split(' --> ');

    var res = flow(code);
    //console.log(res);
    //console.log(res);
    //DB.set(flow);

    //var endpoint = flow.splice(flow.length - 1, 1);
    //console.log(flow, endpoint);
  });
  //console.log(DB.get());
};
