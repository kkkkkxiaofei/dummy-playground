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
    asset.mapping = {};
    asset.dependencies.forEach(relativePath => {
      const absPath = path.join(path.dirname(filename), relativePath);
      const depAsset = createAsset(absPath);
      asset.mapping[relativePath] = depAsset.id;
      assets.push(depAsset);// keep iteration
    })
  }

  return assets;
};

const assets = createAssets('examples/main.js');

const bundle = assets => {
  const modules = assets.reduce((result, asset) => 
    result += `
      ${asset.id} : [
        function(require, module, exports) {
          ${asset.code}
        },
        ${JSON.stringify(asset.mapping)}
      ],
    `, '');
  
  const result = `
    (function(modules) {
      function load(id) {
        const [factory, mapping] = modules[id];
        function require(relativePath) {
          return load(mapping[relativePath]);
        }
        const module = {
          exports: {}
        }
        factory(require, module, module.exports);
        return module.exports;
      }
      load(0);
    })({${modules}});
  `;

  return result;
}

const result = bundle(assets);

console.log(result);