const fs = require('fs'),
      path = require('path'),
      parser = require('@babel/parser'),
      traverse = require('@babel/traverse').default,
      babel = require('@babel/core');

const { 
  entry,
  output,
 } = require('./config');

const { getTemp } = require('./templates');

const NODE_MOUDLES_PATH = `${path.dirname(entry)}/node_modules`;

const { EXTENSIONS } = require('./constant');

let id = 0;

const dynamicDeps = [];//code split

function splitCode(id, code) {
  fs.writeFileSync(
    `${id}.${output}`, 
    `window['jsonpArray']['${id}'] = function(require, module, exports) {
      ${code}  
    }`
  );
};

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
  id++;
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
      
      if (name === 'require' || name === 'dynamicImport') {
        const relativePath = arguments[0].value;
        //currently just treat path not starting with . is the internal nodejs module,
        //but actually when node_modules introduce another external dependecies, the path is 
        //not starting with .
        //todo: distinguish the nodejs module and node_modules in node_modules
        if (/^\./.test(relativePath)) {
          dependencies.push(relativePath);
        }

        if (name === 'dynamicImport') {
          const revisedPath = buildPath(relativePath, path.dirname(filename));
          dynamicDeps[revisedPath] = '';
        }
      }
    }
  });
  const { code } = babel.transformFromAstSync(
    ast, 
    null, 
    { 
      presets: ['@babel/preset-env'],
      plugins: [
        {
          visitor: {
            Identifier(path) {
              if (path.node.name === 'dynamicImport') {
                path.node.name = 'require';
              }
            }
          }
        }
      ] 
    }
  );

  return {
    id,
    filename,
    dependencies,
    dynamicDeps,
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
  });

  return asset;
};

createGraph(entry);

const bundle = assets => {
  const modules = assets.reduce((result, asset) => {
    const { id, code, mapping, filename: revisedPath } = asset;
    if (dynamicDeps.hasOwnProperty(revisedPath)) {
      //code split here:
      //1.assume that the dynamic module does't have mapping
      //2.and not allowed to import the same moudle in other place
      splitCode(id, assetsCache[revisedPath].code);
      return result;
    }

    return result += `
      ${id} : [
        function(require, module, exports) {
          ${code}
        },
        ${JSON.stringify(mapping)}
      ],
    `
  }, '');
  
  return getTemp(modules, { output });
}

const result = bundle(Object.values(assetsCache));

fs.writeFileSync(output, result);