var zeli = require('./index.js');

var res = zeli(
  `
    [rect = {width: '100'}], rect
    --> group
    --> svg
`,
  { output: 'xml' }
);

console.log(res);
