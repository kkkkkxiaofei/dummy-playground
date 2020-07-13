const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

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

  const { code } = babel.transformFromAstSync(
    ast, 
    null, 
    { 
      presets: ['@babel/preset-env'] 
    }
  );

  return {
    id: id++,
    filename,
    dependencies,
    code
  }
};

const createAssets = function(filename) {
  const assets = [createAsset(filename)];

  for (let asset of assets) {
    asset.dependencies.forEach(relativePath => {
      const absPath = path.join(path.dirname(filename), relativePath);
      assets.push(createAsset(absPath));// keep iteration
    })
  }

  return assets;
};

const assets = createAssets('examples/main.js');

const bundle = assets => {

}

// const result = bundle(assets);

console.log(assets);