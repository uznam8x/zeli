function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function (number = 11) {
  var characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  var result = '';
  for (var i = 0; i < number; i++) {
    result += characters[random(0, characters.length - 1)];
  }
  return result;
};
