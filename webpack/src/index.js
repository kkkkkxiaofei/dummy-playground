const fs = require('fs'),
      path = require('path'),
      parser = require('@babel/parser'),
      traverse = require('@babel/traverse').default,
      babel = require('@babel/core');

const { 
  entry,
  filename,
  library,

 } = require('./config');

const { umd } = require('./templates');

const NODE_MOUDLES_PATH = `${path.dirname(entry)}/node_modules`;

const { EXTENSIONS } = require('./constant');

let id = 0;

function revisePath(absPath) {
  const ext = path.extname(absPath);
  if (ext) {
    if (EXTENSIONS.indexOf(ext) === -1) {
      throw new Error(`Only support bundler for (${EXTENSIONS}) file, current ext is ${ext}`)
    }
    if (fs.existsSync(absPath)) {
      return absPath;
    }  
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

  const dependencies = [];

  //todo: for different file loader here
  if (/.json$/.test(filename)) {
    return {
      id: id++,
      filename,
      dependencies,
      code: `return ${file}`
    }
  }

  const ast = parser.parse(file, { sourceType: 'module' });

  traverse(ast, {
    ImportDeclaration({ node }) {
      const relativePath = node.source.value;
      dependencies.push(relativePath);
    },
    CallExpression({ node }) {
      const { callee: { name }, arguments } = node;
      if (name === 'require') {
        const relativePath = arguments[0].value;
        //currently just treat path not starting with . is the internal nodejs module,
        //but actually when node_modules introduce another external dependecies, the path is 
        //not starting with . neight
        //todo: distinguish the nodejs module and node_modules in node_modules
        if (/^\./.test(relativePath)) {
          dependencies.push(relativePath);
        }
      }
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

const assetsCache = {};

function createGraph(filename) {
  const cache = assetsCache[filename];
  
  if (cache) return cache;

  const asset = createAsset(filename);
  assetsCache[filename] = asset;

  asset.mapping = {};
  asset.dependencies.forEach(relativePath => {
    const revisedPath  = buildPath(relativePath, path.dirname(filename));
    console.log(`Start extracting: ${revisedPath}`);
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
  
  return umd(modules);
}

const result = bundle(Object.values(assetsCache));

fs.writeFile(filename, result, $ => $);