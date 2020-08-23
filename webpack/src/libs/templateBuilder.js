module.exports = {
  getTemp: function (deps, config) {
    const {
      library,
      libraryTarget,
      output,
      publicPath = ''
    } = config;

    const REQUEST_CHUNK = `
(function(id) {
  window['jsonpArray'] = window['jsonpArray'] || {};
  const script = document.createElement('script');
  script.src = \`${publicPath}/dist/\${id}.${output}\`;
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

    function buildFactory(deps) {
      return `
    (function(modules) {
      function load(id) {
        if (!modules[id]) {
          return ${REQUEST_CHUNK}
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

    function umd(deps) {
      return `(function(root, factory) {
    //commonjs2    
    if (typeof module === 'Object' && typeof exports === 'Object') 
      module.exports = factory();
    //commonjs1
    else if(typeof exports === 'Object') 
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


    if (libraryTarget === 'umd') {
      return umd(deps);
    }
    return _var(deps);
  },
  buildDynamicFactory: function (id, code) {
    return `window['jsonpArray']['${id}'] = function(require, module, exports) {
      ${code}  
    }`
  }
};