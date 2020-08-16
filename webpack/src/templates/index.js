const { 
  library, 
  libraryTarget, 
  output, 
  publicPath = ''
} = require('../config');

function requestChunk() {
  return `
    return (function(id) {
      window['jsonpArray'] = window['jsonpArray'] || {};
      const script = document.createElement('script');
      script.src = \`${publicPath}/\${id}.${output}\`;
      document.body.appendChild(script);
      return new Promise(function(res, rej) {
        script.onload = function() {
          const factory = window['jsonpArray'][id];
          const module = {
            exports: {}
          }
          factory(null, module, module.exports);
          res(module.exports);
        }
      })
    })(id)
  `;
};

function buildFactory(deps) { 
  return `
    (function(modules) {
      function load(id) {
        if (!modules[id]) {
          ${requestChunk()}
        }
        const [factory, mapping] = modules[id];
        function require(relativePath) {
          return load(mapping[relativePath]);
        }
        const module = {
          exports: {}
        }
        const result = factory(require, module, module.exports);
        if (module.exports && Object.getOwnPropertyNames(module.exports).length === 0) {
          return result;
        }
        return module.exports;
      }
      return function() {
        return load(0);
      }
    })({${deps}})
  `;
};

function umd(deps, { output }) {
  return `(function(root, factory) {
    if (typeof module === 'Object' && typeof exports === 'Object') 
      exports['dummy'] = factory();
    else 
      root['${library}'] = factory();
  })(window, ${buildFactory(deps)});`    
}

function _var(deps) {
  return `
    (${buildFactory(deps)})()
  `
}

module.exports = {
  getTemp: function(deps, config) {
    if (libraryTarget === 'umd') {
      return umd(deps, config);
    }
    return _var(deps);
  }
};

