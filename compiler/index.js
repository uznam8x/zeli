var { Parser } = require('jison');
var fs = require('fs');
var path = require('path');
var source = fs
  .readFileSync(path.resolve(__dirname, 'grammar.jison'))
  .toString('utf8');

var parser = new Parser(source);

var string = `bb --> [cc = { a: 1, b: [1,2] }, b = {width: 100}] -|title|-> a = { b: [1,2,3]} --> [a, b, c]`;

string =
  string
    .replace(/\n/g, '')
    .replace(/,/gm, ',\n')
    .replace(/\]/gm, '\n]')
    .replace(/\[/gm, '[\n')
    .replace(/(\-\-\>)/gm, '\n$1\n')
    .replace(/(\-\|.+->)/g, '\n$1\n')
    .replace(/,\s+([\w+]:)/g, ', $1')
    .replace(/=\s?\{[\s]?[\w+]:(.|\n)+?}[,|\s+]/g, function (match) {
      return match.replace(/\n/g, '');
    }) + '\n';

console.log(
  //parser.parse('b --> [a1 = {width: 100},a2 = { height: 100 }] --> c')
  parser.parse(string)
);
