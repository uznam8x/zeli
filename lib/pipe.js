module.exports = function () {
  var fns = [].slice.call(arguments);
  return function (x) {
    return fns.reduce(function (a, b) {
      return b(a);
    }, x);
  };
};
