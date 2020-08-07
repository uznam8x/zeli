const MERMAID_DOM_ID_PREFIX = '';

let firstGraphFlag = true;
let vertices = {};
let edges = [];
let classes = [];
let subGraphs = [];
let subGraphLookup = {};
let tooltips = {};
let subCount = 0;
let direction;
// Functions to be run after graph rendering
let funs = [];

var firstGraph = () => {
  if (firstGraphFlag) {
    firstGraphFlag = false;
    return true;
  }
  return false;
};

var addVertex = function (_id, text, type, style, classes) {
  let txt;
  let id = _id;
  if (typeof id === 'undefined') {
    return;
  }
  if (id.trim().length === 0) {
    return;
  }

  if (id[0].match(/\d/)) id = MERMAID_DOM_ID_PREFIX + id;

  if (typeof vertices[id] === 'undefined') {
    vertices[id] = { id: id, styles: [], classes: [] };
  }
  if (typeof text !== 'undefined') {
    config = configApi.defaultConfig;
    txt = common.sanitizeText(text.trim(), config);

    // strip quotes if string starts and ends with a quote
    if (txt[0] === '"' && txt[txt.length - 1] === '"') {
      txt = txt.substring(1, txt.length - 1);
    }

    vertices[id].text = txt;
  } else {
    if (typeof vertices[id].text === 'undefined') {
      vertices[id].text = _id;
    }
  }
  if (typeof type !== 'undefined') {
    vertices[id].type = type;
  }
  if (typeof style !== 'undefined') {
    if (style !== null) {
      style.forEach(function (s) {
        vertices[id].styles.push(s);
      });
    }
  }
  if (typeof classes !== 'undefined') {
    if (classes !== null) {
      classes.forEach(function (s) {
        vertices[id].classes.push(s);
      });
    }
  }
};

var clear = () => {};

var setDirection = function (dir) {
  direction = dir;
  if (direction.match(/.*</)) {
    direction = 'RL';
  }
  if (direction.match(/.*\^/)) {
    direction = 'BT';
  }
  if (direction.match(/.*>/)) {
    direction = 'LR';
  }
  if (direction.match(/.*v/)) {
    direction = 'TB';
  }
};

const destructStartLink = (_str) => {
  const str = _str.trim();

  switch (str) {
    case '<--':
      return { type: 'arrow_point', stroke: 'normal' };
    case 'x--':
      return { type: 'arrow_cross', stroke: 'normal' };
    case 'o--':
      return { type: 'arrow_circle', stroke: 'normal' };
    case '<-.':
      return { type: 'arrow_point', stroke: 'dotted' };
    case 'x-.':
      return { type: 'arrow_cross', stroke: 'dotted' };
    case 'o-.':
      return { type: 'arrow_circle', stroke: 'dotted' };
    case '<==':
      return { type: 'arrow_point', stroke: 'thick' };
    case 'x==':
      return { type: 'arrow_cross', stroke: 'thick' };
    case 'o==':
      return { type: 'arrow_circle', stroke: 'thick' };
    case '--':
      return { type: 'arrow_open', stroke: 'normal' };
    case '==':
      return { type: 'arrow_open', stroke: 'thick' };
    case '-.':
      return { type: 'arrow_open', stroke: 'dotted' };
  }
};

const destructEndLink = (_str) => {
  const str = _str.trim();

  switch (str) {
    case '--x':
      return { type: 'arrow_cross', stroke: 'normal' };
    case '-->':
      return { type: 'arrow_point', stroke: 'normal' };
    case '<-->':
      return { type: 'double_arrow_point', stroke: 'normal' };
    case 'x--x':
      return { type: 'double_arrow_cross', stroke: 'normal' };
    case 'o--o':
      return { type: 'double_arrow_circle', stroke: 'normal' };
    case 'o.-o':
      return { type: 'double_arrow_circle', stroke: 'dotted' };
    case '<==>':
      return { type: 'double_arrow_point', stroke: 'thick' };
    case 'o==o':
      return { type: 'double_arrow_circle', stroke: 'thick' };
    case 'x==x':
      return { type: 'double_arrow_cross', stroke: 'thick' };
    case 'x.-x':
      return { type: 'double_arrow_cross', stroke: 'dotted' };
    case 'x-.-x':
      return { type: 'double_arrow_cross', stroke: 'dotted' };
    case '<.->':
      return { type: 'double_arrow_point', stroke: 'dotted' };
    case '<-.->':
      return { type: 'double_arrow_point', stroke: 'dotted' };
    case 'o-.-o':
      return { type: 'double_arrow_circle', stroke: 'dotted' };
    case '--o':
      return { type: 'arrow_circle', stroke: 'normal' };
    case '---':
      return { type: 'arrow_open', stroke: 'normal' };
    case '-.-x':
      return { type: 'arrow_cross', stroke: 'dotted' };
    case '-.->':
      return { type: 'arrow_point', stroke: 'dotted' };
    case '-.-o':
      return { type: 'arrow_circle', stroke: 'dotted' };
    case '-.-':
      return { type: 'arrow_open', stroke: 'dotted' };
    case '.-x':
      return { type: 'arrow_cross', stroke: 'dotted' };
    case '.->':
      return { type: 'arrow_point', stroke: 'dotted' };
    case '.-o':
      return { type: 'arrow_circle', stroke: 'dotted' };
    case '.-':
      return { type: 'arrow_open', stroke: 'dotted' };
    case '==x':
      return { type: 'arrow_cross', stroke: 'thick' };
    case '==>':
      return { type: 'arrow_point', stroke: 'thick' };
    case '==o':
      return { type: 'arrow_circle', stroke: 'thick' };
    case '===':
      return { type: 'arrow_open', stroke: 'thick' };
  }
};

const destructLink = (_str, _startStr) => {
  const info = destructEndLink(_str);
  let startInfo;
  if (_startStr) {
    startInfo = destructStartLink(_startStr);

    if (startInfo.stroke !== info.stroke) {
      return { type: 'INVALID', stroke: 'INVALID' };
    }

    if (startInfo.type === 'arrow_open') {
      // -- xyz -->  - take arrow type form ending
      startInfo.type = info.type;
    } else {
      // x-- xyz -->  - not supported
      if (startInfo.type !== info.type)
        return { type: 'INVALID', stroke: 'INVALID' };

      startInfo.type = 'double_' + startInfo.type;
    }

    if (startInfo.type === 'double_arrow') {
      startInfo.type = 'double_arrow_point';
    }

    return startInfo;
  }

  return info;
};

var addSingleLink = function (_start, _end, type, linktext) {
  let start = _start;
  let end = _end;
  if (start[0].match(/\d/)) start = MERMAID_DOM_ID_PREFIX + start;
  if (end[0].match(/\d/)) end = MERMAID_DOM_ID_PREFIX + end;
  // logger.info('Got edge...', start, end);

  const edge = { start: start, end: end, type: undefined, text: '' };
  linktext = type.text;

  if (typeof linktext !== 'undefined') {
    edge.text = common.sanitizeText(linktext.trim(), config);

    // strip quotes if string starts and exnds with a quote
    if (edge.text[0] === '"' && edge.text[edge.text.length - 1] === '"') {
      edge.text = edge.text.substring(1, edge.text.length - 1);
    }
  }

  if (typeof type !== 'undefined') {
    edge.type = type.type;
    edge.stroke = type.stroke;
  }
  edges.push(edge);
};
var addLink = function (_start, _end, type, linktext) {
  let i, j;
  for (i = 0; i < _start.length; i++) {
    for (j = 0; j < _end.length; j++) {
      addSingleLink(_start[i], _end[j], type, linktext);
    }
  }
};

var getVertices = function () {
  return vertices;
};

var getEdges = function () {
  return edges;
};

module.exports = {
  lex: {
    firstGraph,
  },
  addVertex,
  clear,
  setDirection,
  destructLink,
  addLink,
  getVertices,
  getEdges,
};
