var zeli = require('./index.js');
var canvas = zeli(`
    [rect = {width: '100'}, rect]
    --> group
    --> svg
`);

console.log(JSON.stringify(canvas, null, 2));
