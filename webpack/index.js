const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const createAsset = function(filename) {
  const file = fs.readFileSync(filename, 'utf8');

  const ast = parser.parse(file, { sourceType: 'module' });

  let id = 0, dependencies = [];

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
}

const output = createAsset('examples/entry.js');

console.log(output);