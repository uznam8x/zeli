var zeli = require('./index.js');

var canvas = zeli(
  `
    [rect = {width: '100'}, rect]
    --> group
    --> svg
`,
  { output: 'mermaid' }
);

console.log(canvas);
