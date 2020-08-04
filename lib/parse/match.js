module.exports = function (regex, str) {
  var m;
  var matched = [];
  while ((m = regex.exec(str)) !== null) {
    matched = matched.concat(m);
  }
  return matched;
};
