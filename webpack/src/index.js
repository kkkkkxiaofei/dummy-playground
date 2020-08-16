const fs = require('fs'),
      path = require('path'),
      parser = require('@babel/parser'),
      traverse = require('@babel/traverse').default,
      babel = require('@babel/core');

const { entry, output } = global.config = require('./config');

const buildPath = require('./libs/pathBuilder');

const { getTemp, buildDynamicFactory } = require('./templates');

let id = -1;

const dynamicDeps = [];//code split

function splitCode(id, code) {
  fs.writeFileSync(
    `${id}.${output}`, 
    buildDynamicFactory(id,code)
  );
};

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
  
  return getTemp(modules);
}

const result = bundle(Object.values(assetsCache));

fs.writeFileSync(output, result);