module.exports = {
  getTemp: function (deps, config) {
    const {
      output: {
        library,
        libraryTarget,
        filename,
        publicPath = ''
      }
    } = config;

    const REQUEST_CHUNK = `(function(id) {
  (self || this)['jsonpArray'] = (self || this)['jsonpArray'] || {};
  const script = document.createElement('script');
  script.src = \`${publicPath}/dist/\${id}.${filename}\`;
  document.body.appendChild(script);
  return new Promise(function(res, rej) {
    script.onload = function() {
      const factory = (self || this)['jsonpArray'][id];
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
        // todo: why this happen
        if (isNaN(id)) {
          return {}
        }
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
      return `
        var self = self || this;
        (function(root, factory) {
          //commonjs2    
          if (typeof module === 'Object' && typeof exports === 'Object') 
            module.exports = factory();
          //commonjs1
          else if(typeof exports === 'Object') 
            exports['dummy'] = factory();
          else 
            root['${library}'] = factory();
        })(self, ${buildFactory(deps)});
      `
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
    return `(self || this)['jsonpArray']['${id}'] = function(require, module, exports) {
      ${code}  
    }`
  }
};