module.exports = function (regex, str) {
  var m;
  var matched = [];
  while ((m = regex.exec(str)) !== null) {
    m.forEach((match, groupIndex) => {
      matched.push(match);
    });
  }

  return matched;
};
