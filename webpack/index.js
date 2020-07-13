const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

let id = 0;

const createAsset = function(filename) {
  const file = fs.readFileSync(filename, 'utf8');

  const ast = parser.parse(file, { sourceType: 'module' });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      dependencies.push(node.source.value);
    }
  });

  return {
    id: id++,
    filename,
    dependencies
  }
};


const graphMap = {};

const createGraph = function(filename) {
  let asset = graphMap[filename];

  if (!asset) {
    asset = graphMap[filename] = createAsset(filename);
  }

  asset.dependencies.forEach(dep => {
    const absPath = path.join(path.dirname(filename), dep);
    createGraph(absPath);
  });
};

const output = createGraph('examples/main.js');

console.log(graphMap);