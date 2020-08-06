const fs = require('fs'),
      path = require('path'),
      parser = require('@babel/parser'),
      traverse = require('@babel/traverse').default,
      babel = require('@babel/core');

const { entry } = require('./config');

const NODE_MOUDLES_PATH = `${path.dirname(entry)}/node_modules`;

let id = 0;

function revisePath(absPath) {
  const ext = path.extname(absPath);
  
  if (ext && ext !== '.js') {
    throw new Error('Only support bundle logic for js file...')
  }

  if (ext !== '.js') {
    if (fs.existsSync(`${absPath}.js`)) {
      return `${absPath}.js`;
    }

    if (fs.existsSync(`${absPath}/index.js`)) {
      return `${absPath}/index.js`;
    }
    throw new Error(`Can not revise the path ${absPath}`)
  }
  //here relative path is absolute path
  return absPath;
}

function buildPath(relativePath, dirname) {
  if (relativePath === entry) {
    return relativePath;
  }

  let absPath = relativePath;
  if (/^\./.test(relativePath)) {
    absPath = path.join(dirname, relativePath);
    
  } else {
    absPath = path.join(NODE_MOUDLES_PATH, relativePath);
  }

  return revisePath(absPath);
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
    const revisedPath  = buildPath(relativePath, path.dirname(filename));
    const depAsset = createGraph(revisedPath);
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