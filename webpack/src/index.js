const fs = require('fs'),
      path = require('path'),
      parser = require('@babel/parser'),
      traverse = require('@babel/traverse').default,
      babel = require('@babel/core');

const { entry } = require('./config');

let id = 0;

function analyze(filename) {
  const ext = path.extname(filename);
  if (ext && ext !== '.js') {
    throw new Error('Only support bundle logic for js file...')
  }
  function findPath(relativePath) {
    const prefix = relativePath;
    if (fs.existsSync(prefix)) {
      return prefix;
    }

    if (fs.existsSync(`${prefix}.js`)) {
      return `${prefix}.js`;
    }

    if (fs.existsSync(`${prefix}/index.js`)) {
      return `${prefix}/index.js`;
    }
  }

  const result = findPath(filename);

  if (result) {
    return result;
  } else {
    const modulePath = findPath(`node_modules/${filename}`)
    return modulePath;
  }
}

function createAsset(filename) {
  const file = fs.readFileSync(filename, 'utf8');

  const ast = parser.parse(file, { sourceType: 'module' });
  const dependencies = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      const relativePath = node.source.value;
      // need transfer it to current path, then to resolve absolut path
      const currentPath = path.join(path.dirname(filename), relativePath);
      if (path.resolve(currentPath) === path.resolve(filename)) {
        throw new Error(`self reference found in : ${filename}`)
      }
      dependencies.push(relativePath);
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

const assets = [];

function createGraph(filename) {
  const asset = createAsset(filename);
  assets.push(asset);

  asset.mapping = {};
  asset.dependencies.forEach(relativePath => {
    const absPath = path.join(path.dirname(filename), relativePath);
    console.log(filename, relativePath, absPath)

    const depAsset = createGraph(absPath);
    asset.mapping[relativePath] = depAsset.id;
  })
  return asset;
};

createGraph(entry);
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

fs.writeFile('bundle.js', result, $ => $);