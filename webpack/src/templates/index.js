const { library, libraryTarget, output } = require('../config');

function requestChunk() {
  //todo config the publicPath
  return `
    (function(id) {
      window['jsonpArray'] = window['jsonpArray'] || {};
      const script = document.createElement('script');
      script.src = \`/\${id}.\${output}\`;
      
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
          return ${requestChunk()}
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
    const window = window || {};
    const jsonpArray = window[${output}] = window[${output}] || [];

    if (typeof module === 'Object' && typeof exports === 'Object') 
      exports['dummy'] = factory();
    else 
      root['${library}'] = factory();
  })(window, ${buildFactory(deps)});`    
}

function _var(deps) {
  return `
  (function(modules) {
    function load(id) {
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
    load(0);
  })({${deps}});
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

